import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    // Test health endpoint
    console.log('Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('Health check:', healthResponse.data);

    // Test todos endpoints
    console.log('\nTesting todos endpoints...');

    // Create a todo
    console.log('Creating a todo...');
    const createResponse = await axios.post(`${API_URL}/todos`, {
      text: 'Test Todo',
      completed: false
    });
    console.log('Created todo:', createResponse.data);

    // Get all todos
    console.log('\nGetting all todos...');
    const getAllResponse = await axios.get(`${API_URL}/todos`);
    console.log('All todos:', getAllResponse.data);

    // Get todo by ID
    const todoId = createResponse.data.id;
    console.log(`\nGetting todo by ID (${todoId})...`);
    const getByIdResponse = await axios.get(`${API_URL}/todos/${todoId}`);
    console.log('Todo by ID:', getByIdResponse.data);

    // Update todo
    console.log('\nUpdating todo...');
    const updateResponse = await axios.put(`${API_URL}/todos/${todoId}`, {
      text: 'Updated Test Todo',
      completed: true
    });
    console.log('Updated todo:', updateResponse.data);

    // Delete todo
    console.log('\nDeleting todo...');
    await axios.delete(`${API_URL}/todos/${todoId}`);
    console.log('Todo deleted successfully');

    console.log('\nAll API tests completed successfully!');
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('API test failed:', axiosError.response?.data || axiosError.message);
  }
}

testAPI(); 