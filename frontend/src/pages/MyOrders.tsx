import React, { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../typed.hooks/hooks';
import { Badge, Box, Card, CardBody, CardHeader, Flex, Heading, Spinner, Stack, StackDivider, Text, VStack } from "@chakra-ui/react";
import { getLoginBuyerOrders, resetOrderHelpers } from '../reducers/order.reducer/order.slice';
import { IOrder } from '../interfaces/redux.interfaces/order.slice.interface';

const MyOrders: FC = () => {
    const dispatch = useAppDispatch();
    const { order } = useAppSelector(state => state.orders);

    console.log(order, "orders my")

    const instanceOfMyOrderArray = (param: any): param is Array<IOrder> => {
        return param.length !== undefined && param[0].isPaid !== undefined
    }

    useEffect(() => {
        (async () => {
            console.log("running use effect")
            await dispatch(getLoginBuyerOrders());
            dispatch(resetOrderHelpers());
        })()
    }, [dispatch])

    if (!order) {
        return (
            <Flex
                alignItems="center"
                justify="center"
                p="25vh"
            >
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />
            </Flex>
        )
    }

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="10vh"
            >
                <>
                    {
                        instanceOfMyOrderArray(order) ? (
                            <VStack spacing="3vh">
                                {
                                    order?.map(element => (

                                        <Card
                                            w="50vh"
                                        >
                                            <CardHeader>
                                                <Heading
                                                    size='md'
                                                >
                                                    {element?._id}
                                                </Heading>
                                            </CardHeader>
                                            <CardBody>
                                                <Stack divider={<StackDivider />} spacing='4'>
                                                    {
                                                        element?.items?.map(product => (
                                                            <Box>
                                                                <Heading
                                                                    size='xs' textTransform='uppercase'
                                                                >
                                                                    {
                                                                        product?.product?.item
                                                                    }
                                                                </Heading>
                                                                <Stack>
                                                                    <Badge
                                                                        colorScheme={product?.delivered ? "green" : "red"}
                                                                    >
                                                                        {
                                                                            product?.delivered ? "Delivered" : "Not delivered"
                                                                        }
                                                                    </Badge>
                                                                    <Text>
                                                                        {
                                                                            product?.qty
                                                                        }
                                                                    </Text>
                                                                </Stack>
                                                            </Box>
                                                        ))
                                                    }
                                                </Stack>
                                            </CardBody>
                                        </Card>

                                    ))
                                }
                            </VStack>
                        ) : (
                            <>
                                <Text
                                    fontSize="4vh"
                                    color="gray.300"
                                    as="b"
                                >
                                    There was an error loading this page
                                </Text>
                            </>
                        )
                    }
                </>
            </Flex>
        </>
    )
}

export default MyOrders