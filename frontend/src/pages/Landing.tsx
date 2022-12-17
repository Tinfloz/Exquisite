import { Box, Flex, HStack, Text, VStack, Button } from '@chakra-ui/react'
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'

const Landing: FC = () => {

    const navigate = useNavigate();

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="20vh"
            >
                <HStack spacing="3vh">
                    <Box
                        w="40vh"
                        h="40vh"
                        borderStyle="dashed"
                        borderWidth="1px"
                        borderColor="gray.300"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <VStack>
                            <Text fontSize="2vh">
                                Register as a vendor and sell your art!
                            </Text>
                            <Button
                                onClick={() => {
                                    localStorage.setItem("type", "Vendor")
                                    navigate("/register/vendor")
                                }}
                            >Register</Button>
                        </VStack>
                    </Box>
                    <Box
                        w="40vh"
                        h="40vh"
                        borderStyle="dashed"
                        borderWidth="1px"
                        borderColor="gray.300"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <VStack>
                            <Text fontSize="2vh">
                                Register and buy exquisite art!
                            </Text>
                            <Button
                                onClick={() => {
                                    localStorage.setItem("type", "Client")
                                    navigate("/register/client")
                                }}
                            >Register</Button>
                        </VStack>
                    </Box>
                </HStack>
            </Flex>
            <footer id="footer">
                <Flex
                    justify="center"
                    alignItems="center"
                    bg="green.800"
                    h="12vh"
                >
                    <Text
                        fontSize="5vh"
                        color="gray.300"
                        as="i"
                    >
                        Welcome to Exquisite!
                    </Text>
                </Flex>
            </footer>
        </>
    )
}

export default Landing;