import { Container, Flex } from '@chakra-ui/react'
import { ConnectMetamaskButton } from './connect-metamask-button'

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <Container>
      <Flex justify="end">
        <ConnectMetamaskButton />
      </Flex>
      {children}
    </Container>
  )
}
