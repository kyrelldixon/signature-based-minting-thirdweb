import { Button, Heading, Input, Stack, Textarea } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { PageLayout } from '../components/page-layout'
import { useNFTCollection } from '@thirdweb-dev/react'
import {
  NATIVE_TOKEN_ADDRESS,
  NFTMetadata,
  SignedPayload,
} from '@thirdweb-dev/sdk'
import { useLocalStorage } from '../hooks/use-local-storage'

type FormData = {
  name: string
  description: string
}

export default function Home() {
  return (
    <PageLayout>
      <Heading>Create an NFT</Heading>
      <CreateNftSignatureForm />
    </PageLayout>
  )
}

function CreateNftSignatureForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful, isDirty },
  } = useForm<FormData>()
  const [nfts, savePayload] = useLocalStorage<SignedPayload[]>('nfts', [])
  const onSubmit = async (data) => {
    const signedPayload = await generateSignature(data)
    savePayload([...nfts, signedPayload])
  }

  const nftContract = useNFTCollection(
    process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS
  )

  const generateSignature = async (metadata: NFTMetadata) => {
    // Arbitrarily choosing 30 days for the demo
    const futureDateMilliseconds = Date.now() + daysToMilliseconds(30)
    const mintEndTime = new Date(futureDateMilliseconds)
    const signedPayload = await nftContract.signature.generate({
      currencyAddress: NATIVE_TOKEN_ADDRESS,
      price: 0,
      metadata,
      mintEndTime,
    })

    return signedPayload
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Input
          type="text"
          placeholder="Board Donkeys"
          {...register('name', {})}
        />
        <Textarea
          placeholder="A chess board played with donkeys"
          {...register('description', {})}
        />

        <Button
          isLoading={isSubmitting}
          isDisabled={isSubmitSuccessful && !isDirty}
          type="submit"
        >
          {isSubmitSuccessful ? 'Saved!' : 'Generate'}
        </Button>
      </Stack>
    </form>
  )
}

function daysToMilliseconds(days: number) {
  return days * 24 * 60 * 60 * 1000
}
