import React, { FC, useState } from 'react';
import { Box, Button, Flex, Input, Text, VStack } from '@chakra-ui/react';
import { IStockParam } from '../interfaces/redux.interfaces/seller.slice.interface';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../typed.hooks/hooks';
import { stockUpdateSeller, resetSellerHelpers } from '../reducers/seller.reducer/seller.slice';

const UpdateStock: FC = () => {

    const [stock, setStock] = useState<IStockParam>({
        stock: ""
    });

    const { productId } = useParams();
    const dispatch = useAppDispatch();

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
                        p="3vh"
                    >
                        <VStack>
                            <Text
                                as="b"
                                fontSize="2.5vh"
                            >
                                Change Stock
                            </Text>
                            <Input placeholder="stock..." value={stock.stock} onChange={(e) => setStock(prevState => ({
                                ...prevState,
                                stock: e.target.value
                            }))} />
                            <Button
                                onClick={async () => {
                                    let stockDetails = {
                                        productId: productId!,
                                        quantity: stock
                                    };
                                    await dispatch(stockUpdateSeller(stockDetails));
                                    dispatch(resetSellerHelpers());
                                    setStock(prevState => ({
                                        ...prevState,
                                        stock: ""
                                    }))
                                }}
                            >
                                Update
                            </Button>
                        </VStack>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}

export default UpdateStock