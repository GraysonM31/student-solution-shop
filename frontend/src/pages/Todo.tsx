import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  IconButton,
  useToast,
  SimpleGrid,
  Card,
  CardBody,
  Fade,
  ScaleFade,
  SlideFade,
  Tooltip,
} from '@chakra-ui/react';
import { DeleteIcon, DragHandleIcon } from '@chakra-ui/icons';
import api from '../lib/api';
import { DraggableCard } from '../components/DraggableCard';
import { DraggableContainer } from '../components/DraggableContainer';
import { DragEndEvent } from '@dnd-kit/core';
import { useAuth } from '../contexts/AuthContext';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  userId: string;
}

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTodos();
      // Add a small delay to show the loading animation
      const timer = setTimeout(() => setIsLoaded(true), 250);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      const response = await api.get('/todos');
      setTodos(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching todos',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim() || !user) return;

    try {
      const response = await api.post('/todos', {
        text: newTodo,
        completed: false,
      });
      setTodos([...todos, response.data]);
      setNewTodo('');
      toast({
        title: 'Todo added',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error adding todo',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    if (!user) return;

    try {
      await api.put(`/todos/${id}`, { completed: !completed });
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (error) {
      toast({
        title: 'Error updating todo',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const deleteTodo = async (id: string) => {
    if (!user) return;

    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
      toast({
        title: 'Todo deleted',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error deleting todo',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const oldIndex = todos.findIndex((todo) => todo.id === active.id);
    const newIndex = todos.findIndex((todo) => todo.id === over.id);

    const newTodos = [...todos];
    const [movedTodo] = newTodos.splice(oldIndex, 1);
    newTodos.splice(newIndex, 0, movedTodo);

    setTodos(newTodos);
  };

  const recentTodos = todos
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const incompleteTodos = todos.filter(todo => !todo.completed).slice(0, 5);

  return (
    <Container maxW="container.xl" py={8}>
      <Fade in={isLoaded}>
        <VStack spacing={8} align="stretch">
          <SlideFade in={isLoaded} offsetY={-20}>
            <HStack justify="space-between">
              <Heading color="white">Todo List</Heading>
              <Tooltip label={isReorderMode ? "Click to exit reorder mode" : "Click to reorder todos"}>
                <Button
                  leftIcon={<DragHandleIcon />}
                  colorScheme={isReorderMode ? "green" : "gray"}
                  variant={isReorderMode ? "solid" : "outline"}
                  onClick={() => setIsReorderMode(!isReorderMode)}
                >
                  {isReorderMode ? "Exit Reorder Mode" : "Reorder Mode"}
                </Button>
              </Tooltip>
            </HStack>
          </SlideFade>

          {/* Quick Stats */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <ScaleFade in={isLoaded} initialScale={0.9}>
              <Card bg="dark.200" borderColor="gray.600">
                <CardBody>
                  <VStack>
                    <Text color="gray.400">Total Tasks</Text>
                    <Heading size="xl" color="white">{todos.length}</Heading>
                  </VStack>
                </CardBody>
              </Card>
            </ScaleFade>
            <ScaleFade in={isLoaded} initialScale={0.9} delay={0.1}>
              <Card bg="dark.200" borderColor="gray.600">
                <CardBody>
                  <VStack>
                    <Text color="gray.400">Completed</Text>
                    <Heading size="xl" color="white">
                      {todos.filter(todo => todo.completed).length}
                    </Heading>
                  </VStack>
                </CardBody>
              </Card>
            </ScaleFade>
            <ScaleFade in={isLoaded} initialScale={0.9} delay={0.2}>
              <Card bg="dark.200" borderColor="gray.600">
                <CardBody>
                  <VStack>
                    <Text color="gray.400">Pending</Text>
                    <Heading size="xl" color="white">
                      {todos.filter(todo => !todo.completed).length}
                    </Heading>
                  </VStack>
                </CardBody>
              </Card>
            </ScaleFade>
          </SimpleGrid>

          {/* Add Todo Form */}
          <SlideFade in={isLoaded} offsetY={20}>
            <HStack>
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new todo"
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                bg="dark.200"
                border="none"
                _focus={{
                  boxShadow: 'none',
                  border: '1px solid',
                  borderColor: 'brand.primary',
                }}
                color="white"
                _placeholder={{ color: 'gray.400' }}
              />
              <Button onClick={addTodo} colorScheme="green">
                Add
              </Button>
            </HStack>
          </SlideFade>

          {/* Todo List */}
          <DraggableContainer 
            items={todos} 
            onDragEnd={handleDragEnd}
            disabled={!isReorderMode}
          >
            {todos.map((todo, index) => (
              <SlideFade
                key={todo.id}
                in={isLoaded}
                offsetY={20}
                delay={index * 0.05}
              >
                <DraggableCard 
                  id={todo.id}
                  isDraggable={isReorderMode}
                >
                  <HStack justify="space-between">
                    <Checkbox
                      isChecked={todo.completed}
                      onChange={() => toggleTodo(todo.id, todo.completed)}
                      colorScheme="green"
                    >
                      <Text
                        textDecoration={todo.completed ? 'line-through' : 'none'}
                        color={todo.completed ? 'gray.400' : 'white'}
                      >
                        {todo.text}
                      </Text>
                    </Checkbox>
                    <IconButton
                      aria-label="Delete todo"
                      icon={<DeleteIcon />}
                      onClick={() => deleteTodo(todo.id)}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                    />
                  </HStack>
                </DraggableCard>
              </SlideFade>
            ))}
          </DraggableContainer>
        </VStack>
      </Fade>
    </Container>
  );
} 