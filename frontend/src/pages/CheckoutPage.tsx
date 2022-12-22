import React, { FC, useEffect } from 'react';
import { IOrderSingleItemParam } from '../interfaces/redux.interfaces/order.slice.interface';
import { orderCartItems, orderSingleItemById, resetOrderHelpers } from '../reducers/order.reducer/order.slice';
import { useAppDispatch, useAppSelector } from "../typed.hooks/hooks";
import { Flex, Box, Text, Stack, HStack, Avatar, Spinner, VStack, Button } from "@chakra-ui/react";

interface ICheckOutProps {
    cart: boolean
}

const CheckoutPage: FC<ICheckOutProps> = ({ cart }) => {

    const { order } = useAppSelector(state => state.orders);
    const { user } = useAppSelector(state => state.auth)

    const dispatch = useAppDispatch();

    let orderDetails = {}
    if (!cart) {
        Object.assign(orderDetails, {
            id: window.location.href.split("/").at(-2),
            quantity: {
                qty: Number(window.location.href.split("/").at(-1))
            }
        });
    };


    useEffect(() => {
        if (cart) {
            return
        };
        (async () => {
            if (((param: any): param is IOrderSingleItemParam => {
                let keyArr = Object.keys(orderDetails);
                return keyArr.length !== 0 && param.id !== undefined
            })(orderDetails)) {
                await dispatch(orderSingleItemById(orderDetails));
                dispatch(resetOrderHelpers());
            }
        })()
    }, [dispatch, JSON.stringify(orderDetails)])

    useEffect(() => {
        if (!cart) {
            return
        }
        (async () => {
            await dispatch(orderCartItems());
            dispatch(resetOrderHelpers());
        })()
    }, [dispatch, JSON.stringify(user)])

    if (!order) {
        return (
            <>
                <Flex
                    justify="center"
                    alignItems="center"
                    mt="25vh"
                >
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                </Flex>
            </>
        )
    }

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="15vh"
            >
                <Box
                    h="50vh"
                    w="50vh"
                    borderWidth="1px"
                    borderColor="gray.300"
                    borderRadius="1vh"
                >
                    <Flex
                        justify="center"
                        p="2vh"
                    >
                        <Text
                            as="b"
                            fontSize="3vh"
                        >
                            Checkout
                        </Text>
                    </Flex>
                    <Flex
                        p="3vh"
                    >
                        <Stack
                            direction="column"
                            spacing="2vh"
                        >
                            {
                                order?.items?.map(element => (
                                    <HStack spacing="2vh">
                                        <Avatar
                                            src={element.product.image}
                                            name={element.product.item}
                                            size="md"
                                        />
                                        <Text>{element.product.item}</Text>
                                        <Text>${element.product.price.toFixed(2)}</Text>
                                    </HStack>
                                ))
                            }
                            <Text><strong>Shipping: </strong>${order?.shippingFee.toFixed(2)}</Text>
                            <Text><strong>Sales tax: </strong>${order?.salesTax.toFixed(2)}</Text>
                            <Text><strong>Subtotal: </strong>${order?.total.toFixed(2)}</Text>
                        </Stack>
                    </Flex>
                    <Flex
                        justify='center'
                        pt="1vh"
                    >
                        <Button>
                            Place Order
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}

export default CheckoutPage