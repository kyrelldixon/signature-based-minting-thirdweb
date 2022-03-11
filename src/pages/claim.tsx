import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useNFTCollection } from '@thirdweb-dev/react'
import { SignedPayload } from '@thirdweb-dev/sdk'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { PageLayout } from '../components/page-layout'
import { useLocalStorage } from '../hooks/use-local-storage'

const nftCollectionAddress = '0xB2626f516112Ef0B80B8D71E5Aa3F0617AC609b1'

export default function Claim() {
  const [nftPayloads] = useLocalStorage<SignedPayload[]>('nfts', [])

  return (
    <PageLayout>
      <Heading as="h1">
        {nftPayloads.length === 0
          ? 'There are no NFTs to claim!'
          : 'Claim your NFT!'}
      </Heading>

      {nftPayloads.length > 0 && (
        <SimpleGrid minChildWidth="120px" spacing="40px">
          {nftPayloads.map((nft) => (
            <Nft key={nft.payload.uid} nft={nft} />
          ))}
        </SimpleGrid>
      )}
    </PageLayout>
  )
}

interface NftProps {
  nft: SignedPayload
}

type FormData = {
  signature: string
}

function Nft({ nft }: NftProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>()
  const initialRef = useRef()
  const nftContract = useNFTCollection(nftCollectionAddress)
  const toast = useToast()

  const validateSignature = (signature: string) =>
    signature === nft.signature || 'Invalid signature'

  const mintNft = async (data: FormData) => {
    const userPayload: SignedPayload = {
      payload: nft.payload,
      signature: data.signature,
    }
    const isVerified = await nftContract.signature.verify(userPayload)
    if (isVerified) {
      try {
        const tx = await nftContract.signature.mint(userPayload)
        console.log(tx)
        toast({
          title: `Verified signature and minted NFT`,
          status: 'success',
          isClosable: true,
        })
        reset()
        onClose()
      } catch (error) {
        toast({
          title: `Could not mint NFT`,
          status: 'error',
          isClosable: true,
        })
      }
    }
  }

  return (
    <>
      <Stack
        maxW="xs"
        spacing={4}
        p={3}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
      >
        <Heading as="h2" size="lg">
          {nft.payload.metadata.name}
        </Heading>
        <Text>{nft.payload.metadata.description}</Text>
        <Button onClick={onOpen}>Mint NFT</Button>
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mint NFT</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(mintNft)}>
            <ModalBody pb={6}>
              <FormControl isInvalid={!!errors.signature?.message}>
                <FormLabel>Signature</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="0x123abc.."
                  {...register('signature', {
                    validate: validateSignature,
                  })}
                />
                {errors.signature && (
                  <FormErrorMessage>
                    {errors.signature.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                isLoading={isSubmitting}
                isDisabled={isSubmitSuccessful}
                type="submit"
                colorScheme="blue"
                mr={3}
              >
                Mint
              </Button>
              <Button type="button" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
