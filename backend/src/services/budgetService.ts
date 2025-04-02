import { db } from '../config/firebase';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

export interface Expense {
  id: string;
  userId: string;
  category: string;
  amount: number;
  date: Date;
  description?: string;
}

export interface Budget {
  id: string;
  userId: string;
  monthlyBudget: number;
  currentMonth: Date;
  expenses: Expense[];
}

export const budgetService = {
  // Get budget for current month
  async getCurrentBudget(userId: string): Promise<Budget | null> {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const snapshot = await db.collection('budgets')
      .where('userId', '==', userId)
      .where('currentMonth', '==', firstDayOfMonth)
      .get();
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    const data = doc.data() as Omit<Budget, 'id'>;
    return { id: doc.id, ...data };
  },

  // Create or update monthly budget
  async setMonthlyBudget(userId: string, monthlyBudget: number): Promise<void> {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const snapshot = await db.collection('budgets')
      .where('userId', '==', userId)
      .where('currentMonth', '==', firstDayOfMonth)
      .get();
    
    if (snapshot.empty) {
      await db.collection('budgets').add({
        userId,
        monthlyBudget,
        currentMonth: firstDayOfMonth,
        expenses: []
      });
    } else {
      await snapshot.docs[0].ref.update({ monthlyBudget });
    }
  },

  // Add new expense
  async addExpense(userId: string, expense: Omit<Expense, 'id'>): Promise<void> {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const snapshot = await db.collection('budgets')
      .where('userId', '==', userId)
      .where('currentMonth', '==', firstDayOfMonth)
      .get();
    
    if (snapshot.empty) {
      // Create a new budget with default monthly budget if none exists
      await db.collection('budgets').add({
        userId,
        monthlyBudget: 1000, // Default monthly budget
        currentMonth: firstDayOfMonth,
        expenses: []
      });
      
      // Get the newly created document
      const newSnapshot = await db.collection('budgets')
        .where('userId', '==', userId)
        .where('currentMonth', '==', firstDayOfMonth)
        .get();
      
      const newExpense = {
        ...expense,
        id: crypto.randomUUID(),
        date: Timestamp.fromDate(expense.date)
      };
      
      await newSnapshot.docs[0].ref.update({
        expenses: FieldValue.arrayUnion(newExpense)
      });
    } else {
      const newExpense = {
        ...expense,
        id: crypto.randomUUID(),
        date: Timestamp.fromDate(expense.date)
      };
      
      await snapshot.docs[0].ref.update({
        expenses: FieldValue.arrayUnion(newExpense)
      });
    }
  },

  // Get expenses by category for current month
  async getExpensesByCategory(userId: string): Promise<Record<string, number>> {
    const budget = await this.getCurrentBudget(userId);
    if (!budget) return {};

    return budget.expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  },

  // Get total expenses for current month
  async getTotalExpenses(userId: string): Promise<number> {
    const budget = await this.getCurrentBudget(userId);
    if (!budget) return 0;

    return budget.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }
}; 