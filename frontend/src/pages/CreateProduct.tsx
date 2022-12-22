import { Box, Flex, VStack, Text, Input, Button, useToast } from '@chakra-ui/react';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from "../typed.hooks/hooks"
import { ISellerCreateProductParam } from '../interfaces/redux.interfaces/seller.slice.interface';
import { createSellerNewProducts, resetUserHelpers } from '../reducers/auth.reducer/auth.slice';

const CreateProduct: FC = () => {

    const dispatch = useAppDispatch();
    const toast = useToast();

    const { isSuccess, isError } = useAppSelector(state => state.auth);


    const [product, setProduct] = useState<ISellerCreateProductParam>({
        item: "",
        image: "",
        description: "",
        price: "",
        stock: ""
    });

    const handleChangeProduct = (e: ChangeEvent<HTMLInputElement>) => {
        setProduct(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    useEffect(() => {
        if (!isSuccess && !isError) {
            return
        } else if (isSuccess) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: "Product created!",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        } else if (isError) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: "Product could not be created!",
                status: "warning",
                duration: 5000,
                isClosable: true,
            })
        };
        dispatch(resetUserHelpers())
    }, [isSuccess, isError, dispatch, toast])

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
                    borderColor="gray.300"
                    borderRadius="1vh"
                >
                    <Flex
                        justify="center"
                        alignItems="center"
                        p="2vh"
                    >
                        <VStack>
                            <Text
                                as="b"
                                fontSize="3vh"
                            >
                                Upload a product
                            </Text>
                            <Input
                                placeholder="item..."
                                value={product.item}
                                name="item"
                                onChange={handleChangeProduct}
                            />
                            <Input
                                placeholder="description..."
                                value={product.description}
                                name="description"
                                onChange={handleChangeProduct}
                            />
                            <Input
                                placeholder="image..."
                                value={product.image}
                                name="image"
                                onChange={handleChangeProduct}
                            />
                            <Input
                                placeholder="stock..."
                                value={product.stock}
                                name="stock"
                                onChange={handleChangeProduct}
                            />
                            <Input
                                placeholder="price..."
                                value={product.price}
                                name="price"
                                onChange={handleChangeProduct}
                            />
                            <Button
                                onClick={async () => {
                                    await dispatch(createSellerNewProducts(product));
                                    setProduct(prevState => ({
                                        ...prevState,
                                        item: "",
                                        image: "",
                                        description: "",
                                        price: "",
                                        stock: ""
                                    }))
                                }}
                            >
                                Upload
                            </Button>
                        </VStack>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}

export default CreateProduct