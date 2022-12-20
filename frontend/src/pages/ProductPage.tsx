import { Divider, Flex, Spinner, Text, Stack, HStack } from '@chakra-ui/react'
import React, { FC, useEffect } from 'react'
import IndividualProductCard from '../components/IndividualProductCard'
import { IProduct } from '../interfaces/redux.interfaces/product.interfaces';
import { getIndProductsById, resetProductHelpers } from "../reducers/product.reducer/product.slice";
import { useAppSelector } from "../typed.hooks/hooks"

interface IProductPageProps {
    cart: boolean
}

const ProductPage: FC<IProductPageProps> = ({ cart }) => {

    const { product } = useAppSelector(state => state.products);

    let id: string;

    if (!cart) {
        const url = window.location.href;
        id = url.split("/").at(-1)!;
    };

    const instanceOfProduct = (param: any): param is IProduct => {
        return param.price !== undefined
    }

    useEffect(() => {
        if (!cart) {
            return
        }
        (async () => {
            getIndProductsById(id)
        })()
    }, [])

    if (!product) {
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
            {
                !cart ? (
                    <>
                        <Flex
                            justify="center"
                            alignItems="center"
                            p="10vh"
                        >
                            {
                                instanceOfProduct(product) ?
                                    (
                                        <IndividualProductCard cart={false} indProdPage={true}
                                            product={product} />
                                    ) : (
                                        null
                                    )
                            }
                        </Flex>
                        <Divider />
                        <Flex
                            justify="center"
                            alignItems="center"
                        >
                            <Text fontSize="4.5vh" as="b">Reviews</Text>
                        </Flex>
                        <>
                            {
                                instanceOfProduct(product) ? (
                                    <>
                                        {
                                            product?.comments?.length === 0 ? (
                                                <>
                                                    <Flex
                                                        justify="center"
                                                        alignItems="center"
                                                    >
                                                        <Text
                                                            fontSize="4vh"
                                                            color="gray.400"
                                                        >
                                                            There are no review on this product
                                                        </Text>
                                                    </Flex>
                                                </>
                                            ) : (
                                                <>
                                                    <Flex>
                                                        <Stack>
                                                            {
                                                                product?.comments?.map((element: any) => (
                                                                    <HStack spacing="3vh">
                                                                        <Text>
                                                                            {element.user.name}
                                                                        </Text>
                                                                        <Text>{element.comment}</Text>
                                                                    </HStack>
                                                                ))
                                                            }
                                                        </Stack>
                                                    </Flex>
                                                </>
                                            )
                                        }
                                    </>
                                ) : (
                                    null
                                )
                            }
                        </>
                    </>
                ) : (
                    <>
                    </>
                )
            }
        </>
    )
}

export default ProductPage