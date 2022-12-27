import React, { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../typed.hooks/hooks';
import IndividualProductCard from '../components/IndividualProductCard';
import { Flex, Grid, GridItem, Spinner, Text, VStack } from '@chakra-ui/react';
import { IProduct } from '../interfaces/redux.interfaces/product.interfaces';
import { getAllHomeProducts, resetProductHelpers, resetProducts } from '../reducers/product.reducer/product.slice';
import SellerHomeCard from '../components/SellerHomeCard';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const HomePage: FC = () => {

    const { user } = useAppSelector(state => state.auth);

    const navigate = useNavigate();

    if (!user) {
        navigate("/")
    };

    if (user?.userType === "Seller") {
        return (
            <SellerHome />
        )
    }

    return (
        <BuyerHome />
    )
}

export default HomePage

const BuyerHome: FC = () => {

    const { product } = useAppSelector(state => state.products);
    const dispatch = useAppDispatch();

    const instanceOfProductArray = (productElement: any): productElement is Array<IProduct> => {
        return productElement.length !== undefined
    };

    useEffect(() => {
        (async () => {
            await dispatch(getAllHomeProducts());
            dispatch(resetProductHelpers());
        })()
    }, [dispatch])

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
            <Flex
                justify="center"
                p="10vh"
            >
                {
                    instanceOfProductArray(product) ? (
                        <>
                            {
                                product?.length > 0 ? (
                                    <Grid templateColumns='repeat(4, 1fr)' gap={5} p="10vh">
                                        {
                                            product?.map(prod => (
                                                <GridItem display="flex" justifyContent="center">
                                                    <IndividualProductCard product={prod} cart={false} indProdPage={false}
                                                        key={prod._id} />
                                                </GridItem>
                                            ))
                                        }
                                    </Grid>
                                ) : (
                                    <>
                                        <Text
                                            fontSize="4vh"
                                            color="gray.300"
                                        >There are no products to be displayed at this moment!</Text>
                                    </>
                                )
                            }
                        </>
                    ) :
                        (
                            <>
                                <Text
                                    fontSize="4vh"
                                    color="gray.300"
                                >There has been an error loading this page!</Text>
                            </>
                        )
                }
            </Flex>
            <footer
                id="footer"
            >
                <Footer />
            </footer>
        </>
    )
}

const SellerHome: FC = () => {
    return (
        <>
            <Flex
                justify="center"
                p="10vh"
            >
                <VStack>
                    <SellerHomeCard heading={"Upload a Product"} text={"Upload new products and sell them!"}
                        buttonText={"Upload"} nav={"/create/product"} />
                    <SellerHomeCard heading={"Check Orders"} text={"Check orders that are to be delivered"}
                        buttonText={"Go"} nav={"/my/orders"} />
                    <SellerHomeCard heading={"Change account info"} text={"Change address and other details"}
                        buttonText={"Go"} nav={"/change/details/user"} />
                </VStack>
            </Flex>
        </>
    )
}