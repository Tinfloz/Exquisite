import { Flex, HStack, Spinner, Text, Box } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import IndividualProductCard from '../components/IndividualProductCard';
import { ICartElement } from '../interfaces/redux.interfaces/auth.slice.interface';
import { IProduct } from '../interfaces/redux.interfaces/product.interfaces';
import { getAllUserItemsCart } from '../reducers/product.reducer/product.slice';
import { useAppDispatch, useAppSelector } from '../typed.hooks/hooks'

const Test = () => {

    const dispatch = useAppDispatch();
    const { product } = useAppSelector(state => state.products);
    const { user } = useAppSelector(state => state.auth)
    const [total, setTotal] = useState<number>(0);

    const instanceOfCartElement = (param: any): param is Array<ICartElement> => {
        return param[0].product !== undefined;
    };

    useEffect(() => {
        console.log("hello user")
    }, [JSON.stringify(user)])

    useEffect(() => {
        console.log("hello forst ue")
        dispatch(getAllUserItemsCart())
    }, [])
    console.log("hello 1")
    useEffect(() => {
        if (!product) {
            console.log("runnung ")
            return
        }
        console.log("hello seci=ond ue")
        setTotal(((): number => {
            if (instanceOfCartElement(product)) {
                let sum: number = 0
                for (let element of product) {
                    sum += (element.product.price * element.qty)
                }
                return sum
            }
            return 0
        })())
    }, [JSON.stringify(product)])
    console.log("hello f2")


    if (!product) {
        return (
            <Spinner />
        )
    }

    return (
        <>
            <HStack>
                <Flex
                    h="100vh"
                    w="60%"
                    bg="white"
                    p="3vh"
                >
                    {
                        instanceOfCartElement(product) ?
                            <IndividualProductCard cart={true} indProdPage={true} product={product[0].product} /> : <Text>Hello</Text>
                    }
                </Flex>
                <Flex
                    h="100vh"
                    w="40%"
                    bg="red"
                    justify="center"
                    alignItems="center"
                >
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >

                        <Text>{total}</Text>
                    </Box>
                </Flex>
            </HStack>
        </>
    )
}

export default Test