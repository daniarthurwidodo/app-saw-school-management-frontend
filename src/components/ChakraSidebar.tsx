import React from 'react';
import {
  Box,
  Flex,
  Icon,
  Text,
  IconButton
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FiHome, FiUsers, FiBook, FiClipboard, FiSettings, FiLogOut, FiMenu } from 'react-icons/fi';

const ChakraSidebar = () => {
  const router = useRouter();

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
    { icon: FiUsers, label: 'Students', path: '/dashboard/users' },
    { icon: FiBook, label: 'Classes', path: '/dashboard/documents' },
    { icon: FiClipboard, label: 'Assignments', path: '/dashboard/tasks' },
    { icon: FiSettings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logout clicked');
  };

  return (
    <>
      {/* Mobile menu button */}
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        aria-label="Open menu"
        position="fixed"
        top={4}
        left={4}
        zIndex={20}
      >
        <Icon as={FiMenu} />
      </IconButton>

      {/* Sidebar for desktop */}
      <Box
        as="nav"
        display={{ base: 'none', md: 'block' }}
        w="250px"
        h="100vh"
        bg="gray.800"
        color="white"
        position="fixed"
        top={0}
        left={0}
        zIndex={10}
      >
        <Flex direction="column" h="full">
          <Box p={5}>
            <Text fontSize="xl" fontWeight="bold" textAlign="center">
              School Management
            </Text>
          </Box>
          
          <Box flex={1} px={3}>
            {menuItems.map((item, index) => (
              <Flex
                key={index}
                align="center"
                p={3}
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: 'gray.700' }}
                onClick={() => handleNavigation(item.path)}
                bg={router.pathname === item.path ? 'gray.700' : 'transparent'}
              >
                <Icon as={item.icon} mr={3} />
                <Text>{item.label}</Text>
              </Flex>
            ))}
          </Box>
          
          <Box borderTop="1px" borderColor="gray.700" />
          
          <Flex
            align="center"
            p={3}
            mx={3}
            mb={3}
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: 'gray.700' }}
            onClick={handleLogout}
          >
            <Icon as={FiLogOut} mr={3} />
            <Text>Logout</Text>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default ChakraSidebar;