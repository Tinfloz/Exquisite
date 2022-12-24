import React, { FC, useEffect } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Text, Spinner, VStack } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../typed.hooks/hooks';
import { getMyProductsByRatings, getMyProductsBySales, resetSeller, resetSellerHelpers } from '../reducers/seller.reducer/seller.slice';
import TopProductCard from '../components/TopProductCard';
import { ITopProducts } from '../interfaces/redux.interfaces/seller.slice.interface';


const TopProducts: FC = () => {
    return (
        <>
            <Tabs
                isLazy
                variant='enclosed'
            >
                <TabList>
                    <Tab>By Sales</Tab>
                    <Tab>By Ratings</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <TopProductsBySales />
                    </TabPanel>
                    <TabPanel>
                        <TopProductsByRatings />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    )
}

export default TopProducts;

const TopProductsBySales: FC = () => {

    const dispatch = useAppDispatch();
    const { productStack } = useAppSelector(state => state.sellers);
    console.log(productStack)

    useEffect(() => {
        (async () => {
            await dispatch(getMyProductsBySales());
            dispatch(resetSellerHelpers());
        })()
    }, [dispatch])

    useEffect(() => {
        return () => {
            dispatch(resetSeller())
        }
    }, [dispatch])

    const instanceOfITopProductsSales = (param: any): param is Array<ITopProducts> => {
        return param.length !== undefined && param[0].totalSale !== undefined
    }

    if (!productStack || ((param: any): (boolean | void) => {
        if (typeof param === "object") {
            if (param.length === 0) {
                return true
            }
            return false
        }
    })(productStack)) {
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
                p="5vh"
            >
                {
                    instanceOfITopProductsSales(productStack) ?
                        (
                            <>
                                <VStack>
                                    {
                                        productStack?.map(element => (
                                            <TopProductCard product={element} sales={true} />
                                        ))
                                    }
                                </VStack>
                            </>
                        ) : (
                            <>
                                <Text
                                    as="b"
                                    color="gray.300"
                                    fontSize="4vh"
                                >
                                    There has been an error loading this page!
                                </Text>
                            </>
                        )
                }
            </Flex>
        </>
    )
}

const TopProductsByRatings: FC = () => {

    const dispatch = useAppDispatch();
    const { productStack } = useAppSelector(state => state.sellers);

    useEffect(() => {
        (async () => {
            await dispatch(getMyProductsByRatings());
            dispatch(resetSellerHelpers());
        })()
    }, [dispatch])

    useEffect(() => {
        return () => {
            dispatch(resetSeller())
        }
    }, [dispatch])

    const instanceOfITopProductsRatings = (param: any): param is Array<ITopProducts> => {
        return param[0].total !== undefined
    }

    if (!productStack || ((param: any): (boolean | void) => {
        if (typeof param === "object") {
            if (param.length === 0) {
                return true
            }
            return false
        }
    })(productStack)) {
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
                p="10vh"
            >
                {
                    instanceOfITopProductsRatings(productStack) ?
                        (
                            <>
                                <VStack>
                                    {
                                        productStack?.map(element => (
                                            <TopProductCard product={element} sales={false} />
                                        ))
                                    }
                                </VStack>
                            </>
                        ) : (
                            <>
                                <Text
                                    as="b"
                                    color="gray.300"
                                    fontSize="4vh"
                                >
                                    There has been an error loading this page!
                                </Text>
                            </>
                        )
                }
            </Flex>
        </>
    )
}