import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import ChakraSidebar from './ChakraSidebar';

interface ChakraDashboardLayoutProps {
  children: ReactNode;
}

const ChakraDashboardLayout = ({ children }: ChakraDashboardLayoutProps) => {
  return (
    <Box>
      <ChakraSidebar />
      <Box ml={{ base: 0, md: '250px' }} p={5} bg="gray.50" minH="100vh">
        {children}
      </Box>
    </Box>
  );
};

export default ChakraDashboardLayout;