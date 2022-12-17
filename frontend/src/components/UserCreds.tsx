import React, { FC, useState, ChangeEvent } from 'react';
import { Flex, Box, Text, VStack, Input, Button } from "@chakra-ui/react";

interface First {
    first: boolean,
    seller: boolean
};

interface IUserCreds {
    email: string,
    password: string,
    userType: string,
    name: string
};


const UserCreds: FC<First> = ({ first, seller }) => {

    const [creds, setCreds] = useState<IUserCreds>({
        email: "",
        password: "",
        name: "",
        userType: seller ? "Seller" : "Buyer"
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCreds(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <Box
            h="55vh"
            w="55vh"
            borderWidth="1px"
            borderColor="gray.400"
            borderRadius="0.5vh"
        >
            <Flex
                justify="center"
                alignItems="center"
                p="2vh"
            >

                <Text
                    as="b"
                    fontSize="3vh"
                >
                    {
                        first ? (seller ? "Register to sell on Exquisite!" : "Register to use Exquisite!") :
                            (seller ? "Login to your vendor account!" : "Login to your account")
                    }
                </Text>
            </Flex>
            <Flex
                justify="center"
                alignItems="center"
                p="1vh"
            >
                <VStack spacing="3vh">
                    {
                        first ?
                            (
                                <>
                                    <Input placeholder="Email" name="email" value={creds.email} onChange={handleChange} />
                                    <Input placeholder="Password" name="password" value={creds.password} onChange={handleChange} />
                                    <Input placeholder="Name" name="name" value={creds.name} onChange={handleChange} />
                                </>
                            ) :
                            (
                                <>
                                    <Input placeholder="Email" name="email" value={creds.email} onChange={handleChange} />
                                    <Input placeholder="Password" name="password" value={creds.password} onChange={handleChange} />
                                </>
                            )
                    }
                    <Button
                        onClick={() => localStorage.removeItem("type")}
                    >
                        {
                            first ? "Register" : "Login"
                        }
                    </Button>
                </VStack>
            </Flex>
        </Box >
    )
}

export default UserCreds