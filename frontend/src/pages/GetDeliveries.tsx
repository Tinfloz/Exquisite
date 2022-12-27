import React, { FC, useEffect } from 'react';
import { getAllSellerOrders, resetSeller, resetSellerHelpers } from '../reducers/seller.reducer/seller.slice';
import { useAppDispatch, useAppSelector } from '../typed.hooks/hooks';
import { Flex, Spinner, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom"
import { ISingleMyOrder } from '../interfaces/redux.interfaces/seller.slice.interface';
import { resetOrderHelpers } from '../reducers/order.reducer/order.slice';

const GetDeliveries: FC = () => {

    const dispatch = useAppDispatch();
    const { orderStack } = useAppSelector(state => state.sellers);

    useEffect(() => {
        (async () => {
            dispatch(getAllSellerOrders())
        })()
    }, [dispatch])

    useEffect(() => {
        return () => {
            dispatch(resetSeller())
        }
    }, [dispatch])


    if (!orderStack) {
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

    const instanceOfSingleMyOrder = (param: any): param is ISingleMyOrder => {
        return param.productId !== undefined && param.orderId !== undefined
    }

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                pt="10vh"
            >
                {
                    orderStack?.length === 0 ? (
                        <>
                            <Text
                                as="b"
                                fontSize="4vh"
                                color="gray.300"
                            >There are no orders to be delivered</Text>
                        </>
                    ) : (
                        <>
                            <TableContainer>
                                <Table
                                    size="lg"
                                    variant="simple"
                                >
                                    <TableCaption>My Orders</TableCaption>
                                    <Thead>
                                        <Tr>
                                            {
                                                Object.keys(orderStack[0]!).map(element => (
                                                    <Th>
                                                        {element}
                                                    </Th>
                                                ))
                                            }
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {
                                            orderStack?.map(element => (
                                                instanceOfSingleMyOrder(element) ?
                                                    (
                                                        <>
                                                            <Tr>
                                                                <Link to={`/mark/delivered/${element.productId}/${element.orderId}`}>
                                                                    <Td>{element.orderId}</Td>
                                                                </Link>
                                                                <Td>{element.qty}</Td>
                                                                <Td>{element.item}</Td>
                                                                <Td>{element.productId}</Td>
                                                                <Td>{element.address}</Td>
                                                                <Td>{element.city}</Td>
                                                                <Td>{element.province}</Td>
                                                                <Td>{element.pincode}</Td>
                                                            </Tr>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Text
                                                                fontSize="4vh"
                                                                as="b"
                                                                color="gray.300"
                                                            >
                                                                There was an error loading the page!
                                                            </Text>
                                                        </>
                                                    )
                                            ))
                                        }
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </>
                    )
                }
            </Flex>

        </>
    )
}

export default GetDeliveries;