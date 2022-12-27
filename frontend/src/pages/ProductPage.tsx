import { Divider, Flex, Spinner, Text, Stack, HStack, Grid, GridItem, Box, Avatar, VStack, Button } from '@chakra-ui/react'
import React, { FC, useEffect, useState } from 'react'
import IndividualProductCard from '../components/IndividualProductCard'
import { ICartElement } from '../interfaces/redux.interfaces/auth.slice.interface';
import { IProduct } from '../interfaces/redux.interfaces/product.interfaces';
import { getAllUserItemsCart, getIndProductsById, resetProductHelpers, resetProducts } from "../reducers/product.reducer/product.slice";
import { useAppSelector, useAppDispatch } from "../typed.hooks/hooks";
import { useNavigate } from "react-router-dom";

interface IProductPageProps {
    cart: boolean
}

const ProductPage: FC<IProductPageProps> = ({ cart }) => {

    const { product } = useAppSelector(state => state.products);
    const { user } = useAppSelector(state => state.auth);
    const [total, setTotal] = useState<number>(0);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    let id: string;

    if (!cart) {
        const url = window.location.href;
        id = url.split("/").at(-1)!;
    };

    const instanceOfProduct = (param: any): param is IProduct => {
        return param.price !== undefined
    };

    const instanceOfCartElementArray = (param: any): param is Array<ICartElement> => {
        return param.length !== 0 && param[0].product !== undefined
    };

    useEffect(() => {
        if (cart) {
            return
        }
        (async () => {
            await dispatch(getIndProductsById(id));
            dispatch(resetProductHelpers())
        })()
    }, [dispatch])

    useEffect(() => {
        if (!cart) {
            return
        }
        (async () => {
            await dispatch(getAllUserItemsCart());
            dispatch(resetProductHelpers())
        })()
        console.log("parent")
    }, [dispatch, JSON.stringify(user)])

    useEffect(() => {
        if (!cart) {
            return
        };
        if (!product) {
            return
        };
        setTotal(((): number => {
            if (instanceOfCartElementArray(product)) {
                let sum = 0;
                for (let element of product) {
                    sum += (element.product.price * element.qty)
                }
                return sum
            }
            return 0
        })())
    }, [JSON.stringify(product)])

    useEffect(() => {
        return () => {
            dispatch(resetProducts())
        }
    }, [dispatch])

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
                            p="4vh"
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
                                                            There are no reviews on this product
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
                        <HStack>
                            <Flex
                                w="60%"
                                h="100vh"
                                p="3vh"
                            >
                                {
                                    instanceOfCartElementArray(product) ? (
                                        <>
                                            {product?.map(element => (
                                                <Grid
                                                    h="20vh"
                                                    templateRows={`repeat(${product?.length}, 1)`}
                                                    gap="4"
                                                >
                                                    <GridItem display="flex"
                                                        justifyContent="center">
                                                        <IndividualProductCard
                                                            cart={true}
                                                            indProdPage={true}
                                                            product={element.product}
                                                            cartId={element._id}
                                                        />
                                                    </GridItem>
                                                </Grid>
                                            ))}
                                        </>
                                    )
                                        : (
                                            <>
                                                <Text
                                                    as="b"
                                                    fontSize="4vh"
                                                    color="gray.400"
                                                >
                                                    There are no products in your cart
                                                </Text>
                                            </>
                                        )
                                }
                            </Flex>
                            <Flex
                                h="100vh"
                                w="40%"
                                justify="center"
                                alignItems="center"
                            >
                                <Box
                                    h="55vh"
                                    w="55vh"
                                    borderWidth="1px"
                                    borderColor="gray.300"
                                >
                                    <Flex
                                        justify="center"
                                        p="2vh"
                                    >
                                        <Text
                                            fontSize="3vh"
                                            as="b"
                                        >
                                            Order Summary
                                        </Text>
                                    </Flex>
                                    <Flex>
                                        <Stack direction="column" ml="5vh" spacing="3vh">
                                            {
                                                instanceOfCartElementArray(product) ? (
                                                    <>
                                                        {
                                                            product?.map(element => (
                                                                <HStack spacing="3vh">
                                                                    <Avatar
                                                                        src={element?.product?.image}
                                                                        name={element?.product?.item}
                                                                        size="md"
                                                                    />
                                                                    <Text>{element?.product?.item}</Text>
                                                                    <Text>x{element.qty}</Text>
                                                                    <Text>{element?.product?.price}</Text>
                                                                </HStack>
                                                            ))
                                                        }
                                                    </>
                                                ) : (
                                                    null
                                                )
                                            }
                                            <Text><strong>Subtotal: </strong>{total}</Text>
                                        </Stack>
                                    </Flex>
                                    <Flex
                                        justify="center"
                                        pt="3vh"
                                    >
                                        <Button
                                            onClick={(e) => {
                                                if (!JSON.parse(localStorage.getItem("user")!).sendUser!.loginUser.address) {
                                                    localStorage.setItem("path", "/checkout")
                                                } else {
                                                    e.preventDefault();
                                                    navigate("/checkout")
                                                }
                                            }}
                                        >
                                            Place Order
                                        </Button>
                                    </Flex>
                                </Box>
                            </Flex>
                        </HStack>
                    </>
                )
            }
        </>
    )
}

export default ProductPage