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
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>()
  const [nfts, savePayload] = useLocalStorage<SignedPayload[]>('nfts', [])
  const onSubmit = async (data) => {
    const signedPayload = await generateSignature(data)
    savePayload([...nfts, signedPayload])
  }

  const nftContract = useNFTCollection(
    '0xB2626f516112Ef0B80B8D71E5Aa3F0617AC609b1'
  )

  const generateSignature = async (metadata: NFTMetadata) => {
    const signedPayload = await nftContract.signature.generate({
      currencyAddress: NATIVE_TOKEN_ADDRESS,
      price: 0,
      metadata,
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
          isDisabled={isSubmitSuccessful}
          type="submit"
        >
          {isSubmitSuccessful ? 'Saved!' : 'Generate'}
        </Button>
      </Stack>
    </form>
  )
}
