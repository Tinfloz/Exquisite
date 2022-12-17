import { Button, Flex, HStack, IconButton, Image, Input, Box } from '@chakra-ui/react'
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.jpeg";
import { AiOutlineSearch } from "react-icons/ai";

interface ISendUser {
    email: string,
    userType: string,
    token: string,
    [x: string]: any;
}

interface IUser {
    sendUser: ISendUser | null
}

const NavBar: FC<IUser> = ({ sendUser }) => {

    const navigate = useNavigate();

    return (
        <>
            <Flex
                bg="green.800"
            >
                <HStack spacing={!sendUser ? "140vh" : "50vh"}>
                    <Image
                        src={logo}
                        alt="logo"
                        borderRadius="12px"
                        width="4rem"
                        height="4rem"
                        ml="0.4rem"
                        mb="0.4rem"
                        mt="0.4rem"
                    />
                    {
                        !sendUser ? (
                            <>
                                <Box>
                                    <Button
                                        onClick={() => {
                                            const type = localStorage.getItem("type");
                                            type === "Client" ? navigate("/register/client") : navigate("/register/vendor")
                                        }}
                                        mr="1vh"
                                    >Register</Button>
                                    <Button
                                        onClick={() => {
                                            const type = localStorage.getItem("type");
                                            type === "Client" ? navigate("/login/client") : navigate("/login/vendor")
                                        }}
                                    >Login</Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                {
                                    sendUser.userType === "Buyer" ? (
                                        <>
                                            <HStack>
                                                <HStack>
                                                    <Input placeholder='Search' />
                                                    <IconButton
                                                        icon={<AiOutlineSearch style={{ color: "white" }} />}
                                                        aria-label="Search"
                                                        size="lg"
                                                        bg="green.800"
                                                        _hover={{ bg: "green.800" }}
                                                    />
                                                </HStack>
                                                <Button
                                                    onClick={() => {
                                                        sendUser.userType === "Buyer" ? navigate("/login/client") : navigate("/login/vendor")
                                                    }}
                                                >Logout</Button>
                                            </HStack>
                                        </>
                                    ) : (null)
                                }
                            </>
                        )
                    }
                </HStack>
            </Flex>
        </>
    )
}

export default NavBar