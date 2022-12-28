import React, { useState, useEffect, FC, ChangeEvent } from 'react'
import { Flex, Box, VStack, Text, Button, Input, useToast } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from '../typed.hooks/hooks';
import { resetUserPasswordSet, resetUserHelpers } from '../reducers/auth.reducer/auth.slice';
import { useParams } from 'react-router-dom';

const ChangePassword: FC = () => {

    const dispatch = useAppDispatch();
    const toast = useToast();
    const { isSuccess, isError } = useAppSelector(state => state.auth);
    const { token } = useParams();

    const [newPassword, setNewPassword] = useState<{
        password: string,
        confirmPassword: string
    }>({
        password: "",
        confirmPassword: ""
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewPassword(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    useEffect(() => {
        if (!isSuccess && !isError) {
            console.log("returned")
            return
        } else if (isSuccess) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: "Password reset successfully!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            console.log("is success")
        } else if (isError) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: "Password could not be reset!",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            console.log("ise error")
        };
        dispatch(resetUserHelpers());
    }, [isSuccess, isError, dispatch, toast])


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
                    borderRadius="1vh"
                    borderColor="gray.300"
                    borderWidth="1px"
                >
                    <Flex
                        justify="center"
                        p="3vh"
                    >
                        <VStack spacing="2.5vh">
                            <Text
                                as="b"
                                fontSize="3vh"
                            >
                                Set new password!
                            </Text>
                            <Input placeholder="enter new password" name="password" value={newPassword.password}
                                onChange={handleChange}
                            />
                            <Input placeholder="confirm new password" name="confirmPassword" value={newPassword.confirmPassword}
                                onChange={handleChange}
                            />
                            <Button
                                bg="purple.200"
                                onClick={
                                    async () => {
                                        let passwordChangeDetails = {
                                            token: token!,
                                            passwordChange: newPassword
                                        }
                                        await dispatch(resetUserPasswordSet(passwordChangeDetails));
                                        setNewPassword(prevState => ({
                                            ...prevState,
                                            password: "",
                                            confirmPassword: ""
                                        }))
                                    }
                                }
                            >
                                Change Password
                            </Button>
                        </VStack>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}

export default ChangePassword