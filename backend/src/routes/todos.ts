import { Router } from 'express';
import { getFirestore } from 'firebase-admin/firestore';

const router = Router();
const db = getFirestore();

// Get all todos
router.get('/', async (req, res) => {
  try {
    console.log('Attempting to fetch todos...');
    const todosSnapshot = await db.collection('todos').get();
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
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todoDoc = await db.collection('todos').doc(id).get();
    
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
router.post('/', async (req, res) => {
  try {
    console.log('Attempting to create todo with data:', req.body);
    const { text, completed = false, status = 'todo' } = req.body;
    const docRef = await db.collection('todos').add({
      text,
      completed,
      status,
      createdAt: new Date()
    });
    console.log('Todo created successfully with ID:', docRef.id);
    res.status(201).json({
      id: docRef.id,
      text,
      completed,
      status
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update a todo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed, status } = req.body;
    const updateData: any = {
      updatedAt: new Date()
    };

    // Only include fields that are provided in the request
    if (text !== undefined) updateData.text = text;
    if (completed !== undefined) updateData.completed = completed;
    if (status !== undefined) updateData.status = status;

    await db.collection('todos').doc(id).update(updateData);
    res.json({ id, ...updateData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('todos').doc(id).delete();
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

export default router; 