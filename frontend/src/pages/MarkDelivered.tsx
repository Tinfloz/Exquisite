import React, { FC, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../typed.hooks/hooks';
import { Box, Button, Flex, Spinner, Text, VStack, useToast } from "@chakra-ui/react"
import { useParams } from 'react-router-dom';
import { getMyProductsAndOrders, markSellerOrdersDelivered, resetSellerHelpers } from '../reducers/seller.reducer/seller.slice';
import { IProduct } from '../interfaces/redux.interfaces/product.interfaces';

const MarkDelivered: FC = () => {

    const { productId, orderId } = useParams();
    const { productStack, isSuccess, isError } = useAppSelector(state => state.sellers);
    const [delivered, setDelivered] = useState(false);
    const dispatch = useAppDispatch();
    const toast = useToast();

    useEffect(() => {
        if (!isSuccess && !isError) {
            return
        };
        if (isSuccess && delivered) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: "Marked Delivered!",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        };
        if (isError && delivered) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: "There was an error!",
                status: "warning",
                duration: 5000,
                isClosable: true,
            })
        }
    }, [isSuccess, isError, toast, dispatch])

    const instanceOfSingleProduct = (param: any): param is { product: IProduct, deliveryStatus: boolean } => {
        return param.deliveryStatus !== undefined
    };

    useEffect(() => {
        let productDetails = {
            productId: productId!,
            orderId: orderId!
        };
        (async () => {
            await dispatch(getMyProductsAndOrders(productDetails));
            dispatch(resetSellerHelpers());
        })()
    }, [dispatch])


    if (!productStack) {
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
                p="20vh"
            >
                <Box
                    w="50vh"
                    h="50vh"
                    borderWidth="1px"
                    borderRadius="1vh"
                    borderColor="gray.300"
                >
                    <Flex
                        justify="center"
                        alignItems="center"
                        p="4vh"
                    >
                        <VStack spacing="4vh">
                            <Text
                                as="b"
                                fontSize="2.5vh"
                            >
                                Mark Order Delivered
                            </Text>
                            {
                                instanceOfSingleProduct(productStack) ? (
                                    <>
                                        <Text>
                                            {productStack?.product?.item}
                                        </Text>
                                        <Text>
                                            {productStack?.product?.stock}
                                        </Text>
                                        <Text>
                                            {productStack?.deliveryStatus}
                                        </Text>
                                        <Button
                                            disabled={productStack.deliveryStatus || delivered ? true : false}
                                            onClick={async () => {
                                                setDelivered(true)
                                                let productDetails = {
                                                    productId: productId!,
                                                    orderId: orderId!
                                                };
                                                await dispatch(markSellerOrdersDelivered(productDetails));
                                                dispatch(resetSellerHelpers())
                                            }}
                                        >
                                            {productStack.deliveryStatus ? "Delivered" : "Mark Delivered"}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Text
                                            as="b"
                                            color="gray.300"
                                            fontSize="4vh"
                                        >
                                            There has been an error loading this page
                                        </Text>
                                    </>
                                )
                            }
                        </VStack>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}

export default MarkDelivered