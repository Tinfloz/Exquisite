import React, { FC, useEffect, useState, useRef } from 'react';
import { IOrder, IOrderSingleItemParam } from '../interfaces/redux.interfaces/order.slice.interface';
import { initRazorpayOrder, orderCartItems, orderSingleItemById, resetOrderHelpers, verifyPayment } from '../reducers/order.reducer/order.slice';
import { useAppDispatch, useAppSelector } from "../typed.hooks/hooks";
import { Flex, Box, Text, Stack, HStack, Avatar, Spinner, VStack, Button } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.jpeg";

interface ICheckOutProps {
    cart: boolean
};

declare global {
    interface Window {
        Razorpay?: any;
    }
}

const CheckoutPage: FC<ICheckOutProps> = ({ cart }) => {

    const { order, razorpayResponse, isSuccess, isError } = useAppSelector(state => state.orders);
    const { user } = useAppSelector(state => state.auth);
    const [created, setCreated] = useState<boolean>(false);
    const firstRenderRef = useRef(true);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const instanceOfOrder = (param: any): param is IOrder => {
        return param.items !== undefined
    };

    let orderDetails = {}
    if (!cart) {
        Object.assign(orderDetails, {
            id: window.location.href.split("/").at(-2),
            quantity: {
                qty: Number(window.location.href.split("/").at(-1))
            }
        });
    };

    useEffect(() => {
        if (cart) {
            return
        };
        (async () => {
            if (((param: any): param is IOrderSingleItemParam => {
                let keyArr = Object.keys(orderDetails);
                return keyArr.length !== 0 && param.id !== undefined
            })(orderDetails)) {
                await dispatch(orderSingleItemById(orderDetails));
                dispatch(resetOrderHelpers());
            }
        })()
    }, [dispatch, JSON.stringify(orderDetails)])

    const loadScript = (src: string) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const paymentSuccessHandler = async (): Promise<any> => {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            console.log("Razorpay SDK failed to load. Are you online?");
            return;
        };
        const options = {
            key: "rzp_test_iERLWTclgpmLnx",
            amount: razorpayResponse.amount,
            currency: "INR",
            name: "Exquisite!",
            description: "Online Purchase",
            image: { logo },
            order_id: razorpayResponse.id,
            handler: async (response: any) => {
                const data = {
                    details: {
                        orderCreationId: razorpayResponse.id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature: response.razorpay_signature,
                    },
                    orderId: instanceOfOrder(order) ? order!._id : null
                };
                await dispatch(verifyPayment(data))
            },
            prefill: {
                name: user!.name,
                email: user!.email,
            },
            notes: {
                address: "Exquisite!",
            },
            theme: {
                color: "#000",
            },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        };
        if (isSuccess && created) {
            paymentSuccessHandler()
        };
        if (isError && created) {
            navigate("/home")
        };
        setCreated(false);
    }, [isSuccess, isError, navigate, created])

    useEffect(() => {
        if (!cart) {
            return
        }
        (async () => {
            await dispatch(orderCartItems());
            dispatch(resetOrderHelpers());
        })()
    }, [dispatch, JSON.stringify(user)])

    if (!order) {
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
                p="15vh"
            >
                <Box
                    h="50vh"
                    w="50vh"
                    borderWidth="1px"
                    borderColor="gray.300"
                    borderRadius="1vh"
                >
                    <Flex
                        justify="center"
                        p="2vh"
                    >
                        <Text
                            as="b"
                            fontSize="3vh"
                        >
                            Checkout
                        </Text>
                    </Flex>
                    <Flex
                        p="3vh"
                    >
                        <Stack
                            direction="column"
                            spacing="2vh"
                        >
                            {
                                instanceOfOrder(order) ? (
                                    <>
                                        {
                                            order?.items?.map(element => (
                                                <>
                                                    <VStack spacing="2.5vh">
                                                        <HStack spacing="2vh">
                                                            <Avatar
                                                                src={element.product.image}
                                                                name={element.product.item}
                                                                size="md"
                                                            />
                                                            <Text>{element.product.item}</Text>
                                                            <Text>${element.product.price.toFixed(2)}</Text>
                                                        </HStack>
                                                        <Text><strong>Shipping: </strong>${order?.shippingFee.toFixed(2)}</Text>
                                                        <Text><strong>Sales tax: </strong>${order?.salesTax.toFixed(2)}</Text>
                                                        <Text><strong>Subtotal: </strong>${order?.total.toFixed(2)}</Text>
                                                    </VStack>
                                                </>
                                            ))
                                        }
                                    </>
                                ) : (
                                    <>
                                        <Text
                                            as="b"
                                            fontSize="4vh"
                                            color="gray.300"
                                        >
                                            There was an error loading this page!
                                        </Text>
                                    </>
                                )
                            }

                        </Stack>
                    </Flex>
                    <Flex
                        justify='center'
                        pt="1vh"
                    >
                        <Button
                            onClick={
                                async () => {
                                    if (instanceOfOrder(order)) {
                                        await dispatch(initRazorpayOrder(order!._id));
                                    }
                                    setCreated(true)
                                }
                            }
                        >
                            Place Order
                        </Button>
                    </Flex>
                </Box>
            </Flex >
        </>
    )
}

export default CheckoutPage