import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Fade,
  ScaleFade,
  SlideFade,
  Avatar,
  Button,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export default function Overview() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, logout } = useAuth();
  const bgColor = useColorModeValue('white', 'dark.200');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchTodos();
    // Add a small delay to show the loading animation
    const timer = setTimeout(() => setIsLoaded(true), 250);
    return () => clearTimeout(timer);
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.get('/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const recentTodos = todos
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Fade in={isLoaded}>
        <VStack spacing={8} align="stretch">
          <SlideFade in={isLoaded} offsetY={-20}>
            <HStack justify="space-between">
              <Heading color="white">Overview</Heading>
              <HStack spacing={4}>
                <Box textAlign="right">
                  <Text color="white" fontSize="sm">
                    {user?.email}
                  </Text>
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Box>
                <Avatar
                  size="md"
                  name={user?.email?.split('@')[0]}
                  bg="blue.500"
                />
              </HStack>
            </HStack>
          </SlideFade>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* Recent Activity */}
            <ScaleFade in={isLoaded} initialScale={0.9}>
              <Card bg={bgColor} borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md" color="white">Recent Activity</Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {recentTodos.map((todo, index) => (
                      <SlideFade
                        key={todo.id}
                        in={isLoaded}
                        offsetY={20}
                        delay={index * 0.1}
                      >
                        <Box p={3} bg="dark.300" borderRadius="md">
                          <HStack justify="space-between">
                            <Text color="white" noOfLines={1}>
                              {todo.text}
                            </Text>
                            <Badge colorScheme={todo.completed ? "green" : "yellow"}>
                              {todo.completed ? "Completed" : "Pending"}
                            </Badge>
                          </HStack>
                        </Box>
                      </SlideFade>
                    ))}
                    {recentTodos.length === 0 && (
                      <Text color="gray.400">No recent activity</Text>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            </ScaleFade>

            {/* Budget Overview */}
            <ScaleFade in={isLoaded} initialScale={0.9} delay={0.2}>
              <Card bg={bgColor} borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md" color="white">Budget Overview</Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                  <Text color="gray.400">Budget information will be displayed here</Text>
                </CardBody>
              </Card>
            </ScaleFade>
          </SimpleGrid>
        </VStack>
      </Fade>
    </Container>
  );
} 