import { useAddress, useMetamask } from '@thirdweb-dev/react'

export const ConnectMetamaskButton = () => {
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  return (
    <div>
      {address ? (
        <h4>Connected as {address}</h4>
      ) : (
        <button onClick={connectWithMetamask}>Connect Metamask Wallet</button>
      )}
    </div>
  )
}
