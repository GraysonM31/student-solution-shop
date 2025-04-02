import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Container,
  Heading,
  Center,
  Image,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'dark.200');
  const cardBg = useColorModeValue('white', 'dark.300');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      navigate('/budget');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign in. Please check your credentials.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      navigate('/budget');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign in with Google.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={bgColor} py={10}>
      <Container maxW="container.md">
        <Center>
          <VStack spacing={8} w="full">
            {/* Logo or Brand */}
            <Box mb={8}>
              <Heading size="2xl" color="white" textAlign="center">
                Student Shop
              </Heading>
              <Text color="gray.400" textAlign="center" mt={2}>
                Manage your student budget with ease
              </Text>
            </Box>

            {/* Login Card */}
            <Box
              w="full"
              maxW="md"
              p={8}
              borderRadius="xl"
              bg={cardBg}
              boxShadow="xl"
            >
              <VStack spacing={6}>
                <Heading size="lg" color="white" textAlign="center">
                  Welcome Back
                </Heading>
                <Text color="gray.400" textAlign="center">
                  Sign in to continue to your account
                </Text>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel color="white">Email</FormLabel>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        bg="dark.300"
                        color="white"
                        size="lg"
                        placeholder="Enter your email"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel color="white">Password</FormLabel>
                      <InputGroup>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          bg="dark.300"
                          color="white"
                          size="lg"
                          placeholder="Enter your password"
                        />
                        <InputRightElement h="full">
                          <IconButton
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => setShowPassword(!showPassword)}
                            variant="ghost"
                            color="gray.400"
                            _hover={{ bg: 'transparent' }}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                    <Button
                      type="submit"
                      colorScheme="blue"
                      width="full"
                      size="lg"
                      isLoading={isLoading}
                    >
                      Sign In
                    </Button>
                  </VStack>
                </form>

                <HStack w="full" spacing={4}>
                  <Divider />
                  <Text color="gray.400">OR</Text>
                  <Divider />
                </HStack>

                <Button
                  onClick={handleGoogleSignIn}
                  width="full"
                  size="lg"
                  variant="outline"
                  leftIcon={<FaGoogle />}
                  isLoading={isLoading}
                  colorScheme="red"
                >
                  Sign in with Google
                </Button>
              </VStack>
            </Box>

            {/* Footer */}
            <Text color="gray.400" fontSize="sm">
              Don't have an account?{' '}
              <Button
                variant="link"
                colorScheme="blue"
                onClick={() => navigate('/signup')}
              >
                Sign up
              </Button>
            </Text>
          </VStack>
        </Center>
      </Container>
    </Box>
  );
};

export default Login; 