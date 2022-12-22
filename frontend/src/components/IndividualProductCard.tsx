import React, { FC, useEffect, useState, useRef } from 'react'
import { IProduct } from '../interfaces/redux.interfaces/product.interfaces';
import {
    Card, CardHeader, CardBody, CardFooter, Button, Image, Text, Stack, Heading, Divider,
    ButtonGroup,
    HStack, Select
} from '@chakra-ui/react'
import { useAppDispatch } from '../typed.hooks/hooks';
import { addItemsToCartById, resetUserHelpers, updateItemQtyInCart } from '../reducers/auth.reducer/auth.slice';
import { useNavigate } from "react-router-dom";

interface ICardProp {
    cart: boolean,
    indProdPage: boolean,
    product: IProduct,
    cartId?: string
}

interface IQuantity {
    qty: number
}

const IndividualProductCard: FC<ICardProp> = ({ cart, product, indProdPage, cartId }) => {

    console.log("child reremders")

    let rows = [], i = 0, len = 10;
    while (++i <= len) rows.push(i);

    const navigate = useNavigate();

    const firstRenderRef = useRef(true)

    const [quantity, setQuantity] = useState<IQuantity>({
        qty: 1
    });


    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!indProdPage) {
            return
        } else {
            if (!cart) {
                return
            };
            if (firstRenderRef.current) {
                firstRenderRef.current = false;
                return
            };
            let updateDetails = {
                cartId,
                quantity,
            };
            (async () => {
                await dispatch(updateItemQtyInCart(updateDetails));
                dispatch(resetUserHelpers());
            })()
            console.log("child")
        }
    }, [JSON.stringify(quantity)])

    return (
        <>
            <Card maxW="md">
                <CardBody>
                    <Image
                        src={product.image}
                        alt={product.item}
                        borderRadius='lg'
                    />
                    <Stack mt='6' spacing='3'>
                        <Heading size='md'>{product.item}</Heading>
                        <Text>
                            {product.description}
                        </Text>
                        <Text color='blue.600' fontSize='2xl'>
                            ${product.price}
                        </Text>
                    </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                    {
                        !indProdPage ?
                            (
                                <ButtonGroup spacing='2'>
                                    <Button variant='solid' colorScheme='blue'
                                        onClick={() => {
                                            navigate(`/product/${product._id}`)
                                        }}
                                    >
                                        Buy now
                                    </Button>
                                    <Button variant='ghost' colorScheme='blue'
                                        onClick={async () => {
                                            await dispatch(addItemsToCartById(product._id));
                                            dispatch(resetUserHelpers());
                                        }}
                                    >
                                        Add to cart
                                    </Button>
                                </ButtonGroup>
                            ) :
                            (
                                cart ? (
                                    <>
                                        <Select variant='flushed' placeholder='Quantity' value={quantity.qty}
                                            onChange={(e) => setQuantity(prevState => ({
                                                ...prevState,
                                                qty: Number(e.target.value)
                                            }))}
                                        >
                                            {
                                                rows.map(element => (
                                                    <option value={element}>{element}</option>
                                                ))
                                            }
                                        </Select>
                                    </>
                                ) : (
                                    <>
                                        <HStack spacing="3vh">
                                            <Button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate(`/checkout/${product._id}/${quantity.qty}`)
                                                }}
                                            >
                                                Order
                                            </Button>
                                            <Select variant='flushed' placeholder='Quantity' value={quantity.qty}
                                                onChange={(e) => setQuantity(prevState => ({
                                                    ...prevState,
                                                    qty: Number(e.target.value)
                                                }))}
                                            >
                                                {
                                                    rows.map(element => (
                                                        <option value={element}>{element}</option>
                                                    ))
                                                }
                                            </Select>
                                        </HStack>
                                    </>
                                )
                            )
                    }
                </CardFooter>
            </Card>
        </>
    )
}

export default IndividualProductCard