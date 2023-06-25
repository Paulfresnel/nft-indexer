import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
  Card,
  CardBody,
  CardHeader, 
  CardFooter,
  Stack,
  Divider,
  Tooltip,
  ButtonGroup,
} from '@chakra-ui/react';
import { HamburgerIcon } from "@chakra-ui/icons"
import { Alchemy, Network } from 'alchemy-sdk';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { InfinitySpin } from 'react-loader-spinner';


function App() {
  const [userAddress, setUserAddress] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [nftData, setNftData] = useState([]);

  useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log('Connected', { address, connector, isReconnected })
      setUserAddress(address)
    },
  })

  async function getNFTsForOwner() {
    setIsLoading(true);
    const config = {
      apiKey: import.meta.env.API_KEY,
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);
    const data = await alchemy.nft.getNftsForOwner(userAddress);
    console.log("initial nft data:", data);
    setIsLoading(false);
    setHasQueried(true);
    setNftData(data);
  }
  return (
    <Box w="100vw">
      <Center>
      <ConnectButton />
        <Flex
          alignItems={'center'}
          justifyContent="center"
          flexDirection={'column'}
        >
          <Heading mb={0} fontSize={36}>
            NFT Indexer 🖼
          </Heading>
          <Text>
            Plug in an address and this website will return all of its NFTs!
          </Text>
        </Flex>
      </Center>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
      >
        <Heading mt={42}>Get all the ERC-721 tokens of this address:</Heading>
        <Input
          onChange={(e) => setUserAddress(e.target.value)}
          color="black"
          value={userAddress}
          w="600px"
          textAlign="center"
          p={4}
          bgColor="white"
          fontSize={24}
        />
        <Button fontSize={20} onClick={getNFTsForOwner} mt={36} bgColor="#0098fd">
          Fetch NFTs
        </Button>
        {(!isLoading && hasQueried) && <div className='margin-b'>
        <Divider/>

        <Heading className='title-main' my={36}>You have <strong className='nft-count'> {" "+ nftData.ownedNfts.length+ " "} </strong> NFTs in total</Heading>
        <div className='flex-cards'>
          {nftData.ownedNfts.map(nft=>{
            console.log(nft)
            return (<Card className='card' maxW={"sm"}>
              <CardBody>
                <Image className='small-img' src={nft.rawMetadata?.image ?? 'https://via.placeholder.com/200'}/>
              
              <Stack mt="6" spacing="3">
              <Heading color={"blue"} textDecoration={"underline"} size="md"><a target='_blank' href={`https://opensea.io/assets/ethereum/${nft.contract.address}/${nft.tokenId}`}>{nft.contract?.name ?? "Untitled"} #{nft.tokenId.length > 10 ? nft.tokenId.slice(0,4)+"..."+nft.tokenId.slice(nft.tokenId.length-4,nft.tokenId.length) : nft.tokenId}</a></Heading>
                <Text>Creator/Deployer Address: <a target='_blank' href={`https://etherscan.io/address/${nft.contract.contractDeployer}`}>{nft.contract.contractDeployer.slice(0,5)+"..."+nft.contract.contractDeployer.slice(nft.contract.contractDeployer.length-5,nft.contract.contractDeployer.length)}</a></Text>
                <Divider/>
                <Text>
                  {nft.contract.openSea?.description?.length > 205 ? <div>{nft.contract.openSea.description.slice(0,205)+" "}<Tooltip  label={nft.contract.openSea.description.slice(205,nft.contract.openSea.description.length)}> [...] </Tooltip></div>:nft.contract.openSea?.description  ?? "No description is available for this collection"}
                </Text>
                <Divider/>
                <div className='flex-r'>
                <Text>Symbol</Text>
                <Text>Total Supply</Text>
                <Text>Floor Price</Text>
                </div>
                
                <div className='flex-r'>
                <Text color={"blue"}><a target='_blank' href={`https://etherscan.io/token/${nft.contract.address}`}>{nft.contract?.symbol}</a></Text>
                <Text>{nft.contract.totalSupply}</Text>
                <Text fontWeight={"bold"}>{nft.contract.openSea?.floorPrice < 0.001 ? "~0 ": nft.contract.openSea.floorPrice  ?? "0"} ETH</Text>
                </div>
              </Stack>
              </CardBody>
              <Divider/>
              <CardFooter className='flexing'>
              <div className='flex-c'>
              <Text>Website</Text>
              <Button><a target='_blank' href={nft.contract.openSea.externalUrl}><i class="fa-solid fa-globe"></i></a></Button>
              </div>
              <Divider colorScheme='black' className='vertical' orientation='vertical' />
              <div className='flex-c'>
              <Text>OpenSea</Text>
              <Button><a target='_blank' href={`https://opensea.io/assets/ethereum/${nft.contract.address}`}><i class="fa-solid fa-store"></i></a></Button>
              </div>
              </CardFooter>
            </Card>)
          })
          }
          </div>
          </div>
          }
      </Flex>
    </Box>
  );
}

export default App;
