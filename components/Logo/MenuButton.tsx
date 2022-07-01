import {Link, Tooltip, Text, Box, VStack} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

interface Props {
  icon: React.ReactNode;
  label: string;
  isTooltip: boolean;
  href: string;
}

const MenuButton: React.FC<Props> = ({icon, label, isTooltip, href}) => {
  const MenuLink: React.FC<{children: React.ReactNode}> = ({children}) => {
    return (
      <NextLink passHref href={href}>
        <Link>{children}</Link>
      </NextLink>
    );
  };

  if (isTooltip) {
    return (
      <Tooltip label={label}>
        <Box>
          <MenuLink>{icon}</MenuLink>
        </Box>
      </Tooltip>
    );
  }

  return (
    <VStack margin-top="0px">
      <MenuLink>{icon}</MenuLink>
      <Text fontSize="sm">{label}</Text>
    </VStack>
  );
};

export default MenuButton;
