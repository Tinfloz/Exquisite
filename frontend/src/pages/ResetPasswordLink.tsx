import React, { useState, FC, useEffect } from 'react';
import { Flex, Box, VStack, Input, Text, Button, useToast } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from '../typed.hooks/hooks';
import { getResetLink, resetUserHelpers } from '../reducers/auth.reducer/auth.slice';

const ResetPasswordLink: FC = () => {

    console.log("rerendered in reset link")

    const [email, setEmail] = useState<{ email: string }>({
        email: ""
    });

    const dispatch = useAppDispatch();
    const toast = useToast();

    const { isSuccess, isError } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (!isSuccess && !isError) {
            console.log("returned")
            return
        } else if (isSuccess) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: "Email sent!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            console.log("is success")
        } else if (isError) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: "Email could not be sent!",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            console.log("ise error")
        };
        dispatch(resetUserHelpers());
    }, [isSuccess, isError, dispatch, toast])

    console.log("use effect eun ")

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="20vh"
            >
                <Box
                    w="40vh"
                    h="40vh"
                    borderWidth="1px"
                    borderColor="gray.300"
                    borderRadius="1vh"
                >
                    <Flex
                        justify="center"
                        p="2vh"
                    >
                        <VStack spacing="3vh">
                            <Text
                                as="b"
                                fontSize="2.5vh"
                            >
                                Reset Password
                            </Text>
                            <Input type="email" placeholder="email" value={email.email}
                                onChange={(e) => setEmail(prevState => ({
                                    ...prevState,
                                    email: e.target.value
                                }))} />
                            <Button
                                onClick={
                                    async () => {
                                        await dispatch(getResetLink(email));
                                        console.log("dispatched in reset link")
                                        setEmail(prevState => ({
                                            ...prevState,
                                            email: ""
                                        }))
                                        console.log("changed in reset link")
                                    }
                                }
                            >
                                Send email
                            </Button>
                        </VStack>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}

export default ResetPasswordLink