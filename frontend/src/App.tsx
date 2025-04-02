import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import theme from './styles/theme';
import DashboardLayout from './components/Layout/DashboardLayout';
import { Landing, Overview, Planner, Todo, Budget, Settings } from './pages';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/budget"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Budget />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/overview"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Overview />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/planner"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Planner />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/todo"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Todo />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
