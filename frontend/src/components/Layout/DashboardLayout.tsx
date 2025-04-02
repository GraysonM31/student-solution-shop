import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { Sidebar } from '.';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <Flex minH="100vh" bg={useColorModeValue('gray.900', 'gray.900')}>
      <Sidebar />
      <Box flex="1" p="6">
        {children}
      </Box>
    </Flex>
  );
};

export default DashboardLayout; 