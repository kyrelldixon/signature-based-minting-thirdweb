import { Container, Flex, Stack, StackDivider } from '@chakra-ui/react'
import { ConnectMetamaskButton } from './connect-metamask-button'

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <Container maxW="container.lg">
      <Stack spacing={8} align="stretch">
        <Flex justify="end">
          <ConnectMetamaskButton />
        </Flex>

        {children}
      </Stack>
    </Container>
  )
}
