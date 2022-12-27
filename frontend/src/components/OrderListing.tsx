import React, { FC } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Stack, Heading, Box, Text, StackDivider, Badge } from '@chakra-ui/react'
import { IProduct } from '../interfaces/redux.interfaces/product.interfaces';

interface IOrderProps {
    order: {
        product: IProduct,
        delivered: boolean,
        seller: string,
        qty: number
    },
    orderId: string
}

const OrderListing: FC<IOrderProps> = ({ order, orderId }) => {
    return (
        <>
            <Card>
                <CardHeader>
                    <Heading size='md'>{orderId}</Heading>
                </CardHeader>

                <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                        <Box>
                            <Heading size='xs' textTransform='uppercase'>
                                Summary
                            </Heading>
                            <Stack>
                                <Text pt='2' fontSize='sm'>
                                    {order?.product?.item}
                                </Text>
                                <Badge
                                    colorScheme={order?.delivered ? "green" : "red"}
                                >
                                    {
                                        order?.delivered ? "Delivered" : "Not delivered"
                                    }
                                </Badge>
                            </Stack>
                        </Box>
                    </Stack>
                </CardBody>
            </Card>
        </>
    )
}

export default OrderListing