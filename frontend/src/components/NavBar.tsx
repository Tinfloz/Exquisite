import React, { FC, MutableRefObject, useRef, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Image,
    Input,
    Text,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    VStack, Avatar, useToast
} from '@chakra-ui/react';
import { ICartElement, ISendUser } from '../interfaces/redux.interfaces/auth.slice.interface';
import logo from "../assets/logo.jpeg"
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineDelete } from "react-icons/ai";
import { RiAccountCircleLine } from "react-icons/ri"
import { useNavigate, Link } from "react-router-dom";
import { clearUserCart, deleteIndividualItemsById, logout, reset, resetUserHelpers } from "../reducers/auth.reducer/auth.slice";
import { useAppDispatch, useAppSelector } from "../typed.hooks/hooks";


interface INavBarProp {
    userProp: ISendUser | null
}

const NavBar: FC<INavBarProp> = ({ userProp }) => {

    const [cleared, setCleared] = useState<boolean>(false)
    const [toLogout, setToLogout] = useState<boolean>(false)
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef() as MutableRefObject<HTMLButtonElement>
    const dispatch = useAppDispatch();
    const toast = useToast();
    const { isSuccess, isError } = useAppSelector(state => state.auth);


    useEffect(() => {
        if (!isSuccess && !isError) {
            return
        } else if (isSuccess && cleared) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: "Cart cleared!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } else if (isError && cleared) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: "Cart cleared!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        }
        setCleared(false)
        dispatch(resetUserHelpers())
    }, [isSuccess, isError, toast, dispatch, cleared])


    useEffect(() => {
        if (!toLogout) {
            return
        }
        toast({
            position: "bottom-left",
            title: "Success",
            description: "User logged out!",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
        setToLogout(false)
    }, [toLogout, toast])

    return (
        <>
            <Flex
                bg="green.800"
            >
                <HStack spacing={userProp ? (userProp.userType === "Buyer" ? "10vh" : "145vh") : ("145vh")}>
                    <Link to={!userProp ? "/" : "/home"}>
                        <Image
                            src={logo}
                            alt="logo"
                            borderRadius="12px"
                            width="4rem"
                            height="4rem"
                            ml="0.4rem"
                            mb="0.4rem"
                            mt="0.4rem"
                        />
                    </Link>
                    {
                        !userProp ? (
                            <>
                                <HStack>
                                    <Box>
                                        <Button
                                            disabled={window.location.href === "http://localhost:3000/" ? true : false}
                                            onClick={() => {
                                                const type: string = localStorage.getItem("type")!;
                                                if (type === "Client") {
                                                    navigate("/register/client")
                                                } else {
                                                    navigate("/register/vendor")
                                                }
                                            }}
                                        >Register</Button>
                                    </Box>
                                    <Box>
                                        <Button
                                            disabled={window.location.href === "http://localhost:3000/" ? true : false}
                                            onClick={() => {
                                                const type: string = localStorage.getItem("type")!;
                                                if (type === "Client") {
                                                    navigate("/login/client")
                                                } else {
                                                    navigate("/login/vendor")
                                                }
                                            }}
                                        >Login</Button>
                                    </Box>
                                </HStack>
                            </>
                        ) : (
                            <>
                                {
                                    userProp?.userType === "Buyer" ? (
                                        <>
                                            <HStack spacing="83vh">
                                                <HStack>
                                                    <Input placeholder="Search..." bg="gray.300" />
                                                    <IconButton
                                                        aria-label='Search'
                                                        icon={<AiOutlineSearch style={{ color: "white" }} />}
                                                        bg="green.800"
                                                        _hover={{ color: "green.800" }}
                                                    />
                                                </HStack>
                                                <HStack spacing="3vh">
                                                    <Text color="white">{`Welcome back, ${userProp?.name}!`}</Text>
                                                    <Box>
                                                        <Button
                                                            onClick={() => {
                                                                dispatch(logout());
                                                                dispatch(reset());
                                                                setToLogout(true);
                                                                navigate("/");
                                                            }}
                                                        >Logout</Button>
                                                    </Box>
                                                    <HStack>
                                                        <IconButton
                                                            aria-label='cart'
                                                            icon={<AiOutlineShoppingCart />}
                                                            ref={btnRef}
                                                            onClick={onOpen}
                                                        />
                                                        <Drawer
                                                            isOpen={isOpen}
                                                            placement='right'
                                                            onClose={onClose}
                                                            finalFocusRef={btnRef}
                                                        >
                                                            <DrawerOverlay />
                                                            <DrawerContent>
                                                                <DrawerCloseButton />
                                                                <DrawerHeader>Your cart</DrawerHeader>
                                                                <DrawerBody>
                                                                    <VStack>
                                                                        {
                                                                            userProp?.loginUser?.cart?.length === 0 ?
                                                                                (
                                                                                    <Text>You have no items in your cart!</Text>
                                                                                )
                                                                                :
                                                                                (
                                                                                    userProp?.loginUser?.cart?.map((element: ICartElement) => (
                                                                                        <HStack spacing="2vh">
                                                                                            <Avatar
                                                                                                src={element?.product?.image}
                                                                                                name={element?.product?.item}
                                                                                                size="md"
                                                                                                key={element._id}
                                                                                            />
                                                                                            <Text key={element._id}>{element?.product?.item}</Text>
                                                                                            <IconButton
                                                                                                aria-label='delete'
                                                                                                icon={<AiOutlineDelete />}
                                                                                                bg="white"
                                                                                                key={element._id}
                                                                                                onClick={async () => {
                                                                                                    await dispatch(deleteIndividualItemsById(element._id));
                                                                                                    dispatch(resetUserHelpers())
                                                                                                }}
                                                                                            />
                                                                                        </HStack>
                                                                                    ))

                                                                                )
                                                                        }
                                                                    </VStack>
                                                                </DrawerBody>
                                                                <DrawerFooter>
                                                                    <HStack spacing="1.5vh">
                                                                        <Button variant='outline' mr="3"
                                                                            disabled={userProp?.loginUser?.cart?.length === 0 ? true : false}
                                                                            onClick={async () => {
                                                                                setCleared(true)
                                                                                await dispatch(clearUserCart())
                                                                            }}
                                                                        >
                                                                            Clear cart
                                                                        </Button>
                                                                        <Button disabled={userProp?.loginUser?.cart?.length === 0 ? true : false} bg="purple.300"
                                                                            onClick={() => navigate(
                                                                                "/cart/page"
                                                                            )}
                                                                        >
                                                                            Go to cart
                                                                        </Button>
                                                                    </HStack>
                                                                </DrawerFooter>
                                                            </DrawerContent>
                                                        </Drawer>
                                                        <Text as="b" color="white" fontSize="3vh">{userProp?.loginUser?.cart?.length}</Text>
                                                    </HStack>
                                                </HStack>
                                            </HStack>
                                        </>
                                    ) :
                                        (
                                            <>
                                                <HStack>
                                                    <Box>
                                                        <Button
                                                            onClick={() => {
                                                                dispatch(logout());
                                                                dispatch(reset());
                                                                setToLogout(true);
                                                                navigate("/");
                                                            }}
                                                        >
                                                            Logout
                                                        </Button>
                                                    </Box>
                                                    <IconButton
                                                        aria-label="Account"
                                                        icon={<RiAccountCircleLine size="s" color=" white" />}
                                                        bg="green.800"
                                                        _hover={{ bg: "green.800" }}
                                                        onClick={onOpen}
                                                    />
                                                    <Drawer
                                                        isOpen={isOpen}
                                                        placement='right'
                                                        onClose={onClose}
                                                        finalFocusRef={btnRef}
                                                    >
                                                        <DrawerContent>
                                                            <DrawerCloseButton />
                                                            <DrawerHeader>Menu</DrawerHeader>
                                                            <DrawerBody>
                                                                <Text
                                                                    as="button"
                                                                    onClick={() => navigate("/my/products")}
                                                                >
                                                                    My Products
                                                                </Text>
                                                            </DrawerBody>
                                                            <DrawerFooter>
                                                                <Button variant='outline' mr={3} onClick={onClose}>
                                                                    Cancel
                                                                </Button>
                                                            </DrawerFooter>
                                                        </DrawerContent>
                                                    </Drawer>
                                                </HStack>
                                            </>
                                        )
                                }
                            </>
                        )
                    }
                </HStack>
            </Flex>
        </>
    )
}

export default NavBar