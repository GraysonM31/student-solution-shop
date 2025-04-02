export interface IExpense {
  userId: string;
  category: string;
  amount: number;
  date: Date;
  description?: string;
}

export interface IBudget {
  userId: string;
  monthlyBudget: number;
  currentMonth: Date;
  expenses: IExpense[];
} 