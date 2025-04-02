import { Box, VStack, Icon, Text, Flex } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome,
  FiCalendar,
  FiCheckSquare,
  FiDollarSign,
  FiSettings
} from 'react-icons/fi';

const menuItems = [
  { name: 'Overview', icon: FiHome, path: '/overview' },
  { name: 'Planner', icon: FiCalendar, path: '/planner' },
  { name: 'Todo', icon: FiCheckSquare, path: '/todo' },
  { name: 'Budget', icon: FiDollarSign, path: '/budget' },
  { name: 'Settings', icon: FiSettings, path: '/settings' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <Box w="240px" bg="dark.200" p="4" borderRightWidth="1px" borderColor="gray.700">
      <VStack spacing="4" align="stretch">
        {menuItems.map((item) => (
          <Link to={item.path} key={item.name}>
            <Flex
              p="3"
              borderRadius="lg"
              align="center"
              bg={location.pathname === item.path ? 'brand.primary' : 'transparent'}
              color={location.pathname === item.path ? 'white' : 'gray.400'}
              _hover={{
                bg: location.pathname === item.path ? 'brand.primary' : 'dark.300',
                color: 'white',
              }}
            >
              <Icon as={item.icon} boxSize="5" />
              <Text ml="3" fontSize="sm" fontWeight="medium">
                {item.name}
              </Text>
            </Flex>
          </Link>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar; 