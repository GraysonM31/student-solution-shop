import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  Progress,
  Container,
  Fade,
  ScaleFade,
  SlideFade,
  SimpleGrid,
  Icon,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';
import { 
  FaBook, 
  FaUtensils, 
  FaBus, 
  FaFilm, 
  FaBolt, 
  FaEllipsisH 
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description?: string;
}

interface Category {
  name: string;
  icon: any;
  color: string;
}

const CATEGORIES: Category[] = [
  { name: 'Books', icon: FaBook, color: '#48BB78' },
  { name: 'Food', icon: FaUtensils, color: '#4299E1' },
  { name: 'Transportation', icon: FaBus, color: '#9F7AEA' },
  { name: 'Entertainment', icon: FaFilm, color: '#F6AD55' },
  { name: 'Utilities', icon: FaBolt, color: '#FC8181' },
  { name: 'Others', icon: FaEllipsisH, color: '#CBD5E0' },
];

const Budget = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [monthlyBudget, setMonthlyBudget] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = useColorModeValue('white', 'dark.200');
  const hoverBgColor = useColorModeValue('gray.50', 'dark.300');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      fetchBudgetData();
    }
  }, [user]);

  const fetchBudgetData = async () => {
    try {
      const response = await axios.get('/api/budget/current', {
        headers: { Authorization: `Bearer ${await user?.getIdToken()}` }
      });
      if (response.data) {
        setExpenses(response.data.expenses || []);
        setMonthlyBudget(response.data.monthlyBudget || 1000);
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch budget data',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingBudget = monthlyBudget - totalExpenses;

  const handleAddExpense = async () => {
    if (!newExpense.category || !newExpense.amount || !user) return;

    setIsLoading(true);
    try {
      await axios.post('/api/budget/expenses', 
        {
          category: newExpense.category,
          amount: parseFloat(newExpense.amount),
        },
        {
          headers: { Authorization: `Bearer ${await user.getIdToken()}` }
        }
      );
      
      setNewExpense({ category: '', amount: '' });
      setSelectedCategory(null);
      await fetchBudgetData();
      
      toast({
        title: 'Success',
        description: 'Expense added successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: 'Error',
        description: 'Failed to add expense',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const expensesByCategory = CATEGORIES.map((category) => ({
    category: category.name,
    amount: expenses
      .filter((exp) => exp.category === category.name)
      .reduce((sum, exp) => sum + exp.amount, 0),
  }));

  const chartData = {
    labels: CATEGORIES.map(cat => cat.name),
    datasets: [
      {
        data: expensesByCategory.map((cat) => cat.amount),
        backgroundColor: CATEGORIES.map(cat => cat.color),
      },
    ],
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Fade in={isLoaded}>
        <VStack spacing={8} align="stretch">
          <SlideFade in={isLoaded} offsetY={-20}>
            <Text fontSize="2xl" fontWeight="bold" color="white">
              Budget Tracker
            </Text>
          </SlideFade>

          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem>
              <ScaleFade in={isLoaded} initialScale={0.9}>
                <Box bg="dark.200" p="6" borderRadius="xl">
                  <Text fontSize="lg" fontWeight="semibold" mb="4" color="white">
                    Add Expense
                  </Text>
                  <VStack spacing="4">
                    <SimpleGrid columns={3} spacing={4} width="full">
                      {CATEGORIES.map((category) => (
                        <Box
                          key={category.name}
                          p={4}
                          borderRadius="lg"
                          bg={selectedCategory === category.name ? category.color : bgColor}
                          color={selectedCategory === category.name ? 'white' : 'inherit'}
                          cursor="pointer"
                          _hover={{ bg: hoverBgColor }}
                          onClick={() => {
                            setSelectedCategory(category.name);
                            setNewExpense({ ...newExpense, category: category.name });
                          }}
                          transition="all 0.2s"
                        >
                          <VStack spacing={2}>
                            <Icon as={category.icon} boxSize={6} />
                            <Text fontSize="sm" textAlign="center">
                              {category.name}
                            </Text>
                          </VStack>
                        </Box>
                      ))}
                    </SimpleGrid>
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={newExpense.amount}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, amount: e.target.value })
                      }
                      bg="dark.300"
                    />
                    <Button
                      colorScheme="green"
                      width="full"
                      onClick={handleAddExpense}
                      isLoading={isLoading}
                    >
                      Add Expense
                    </Button>
                  </VStack>
                </Box>
              </ScaleFade>

              <ScaleFade in={isLoaded} initialScale={0.9} delay={0.1}>
                <Box bg="dark.200" p="6" borderRadius="xl" mt="6">
                  <Text fontSize="lg" fontWeight="semibold" mb="4" color="white">
                    Budget Overview
                  </Text>
                  <VStack align="stretch" spacing="4">
                    <Box>
                      <HStack justify="space-between" mb="2">
                        <Text color="white">Total Budget</Text>
                        <Text color="white">${monthlyBudget}</Text>
                      </HStack>
                      <Progress
                        value={(totalExpenses / monthlyBudget) * 100}
                        colorScheme={
                          remainingBudget > monthlyBudget * 0.2 ? 'green' : 'red'
                        }
                        borderRadius="full"
                      />
                    </Box>
                    <HStack justify="space-between">
                      <Text color="white">Remaining</Text>
                      <Text
                        color={
                          remainingBudget > monthlyBudget * 0.2 ? 'green.400' : 'red.400'
                        }
                      >
                        ${remainingBudget.toFixed(2)}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              </ScaleFade>
            </GridItem>

            <GridItem>
              <ScaleFade in={isLoaded} initialScale={0.9} delay={0.2}>
                <Box bg="dark.200" p="6" borderRadius="xl" height="full">
                  <Text fontSize="lg" fontWeight="semibold" mb="4" color="white">
                    Expenses by Category
                  </Text>
                  <Box height="300px">
                    <Doughnut
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </Box>
                </Box>
              </ScaleFade>
            </GridItem>
          </Grid>
        </VStack>
      </Fade>
    </Container>
  );
};

export default Budget; 