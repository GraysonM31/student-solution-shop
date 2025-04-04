import { Router } from 'express';
import { getFirestore } from 'firebase-admin/firestore';
import { authenticateUser } from '../middleware/auth';

const router = Router();
const db = getFirestore();

// Get all todos for the authenticated user
router.get('/', authenticateUser, async (req, res) => {
  try {
    console.log('Attempting to fetch todos for user:', req.user.uid);
    const todosSnapshot = await db
      .collection('users')
      .doc(req.user.uid)
      .collection('todos')
      .get();
    
    const todos = todosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Get a single todo by ID
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const todoDoc = await db
      .collection('users')
      .doc(req.user.uid)
      .collection('todos')
      .doc(id)
      .get();
    
    if (!todoDoc.exists) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({
      id: todoDoc.id,
      ...todoDoc.data()
    });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// Create a new todo
router.post('/', authenticateUser, async (req, res) => {
  try {
    console.log('Attempting to create todo with data:', req.body);
    const { text, completed = false, status = 'todo' } = req.body;
    
    const todoRef = db
      .collection('users')
      .doc(req.user.uid)
      .collection('todos')
      .doc();

    const todoData = {
      text,
      completed,
      status,
      userId: req.user.uid,
      createdAt: new Date()
    };

    await todoRef.set(todoData);
    
    console.log('Todo created successfully with ID:', todoRef.id);
    res.status(201).json({
      id: todoRef.id,
      ...todoData
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update a todo
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed, status } = req.body;
    
    const todoRef = db
      .collection('users')
      .doc(req.user.uid)
      .collection('todos')
      .doc(id);

    const todoDoc = await todoRef.get();
    if (!todoDoc.exists) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updateData: any = {
      updatedAt: new Date()
    };

    // Only include fields that are provided in the request
    if (text !== undefined) updateData.text = text;
    if (completed !== undefined) updateData.completed = completed;
    if (status !== undefined) updateData.status = status;

    await todoRef.update(updateData);
    res.json({ 
      id,
      ...todoDoc.data(),
      ...updateData
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete a todo
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    
    const todoRef = db
      .collection('users')
      .doc(req.user.uid)
      .collection('todos')
      .doc(id);

    const todoDoc = await todoRef.get();
    if (!todoDoc.exists) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await todoRef.delete();
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

export default router; 