import React, { useState, useEffect } from 'react';
import { Box, Text, Image, Flex, Button, Table, Thead, Link as ChakraLink, Tbody, Tr, Th, Td, useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { Link as RouterLink } from 'react-router-dom';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import registerAbi from './registerAbi.json';
import nftAbi from './nftMintAbi.json';
import ClaimRewards from './ClaimRewardsComponent/ClaimRewards';
import MiniMintPoly from '../MintNowMiniPolyV2/MintNow2nopadding';
import MiniMintBsc from '../MintNowMini/MintNow2nopadding';
import Footer from '../Footer/Footer';

const NFTMINT_CONTRACT_ADDRESS = '0x605923BE39B14AEA67F0087652a2b4bd64c18Bb8';
const REGISTER_CONTRACT_ADDRESS = '0x806d861aFE5d2E4B3f6Eb07A4626E4a7621B90b3';
const METADATA_BASE_URL = 'https://raw.githubusercontent.com/ArielRin/Pigz-and-Robbers-Pirate-Pigz-Application/fixfoot/public/137nftdataV2/Metadata/';
const requiredTraits = ['Pirate Ship', 'Tavern', 'Island', 'Treasure Chest', 'Market'];
const marketplaceUrl = 'https://element.market/collections/pirate-pigz-v2';
const BASE_CHAIN_ID = '0x2105'; // Hexadecimal representation of 8453

const UserStats = () => {
  const [nftTraits, setNftTraits] = useState<{ tokenId: number; trait: string; isRegistered: boolean; imageUrl: string }[]>([]);
  const [validClaims, setValidClaims] = useState<number>(0);
  const [collectedClaims, setCollectedClaims] = useState<number>(0);
  const [traitCounts, setTraitCounts] = useState<Record<string, number>>({});
  const [missingTraits, setMissingTraits] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  useEffect(() => {
    const switchToBase = async () => {
      try {
        const ethereum = window.ethereum as any;
        if (ethereum) {
          const currentChainId = await ethereum.request({ method: 'eth_chainId' });
          if (currentChainId !== BASE_CHAIN_ID) {
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: BASE_CHAIN_ID }],
            });
          }
        } else {
          console.error('Ethereum object not found');
        }
      } catch (error) {
        console.error('Error switching network:', error);
        toast({
          title: 'Network Error',
          description: 'Please switch to the Base network manually.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    switchToBase();

    const fetchUserStats = async () => {
      if (!address || !walletProvider) return;
      setLoading(true);

      try {
        const provider = new ethers.BrowserProvider(walletProvider);
        const nftContract = new ethers.Contract(NFTMINT_CONTRACT_ADDRESS, nftAbi, provider);
        const registerContract = new ethers.Contract(REGISTER_CONTRACT_ADDRESS, registerAbi, provider);

        // Get the list of NFTs owned by the user
        const balance = await nftContract.balanceOf(address);
        const nftList = [];
        const traitCount: Record<string, number> = {};

        for (let i = 0; i < balance; i++) {
          try {
            const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
            const metadataResponse = await fetch(`${METADATA_BASE_URL}${tokenId}.json`);
            const metadata = await metadataResponse.json();
            const trait = metadata.attributes.find((attr: any) => attr.trait_type === "Background")?.value || 'Unknown';
            const imageUrl = `https://raw.githubusercontent.com/ArielRin/Pigz-and-Robbers-Pirate-Pigz-Application/fixfoot/public/137nftdataV2/Images/${tokenId}.png`;

            const registeredNFTs = await registerContract.getRegisteredNFTs();
            const isRegistered = registeredNFTs.some((nft: any) => nft.tokenId.toString() === tokenId.toString());

            nftList.push({ tokenId, trait, isRegistered, imageUrl });
            traitCount[trait] = (traitCount[trait] || 0) + 1;
          } catch (error) {
            console.error(`Error fetching data for tokenId ${i}:`, error);
          }
        }

        setNftTraits(nftList);
        setTraitCounts(traitCount);

        // Fetch valid claims and collected claims
        const validClaims = await registerContract.getClaimCountByUser(address);
        setValidClaims(Number(validClaims));

        const collectedClaims = await registerContract.userClaimCounts(address);
        setCollectedClaims(Number(collectedClaims));

        // Determine missing traits
        const missingTraits = requiredTraits.filter(trait => !traitCount[trait]);
        setMissingTraits(missingTraits);

      } catch (error) {
        console.error('Error fetching user stats:', error);
        toast({
          title: 'Error',
          description: 'Could not retrieve user statistics.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [address, walletProvider, toast]);

  const registerNFT = async (tokenId: number, trait: string) => {
    if (!walletProvider || !address) return;

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const registerContract = new ethers.Contract(REGISTER_CONTRACT_ADDRESS, registerAbi, signer);

      const tx = await registerContract.registerNFT(tokenId, trait);
      await tx.wait();

      toast({
        title: 'NFT Registered',
        description: `NFT ${tokenId} has been successfully registered!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setNftTraits(prevTraits =>
        prevTraits.map(nft =>
          nft.tokenId === tokenId ? { ...nft, isRegistered: true } : nft
        )
      );

    } catch (error) {
      console.error('Error registering NFT:', error);
      toast({
        title: 'Registration Error',
        description: 'An error occurred during registration. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        position="relative"
        flex={1}
        p={0}
        m={0}
        display="flex"
        flexDirection="column"
        color="white"
      >
        <video
          autoPlay
          loop
          muted
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            objectFit: 'cover',
            zIndex: -2
          }}
        >
          <source src="/images/pigzbkg.mp4" type="video/mp4" />
        </video>

        <Box
          flex={1}
          p={0}
          m={0}
          bg="rgba(0, 0, 0, 0.65)"
          display="flex"
          flexDirection="column"
          color="white"
        >
          <Flex p={2} bg="rgba(0, 0, 0, 0.61)" justify="space-between" align="center">
            <RouterLink to="/">
              <Image p={2} ml="4" src="/images/mainlogovert.png" alt="Heading" width="80px" />
            </RouterLink>
            <Flex align="right">
              <w3m-button />
            </Flex>
          </Flex>

          <Box p={4} m={4} bg="rgba(0, 0, 0, 0.75)" borderRadius="md" display="flex" justifyContent="center">
            <Box maxWidth="600px" width="100%">
              <Text fontSize="2xl" mb={4}>User Stats</Text>
              <Text fontSize="sm" mb={2}>Discover your valid claims, view the NFT Traits you've collected, and see what you're missing. You could be just one NFT away from a valid claim! Check out the marketplace, or mint another Pirate Pigz V2 today. Complete your collection and get those rewards! 🐷💎</Text>
              <Box mb={4} mt={4}>
                <Text fontWeight="bolder" fontSize="lg">Valid Claims: {validClaims}</Text>
                <Text fontWeight="bolder" fontSize="lg">Collected Claims: {collectedClaims}</Text>
              </Box>

              <Box mt={4} mb={4}>
                <Text fontSize="xl" mb={2}>Trait Count:</Text>
                <Table variant="simple" size="sm" width="100%">
                  <Thead>
                    <Tr>
                      <Th>Trait</Th>
                      <Th>Count</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Object.entries(traitCounts).map(([trait, count]) => (
                      <Tr key={trait}>
                        <Td>{trait}</Td>
                        <Td>{count}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              <Box mb={4}>
                <Text fontWeight="bolder" fontSize="xl" mb={2}>Traits Still Needed for a Complete Collection:</Text>
                {missingTraits.length > 0 ? (
                  <Text>{missingTraits.join(', ')}</Text>
                ) : (
                  <Text>You have all traits needed for a complete collection!</Text>
                )}
              </Box>

              <Box mb={4}>
                <ChakraLink href={marketplaceUrl} color="blue.500" isExternal>
                  View Marketplace Collection
                </ChakraLink>
              </Box>

              <ClaimRewards />

              <Box mb={4} overflowX="auto">
                <Text fontSize="lg" mb={2}>Your NFT Traits:</Text>
                <Table variant="simple" size="sm" width="100%">
                  <Thead>
                    <Tr>
                      <Th>NFT</Th>
                      <Th>Trait</Th>
                      <Th>Registered</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {nftTraits.map(({ tokenId, trait, isRegistered, imageUrl }) => (
                      <Tr key={tokenId}>
                        <Td>
                          <Image src={imageUrl} alt={`NFT ${tokenId}`} boxSize="50px" />
                          <Text>{tokenId}</Text>
                        </Td>
                        <Td>{trait}</Td>
                        <Td>{isRegistered ? "Yes" : "No"}</Td>
                        <Td>
                          {!isRegistered && (
                            <Button
                              colorScheme="purple"
                              isLoading={loading}
                              onClick={() => registerNFT(tokenId, trait)}
                              size="xs"
                            >
                              Register
                            </Button>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

            </Box>
          </Box>
        </Box>
        <Flex bg="rgba(0, 0, 0, 0.65)" borderRadius="2xl" p={0} mb={0} minH="490px" justifyContent="center" alignItems="center">
          <Box
            flex={1}
            p={4}
            m={2}
            borderRadius="2xl"
            boxShadow="md"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
          </Box>
        </Flex>
      </Box>

      <Footer />
    </>
  );
};

export default UserStats;
