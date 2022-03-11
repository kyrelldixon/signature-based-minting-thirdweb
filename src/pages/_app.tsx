import { ChakraProvider } from '@chakra-ui/react'
import { ThirdwebProvider, ChainId } from '@thirdweb-dev/react'
import { AppProps } from 'next/app'

import theme from '../theme'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ThirdwebProvider desiredChainId={ChainId.Mumbai}>
        <Component {...pageProps} />
      </ThirdwebProvider>
    </ChakraProvider>
  )
}

export default MyApp
