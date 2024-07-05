import React, { useState, useEffect } from 'react';
import { Box, Image, Flex, Text, Button } from '@chakra-ui/react';
import { css, keyframes } from '@emotion/react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Footer from './Components/Footer/Footer';

import ViewPoly from './Components/MintPoly/ViewCollectionPOLY';

import MintBsc from './Components/MintPoly/NftMint0/NftMint0';

// <ViewBsc/>

const imagePaths = [
  '/images/pirates/256.png',
  '/images/pirates/257.png',
  '/images/pirates/258.png',
  '/images/pirates/259.png',
  '/images/pirates/260.png',
  '/images/pirates/261.png',
  '/images/pirates/262.png',
  '/images/pirates/263.png',
  '/images/pirates/264.png',
  '/images/pirates/265.png',
  '/images/pirates/266.png',
  '/images/pirates/267.png',
];

const NewPage = () => {
  const [tokenData, setTokenData] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState<string>(imagePaths[0]);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await fetch('https://api.geckoterminal.com/api/v2/networks/degenchain/pools/0x401cd27b11e64527cc09bcad1febcf8fcae8e945');
        const data = await response.json();
        console.log('API Response:', data);
        setTokenData(data.data.attributes);
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    fetchTokenData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImage(imagePaths[Math.floor(Math.random() * imagePaths.length)]);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const glow = keyframes`
    from {
      box-shadow: 0 0 10px white;
    }
    to {
      box-shadow: 0 0 20px white, 0 0 30px white, 0 0 40px white, 0 0 50px white;
    }
  `;

  const glowStyle = css`
    animation: ${glow} 1.5s ease-in-out infinite alternate;
  `;

  const formatPrice = (price: string) => parseFloat(price).toFixed(8);
  const usdPrice = (price: string) => {
    return parseFloat(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const textShadowStyle = css`
    text-shadow: 1px 1px 2px pink, 0 0 1em pink, 0 0 0.2em pink;
  `;

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
          <Flex p="5px" bg="rgba(0, 0, 0, 0.61)" justifyContent="right" flexWrap="wrap">
            <w3m-button />
          </Flex>
          <Box
            flex={1}
            p={0}
            m={0}
            display="flex"
            flexDirection="column"
            bgPosition="center"
            bgRepeat="no-repeat"
            bgSize="cover"
            color="white"
          >
            <Flex justifyContent="center" p={2} flexWrap="wrap" position="relative">

            <Box
              flex={1}
              minW="300px"
              m={2}
              p={7}
              borderRadius="2xl"
              boxShadow="md"
              textAlign="center"
              bg="rgba(0, 0, 0, 0.61)"
            >
            <Image src="images/piratepigztextlogo.png" alt="header" mx="auto" width="60%" minW="250px" mb="28px" mt="28px" />

          <MintBsc/>



            </Box>


              <Box
                flex={1}
                minW="300px"
                m={2}
                p={7}
                borderRadius="2xl"
                boxShadow="md"
                textAlign="center"
                bg="rgba(0, 0, 0, 0.61)"
              >

              <Link to="/mintpoly">
                <Flex justifyContent="center" flexWrap="wrap">
                  <Text width="60%" textAlign="center" fontSize="lg" fontWeight="normal">

                  </Text>
                </Flex>
                <Image src={currentImage} alt="Pirate Pigz" mx="auto" width="75%" minW="250px" mt="90px" borderRadius="2xl" />
              </Link>


              </Box>


            </Flex>


              <Box
                flex={1}
                m={2}
                p={4}
                bg="rgba(0, 0, 0, 0.61)"
                borderRadius="md"
                boxShadow="md"
                textAlign="center"
              >


                <ViewPoly />
                <Text mb="200px" fontSize="xl">
                </Text>
              </Box>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default NewPage;
