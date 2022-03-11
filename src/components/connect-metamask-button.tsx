import { Box, Button, Text } from '@chakra-ui/react'
import { useAddress, useMetamask } from '@thirdweb-dev/react'

export const ConnectMetamaskButton = () => {
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  return (
    <Box>
      {address ? (
        <Text isTruncated>Connected as {address}</Text>
      ) : (
        <Button onClick={connectWithMetamask}>Connect Metamask Wallet</Button>
      )}
    </Box>
  )
}
