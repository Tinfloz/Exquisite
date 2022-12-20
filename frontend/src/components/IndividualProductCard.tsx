import React, { FC, useState } from 'react'
import { IProduct } from '../interfaces/redux.interfaces/product.interfaces';
import {
    Card, CardHeader, CardBody, CardFooter, Button, Image, Text, Stack, Heading, Divider,
    ButtonGroup,
    HStack, Select
} from '@chakra-ui/react'
import { useAppDispatch } from '../typed.hooks/hooks';
import { addItemsToCartById, resetUserHelpers } from '../reducers/auth.reducer/auth.slice';

interface ICardProp {
    cart: boolean,
    indProdPage: boolean,
    product: IProduct
}

interface IQuantity {
    qty: number
}

const IndividualProductCard: FC<ICardProp> = ({ cart, product, indProdPage }) => {

    let rows = [], i = 0, len = 10;
    while (++i <= len) rows.push(i);

    const [quantity, setQuantity] = useState<IQuantity>({
        qty: 1
    })

    const dispatch = useAppDispatch();

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
                            $450
                        </Text>
                    </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                    {
                        !indProdPage ?
                            (
                                <ButtonGroup spacing='2'>
                                    <Button variant='solid' colorScheme='blue'>
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
                                        <HStack>
                                            <Button colorScheme="blue.300">
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