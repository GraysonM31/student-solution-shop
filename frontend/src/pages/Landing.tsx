import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Suspense } from 'react';
import Scene3D from '../components/Scene3D';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" w="100vw" bg="gray.900" position="relative" overflow="hidden">
      {/* Main Content */}
      <Flex 
        w="100%" 
        h="100vh" 
        position="relative" 
        zIndex={2}
        direction="column"
        justify="center"
      >
        <Box px={{ base: 6, md: 16, lg: 24 }} maxW={{ base: "100%", lg: "50%" }}>
          <Box>
            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
              fontWeight="bold"
              letterSpacing="wide"
              lineHeight="1.1"
              mb={4}
              color="white"
            >
              STUDENT
              <br />
              SOLUTION SHOP
            </Heading>
            <Heading
              fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
              fontWeight="medium"
              mb={4}
              color="white"
              opacity={0.9}
            >
              Your All-in-One Platform for
              <br />
              Academic Success
            </Heading>
            <Text 
              fontSize={{ base: "md", lg: "lg" }} 
              color="gray.400" 
              maxW={{ base: "100%", lg: "700px" }} 
              mb={8} 
              lineHeight="tall"
            >
              Streamline your student life with our comprehensive tools for task management,
              planning, and budget tracking. Everything you need to stay organized and focused.
            </Text>
            <Button
              onClick={() => navigate('/overview')}
              bg="brand.primary"
              color="white"
              size="lg"
              height={{ base: "48px", lg: "56px" }}
              px={8}
              fontSize={{ base: "md", lg: "lg" }}
              _hover={{
                bg: 'brand.secondary',
                transform: 'translateY(-2px)',
              }}
              transition="all 0.2s"
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Flex>

      {/* 3D Scene */}
      <Box position="absolute" top={0} right={0} w="50%" h="100%" zIndex={2} display={{ base: 'none', lg: 'block' }}>
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </Box>

      {/* Decorative Elements */}
      <Box
        position="absolute"
        top="10%"
        right="-20%"
        width={{ base: "600px", lg: "800px" }}
        height={{ base: "600px", lg: "800px" }}
        bgGradient="linear(to-r, brand.primary, brand.secondary)"
        filter="blur(120px)"
        opacity="0.15"
        borderRadius="full"
        zIndex={1}
      />
      <Box
        position="absolute"
        bottom="-20%"
        left="-10%"
        width={{ base: "600px", lg: "800px" }}
        height={{ base: "600px", lg: "800px" }}
        bgGradient="linear(to-r, brand.secondary, brand.primary)"
        filter="blur(120px)"
        opacity="0.15"
        borderRadius="full"
        zIndex={1}
      />
      
      {/* Curved Lines */}
      <Box
        position="absolute"
        top={0}
        right={0}
        width="100%"
        height="100%"
        opacity={0.1}
        bgImage="url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI4NTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgxNDQwdjg1MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoMTQ0MHY4NTBIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNLTI5Mi4zIDg1NS43czIzMy44LTQ0Mi45IDQ4Ny41LTQ0Mi45IDQ4Ny41IDQ0Mi45IDQ4Ny41IDQ0Mi45IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==')"
        bgRepeat="no-repeat"
        bgPosition="center"
        bgSize="cover"
        transform="rotate(-10deg)"
      />
    </Box>
  );
};

export default Landing; 