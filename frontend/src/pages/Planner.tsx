import { useState, useEffect } from 'react';
import { 
  Box, 
  Container,
  VStack,
  HStack,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Fade,
  ScaleFade,
  SlideFade,
  IconButton,
  useToast,
  Checkbox,
  Input,
  Button,
} from '@chakra-ui/react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { ViewIcon, ViewOffIcon, AddIcon, DeleteIcon, TimeIcon } from '@chakra-ui/icons';
import MindMap from '../components/MindMap';
import api from '../lib/api';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  status: 'todo' | 'in-progress' | 'completed';
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

interface TodoTask {
  id: string;
  text: string;
  description: string;
  status: string;
  priority: 'medium';
  dueDate: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'todo': return '#4A5568';
    case 'in-progress': return '#4299E1';
    case 'completed': return '#48BB78';
    default: return '#4A5568';
  }
};

const Planner = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'mindmap'>('kanban');
  const toast = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 250);
    fetchTodos();
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

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const response = await api.post('/todos', {
        text: newTodo,
        completed: false,
        status: 'todo'
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
    try {
      const newCompleted = !completed;
      const newStatus = newCompleted ? 'completed' : 'todo';
      await api.put(`/todos/${id}`, { 
        completed: newCompleted,
        status: newStatus 
      });
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { 
            ...todo, 
            completed: newCompleted,
            status: newStatus 
          } : todo
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

  const updateTodoStatus = async (id: string, newStatus: Todo['status']) => {
    try {
      await api.put(`/todos/${id}`, { status: newStatus });
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, status: newStatus } : todo
        )
      );
    } catch (error) {
      toast({
        title: 'Error updating todo status',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const deleteTodo = async (id: string) => {
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

  const moveToInProgress = async (id: string) => {
    try {
      await api.put(`/todos/${id}`, { 
        status: 'in-progress',
        completed: false 
      });
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { 
            ...todo, 
            status: 'in-progress',
            completed: false 
          } : todo
        )
      );
    } catch (error) {
      toast({
        title: 'Error updating todo status',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId as Todo['status'];
    
    // Handle both tasks and todos
    if (draggableId.startsWith('todo-')) {
      const todoId = draggableId.replace('todo-', '');
      updateTodoStatus(todoId, newStatus);
    } else {
      const updatedTasks = [...tasks];
      const taskIndex = updatedTasks.findIndex(task => task.id === draggableId);
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        status: newStatus
      };
      setTasks(updatedTasks);
    }

    toast({
      title: 'Item moved',
      status: 'success',
      duration: 2000,
    });
  };

  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: 'New Task',
      description: 'Add description',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Fade in={isLoaded}>
        <VStack spacing={8} align="stretch">
          <SlideFade in={isLoaded} offsetY={-20}>
            <HStack justify="space-between">
              <Text fontSize="2xl" fontWeight="bold" color="white">
                Planner
              </Text>
              <HStack>
                <Input
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add a quick todo"
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
                  maxW="300px"
                />
                <Button onClick={addTodo} colorScheme="green" size="sm">
                  Add
                </Button>
                <IconButton
                  aria-label="Add task"
                  icon={<AddIcon />}
                  onClick={addTask}
                  colorScheme="green"
                  variant="ghost"
                />
              </HStack>
            </HStack>
          </SlideFade>

          <Tabs variant="enclosed" colorScheme="green">
            <TabList>
              <Tab color="white">Kanban</Tab>
              <Tab color="white">Mind Map</Tab>
            </TabList>

            <TabPanels>
              {/* Kanban View */}
              <TabPanel>
                <ScaleFade in={isLoaded} initialScale={0.9}>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <HStack spacing={4} align="start">
                      {['todo', 'in-progress', 'completed'].map((status) => (
                        <Droppable key={status} droppableId={status} isDropDisabled={false}>
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              bg="dark.200"
                              p={4}
                              borderRadius="lg"
                              minH="500px"
                              w="full"
                            >
                              <Text color="white" mb={4} textTransform="capitalize">
                                {status.replace('-', ' ')}
                              </Text>
                              <VStack spacing={2} mb={4} align="stretch">
                                {todos
                                  .filter(todo => todo.status === status)
                                  .map((todo, index) => (
                                    <Draggable
                                      key={`todo-${todo.id}`}
                                      draggableId={`todo-${todo.id}`}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <Box
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          bg="dark.300"
                                          p={3}
                                          borderRadius="md"
                                          borderLeft="4px solid"
                                          borderLeftColor="green.500"
                                        >
                                          <HStack justify="space-between">
                                            <Checkbox
                                              isChecked={todo.completed}
                                              onChange={() => toggleTodo(todo.id, todo.completed)}
                                              colorScheme="green"
                                            >
                                              <Text
                                                color="white"
                                                textDecoration={todo.completed ? 'line-through' : 'none'}
                                              >
                                                {todo.text}
                                              </Text>
                                            </Checkbox>
                                            <HStack>
                                              {todo.status !== 'in-progress' && (
                                                <IconButton
                                                  aria-label="Move to in progress"
                                                  icon={<TimeIcon />}
                                                  onClick={() => moveToInProgress(todo.id)}
                                                  size="sm"
                                                  colorScheme="blue"
                                                  variant="ghost"
                                                />
                                              )}
                                              <IconButton
                                                aria-label="Delete todo"
                                                icon={<DeleteIcon />}
                                                onClick={() => deleteTodo(todo.id)}
                                                size="sm"
                                                colorScheme="red"
                                                variant="ghost"
                                              />
                                            </HStack>
                                          </HStack>
                                        </Box>
                                      )}
                                    </Draggable>
                                  ))}
                              </VStack>
                              {tasks
                                .filter((task) => task.status === status)
                                .map((task, index) => (
                                  <Draggable
                                    key={task.id}
                                    draggableId={task.id}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <Box
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        bg="dark.300"
                                        p={4}
                                        mb={2}
                                        borderRadius="md"
                                        borderLeft="4px solid"
                                        borderLeftColor={getStatusColor(task.status)}
                                      >
                                        <Text color="white">{task.title}</Text>
                                        <Text color="gray.400" fontSize="sm">
                                          {task.description}
                                        </Text>
                                      </Box>
                                    )}
                                  </Draggable>
                                ))}
                              {provided.placeholder}
                            </Box>
                          )}
                        </Droppable>
                      ))}
                    </HStack>
                  </DragDropContext>
                </ScaleFade>
              </TabPanel>

              {/* Mind Map View */}
              <TabPanel>
                <ScaleFade in={isLoaded} initialScale={0.9}>
                  <MindMap tasks={tasks} todos={todos} />
                </ScaleFade>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Fade>
    </Container>
  );
};

export default Planner; 