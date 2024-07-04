import React, { useEffect, useState } from 'react';
import { Flex, Box, Image, Text, Link } from '@chakra-ui/react';
import { useWeb3Modal } from '@web3modal/ethers/react';
import { ethers } from 'ethers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter as faXTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faChartLine } from '@fortawesome/free-solid-svg-icons';

const Footer: React.FC = () => {
  const { open } = useWeb3Modal();
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<any>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const web3Provider = new ethers.BrowserProvider(window.ethereum as any);
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0].toString());
            setProvider(web3Provider);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();
  }, []);


  return (
    <footer style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)', color: 'white', textAlign: 'center', fontFamily: 'Comic Sans MS, Comic Sans, cursive' }}>
      <Box>
        <Image src="images/friends.png" mx="auto" alt="header" minW="390px" width="620px" />

        <Text fontSize="3xl" mb={2}>&copy; {currentYear} Pigz</Text>

        <Flex mt="15px" justify="center" align="center" gap={4}>
          <Link href="https://cosmicrichpigz.com/" isExternal>
            <FontAwesomeIcon icon={faGlobe} size="lg" />
          </Link>
          <Link href="https://twitter.com/" isExternal>
            <FontAwesomeIcon icon={faXTwitter} size="lg" />
          </Link>
          <Link href="https://t.me/purpdegen" isExternal>
            <FontAwesomeIcon icon={faTelegram} size="lg" />
          </Link>

        </Flex>

        <Text mt="25px" fontSize="sm" mb={2}>Currently Connected to</Text>
        <Flex mb="5px" justifyContent="center" flexWrap="wrap">
          <w3m-network-button />
        </Flex>

        <Flex justify="center" mt={2}>
          <Link href="https://www.google.com" isExternal>
            <Image src="images/footer.png" alt="header" minW="390px" width="620px" mb="25px" mt="5px" />
          </Link>
        </Flex>
        <a href="https://alpha7.live" target="_blank" rel="noopener noreferrer">
          <Image
            src="https://raw.githubusercontent.com/ArielRin/Alpha7-Public-Files-and-Assets/master/OldDapp/src/headerlogo.png"
            alt="Logo"
            width="40px"
            mx="auto"
          />

          <Flex justifyContent="center" flexWrap="wrap">
            <Text width="60%" textAlign="center" fontSize="8px" fontWeight="normal">
              This Site was Made with Passion, Great Ethics
            </Text>
          </Flex>
          <Flex justifyContent="center" flexWrap="wrap">
            <Text width="60%" textAlign="center" mb="160px" fontSize="8px" fontWeight="normal">
              and High Spirits by The Alpha7 Team.
            </Text>
          </Flex>
        </a>
      </Box>
    </footer>
  );
};

export default Footer;
