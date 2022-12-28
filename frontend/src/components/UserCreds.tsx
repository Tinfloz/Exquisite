import React, { FC, useState, useEffect, ChangeEvent } from 'react';
import { Flex, Box, Text, VStack, Input, Button, useToast } from "@chakra-ui/react";
import { First, IUserCreds } from "../interfaces/user.creds";
import { useAppDispatch, useAppSelector } from '../typed.hooks/hooks';
import { resetUserHelpers, userLogin, userRegister } from '../reducers/auth.reducer/auth.slice';
import { useNavigate } from 'react-router-dom';

const UserCreds: FC<First> = ({ first, seller }) => {

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const toast = useToast();

    const { isSuccess, isError } = useAppSelector(state => state.auth);

    const handleSubmit = async (): Promise<void> => {
        first ?
            (
                await dispatch(userRegister(creds))
            ) :
            (
                await dispatch(userLogin(creds))
            )
        localStorage.removeItem("type")
    }

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

    useEffect(() => {
        if (!isSuccess && !isError) {
            return
        } else if (isSuccess) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: first ? `${seller ? "Registered successfully as a vendor!" : "Registered successfully!"}` : "Logged in successfully!",
                status: "success",
                duration: 9000,
                isClosable: true,
            })
            navigate("/home");
        } else if (isError) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: "Sorry! Could not log you in",
                status: "warning",
                duration: 9000,
                isClosable: true,
            })
            navigate(seller ? "/login/vendor" : "/login/client");
        }
        dispatch(resetUserHelpers());
    }, [isSuccess, isError, toast, navigate])

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
                        onClick={handleSubmit}
                    >
                        {
                            first ? "Register" : "Login"
                        }
                    </Button>
                    {
                        first ? (
                            null
                        ) : (
                            <Text
                                as="button"
                                color="gray.500"
                                onClick={
                                    () => navigate("/get/reset/link")
                                }
                            >
                                Forgot Password? Reset!
                            </Text>
                        )
                    }
                </VStack>
            </Flex>
        </Box >
    )
}

export default UserCreds