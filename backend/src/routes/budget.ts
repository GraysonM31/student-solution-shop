import express from 'express';
import { budgetService } from '../services/budgetService';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

// Get current month's budget
router.get('/current', authenticateUser, async (req, res) => {
  try {
    console.log('Budget route - Getting current budget for user:', req.user.uid);
    const budget = await budgetService.getCurrentBudget(req.user.uid);
    if (!budget) {
      console.log('Budget route - No budget found, returning default');
      return res.json({
        monthlyBudget: 1000,
        expenses: []
      });
    }
    console.log('Budget route - Budget found:', budget);
    res.json(budget);
  } catch (error) {
    console.error('Budget route - Error fetching budget:', error);
    res.status(500).json({ error: 'Failed to fetch budget' });
  }
});

// Set monthly budget
router.post('/monthly', authenticateUser, async (req, res) => {
  try {
    console.log('Budget route - Setting monthly budget for user:', req.user.uid);
    console.log('Budget route - Request body:', req.body);
    const { monthlyBudget } = req.body;
    if (!monthlyBudget || monthlyBudget <= 0) {
      console.log('Budget route - Invalid monthly budget amount');
      return res.status(400).json({ error: 'Invalid monthly budget amount' });
    }
    await budgetService.setMonthlyBudget(req.user.uid, monthlyBudget);
    console.log('Budget route - Monthly budget updated successfully');
    res.json({ message: 'Monthly budget updated successfully' });
  } catch (error) {
    console.error('Budget route - Error updating budget:', error);
    res.status(500).json({ error: 'Failed to update monthly budget' });
  }
});

// Add new expense
router.post('/expenses', authenticateUser, async (req, res) => {
  try {
    console.log('Budget route - Adding expense for user:', req.user.uid);
    console.log('Budget route - Request body:', req.body);
    const { category, amount, description } = req.body;
    if (!category || !amount || amount <= 0) {
      console.log('Budget route - Invalid expense data');
      return res.status(400).json({ error: 'Invalid expense data' });
    }
    
    await budgetService.addExpense(req.user.uid, {
      userId: req.user.uid,
      category,
      amount: parseFloat(amount),
      description,
      date: new Date()
    });
    
    console.log('Budget route - Expense added successfully');
    res.json({ message: 'Expense added successfully' });
  } catch (error) {
    console.error('Budget route - Error adding expense:', error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Get expenses by category
router.get('/expenses/categories', authenticateUser, async (req, res) => {
  try {
    console.log('Budget route - Getting expenses by category for user:', req.user.uid);
    const expensesByCategory = await budgetService.getExpensesByCategory(req.user.uid);
    console.log('Budget route - Expenses by category:', expensesByCategory);
    res.json(expensesByCategory);
  } catch (error) {
    console.error('Budget route - Error fetching expenses by category:', error);
    res.status(500).json({ error: 'Failed to fetch expenses by category' });
  }
});

// Get total expenses
router.get('/expenses/total', authenticateUser, async (req, res) => {
  try {
    console.log('Budget route - Getting total expenses for user:', req.user.uid);
    const totalExpenses = await budgetService.getTotalExpenses(req.user.uid);
    console.log('Budget route - Total expenses:', totalExpenses);
    res.json({ total: totalExpenses });
  } catch (error) {
    console.error('Budget route - Error fetching total expenses:', error);
    res.status(500).json({ error: 'Failed to fetch total expenses' });
  }
});

export default router; 