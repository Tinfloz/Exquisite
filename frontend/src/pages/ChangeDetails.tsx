import React, { ChangeEvent, FC, useState, useEffect } from 'react';
import { Box, Button, Flex, Input, Text, VStack, useToast } from '@chakra-ui/react';
import { useAppSelector, useAppDispatch } from '../typed.hooks/hooks';
import { changeDetailsAccount, resetUserHelpers } from '../reducers/auth.reducer/auth.slice';

const ChangeDetails: FC = () => {

    const [details, setDetails] = useState<{ email?: string, password?: string }>({
        email: "",
        password: ""
    });

    const { isSuccess, isError } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const toast = useToast();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDetails(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    useEffect(() => {
        if (!isSuccess && !isError) {
            return
        }
        if (isSuccess) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: "Successfully updated details!",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        };
        if (isError) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: "Could not update details!",
                status: "warning",
                duration: 9000,
                isClosable: true,
            });
        };
        dispatch(resetUserHelpers());
    }, [isSuccess, isError, toast, dispatch])

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="20vh"
            >
                <Box
                    justifyContent="center"
                    alignItems="center"
                    borderWidth="1px"
                    borderColor="gray.300"
                    borderRadius="1vh"
                    w="40vh"
                    h="40vh"
                >
                    <Flex
                        justify="center"
                        p="2vh"
                    >
                        <VStack spacing="3vh">
                            <Text
                                as="b"
                                fontSize="3vh"
                            >
                                Change account details!
                            </Text>
                            <Input
                                type="email"
                                placeholder="email"
                                value={details.email}
                                name="email"
                                onChange={handleChange}
                            />
                            <Input
                                type="password"
                                placeholder="password"
                                value={details.password}
                                name="password"
                                onChange={handleChange}
                            />
                            <Button
                                bg="purple.200"
                                onClick={async () => {
                                    await dispatch(changeDetailsAccount(details));
                                    setDetails(prevState => ({
                                        ...prevState,
                                        email: "",
                                        password: ""
                                    }))
                                }}
                            >
                                Update details
                            </Button>
                        </VStack>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}

export default ChangeDetails