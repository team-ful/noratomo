import {
  Link,
  Tooltip,
  Text,
  Box,
  VStack,
  MenuButton as MenuB,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

interface Props {
  icon: React.ReactNode;
  label: string;
  isTooltip: boolean;
  href?: string;
}

const MenuLink: React.FC<{children: React.ReactNode; href: string}> = ({
  children,
  href,
}) => {
  return (
    <NextLink passHref href={href}>
      <Link>{children}</Link>
    </NextLink>
  );
};

export const MenuButtonMenu: React.FC<Props> = ({icon, label}) => {
  return (
    <Tooltip label={label} borderRadius="10px">
      <MenuB>
        <Box cursor="pointer">{icon}</Box>
      </MenuB>
    </Tooltip>
  );
};

const MenuButton: React.FC<Props> = ({icon, label, isTooltip, href}) => {
  if (typeof href === 'undefined') {
    return (
      <Tooltip label={label} borderRadius="10px">
        <Box cursor="pointer">{icon}</Box>
      </Tooltip>
    );
  }

  if (isTooltip) {
    return (
      <Tooltip label={label} borderRadius="10px">
        <Box>
          <MenuLink href={href}>{icon}</MenuLink>
        </Box>
      </Tooltip>
    );
  }

  return (
    <VStack margin-top="0px">
      <MenuLink href={href}>{icon}</MenuLink>
      <Text fontSize="sm">{label}</Text>
    </VStack>
  );
};

export default MenuButton;
