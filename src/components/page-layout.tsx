import {
  Container,
  Flex,
  HStack,
  Link,
  Stack,
  StackDivider,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { ConnectMetamaskButton } from './connect-metamask-button'

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <Container maxW="container.lg">
      <Stack spacing={8} align="stretch">
        <Navbar />

        {children}
      </Stack>
    </Container>
  )
}

function Navbar() {
  return (
    <Flex h={16} alignItems="center" justify="end">
      <HStack>
        <NextLink href="/" passHref>
          <Link>Create NFT</Link>
        </NextLink>
        <NextLink href="/claim" passHref>
          <Link>Claim</Link>
        </NextLink>
        <ConnectMetamaskButton />
      </HStack>
    </Flex>
  )
}
