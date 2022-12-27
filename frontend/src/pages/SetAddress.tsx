import React, { FC, useState, useEffect, ChangeEvent } from 'react';
import { Flex, Box, VStack, Input, Text, Button, useToast } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from '../typed.hooks/hooks';
import { ISetAddressParam } from '../interfaces/redux.interfaces/auth.slice.interface';
import { resetUserHelpers, setAddressUser } from '../reducers/auth.reducer/auth.slice';
import { useNavigate } from "react-router-dom";

interface ISetAddressProps {
    seller: boolean,
}

const SetAddress: FC<ISetAddressProps> = ({ seller }) => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const toast = useToast();
    const { isSuccess, isError } = useAppSelector(state => state.auth);

    const [address, setAddress] = useState<ISetAddressParam>({
        address: "",
        city: "",
        province: "",
        pincode: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAddress(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    useEffect(() => {
        if (!isSuccess && !isError) {
            return
        };
        if (isSuccess) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: "Address set!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            seller ? (
                navigate("/create/product")
            ) : (
                navigate(localStorage.getItem("path")!)
            )
            localStorage.removeItem("path")
        };
        if (isError) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: "Address could not be set!",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            setAddress(prevState => ({
                ...prevState,
                address: "",
                city: "",
                province: "",
                pincode: ""
            }))
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
                    w="50vh"
                    h="50vh"
                    borderWidth="1px"
                    borderColor="gray.300"
                    borderRadius="1vh"
                >
                    <Flex
                        justify="center"
                        alignItems="center"
                        p="2.5vh"
                    >
                        <VStack spacing="2.5vh">
                            <Text
                                fontSize="3vh"
                                as="b"
                            >
                                Set address to proceed
                            </Text>
                            <Input name="address" value={address.address} placeholder="Enter an address"
                                onChange={handleChange} />
                            <Input name="city" value={address.city} placeholder="city"
                                onChange={handleChange} />
                            <Input name="province" value={address.province} placeholder="province"
                                onChange={handleChange} />
                            <Input name="pincode" value={address.pincode} placeholder="pincode"
                                onChange={handleChange} />
                            <Button
                                onClick={async () => {
                                    await dispatch(setAddressUser(address))
                                }}
                            >
                                Set Address
                            </Button>
                        </VStack>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}

export default SetAddress