import React, { FC, MutableRefObject, useRef } from 'react';
import {
    Flex, IconButton, Drawer, DrawerBody, DrawerCloseButton, DrawerOverlay, DrawerContent,
    DrawerFooter, useDisclosure, DrawerHeader, Text, Button, VStack
} from "@chakra-ui/react"
import { RiAccountPinCircleLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

const Footer: FC = () => {

    const { isOpen, onClose, onOpen } = useDisclosure();
    const btnRef = useRef() as MutableRefObject<HTMLButtonElement>
    const navigate = useNavigate();

    return (
        <>
            <Flex
                bg="green.800"
                h="10vh"
                alignItems="center"
                justify="flex-end"
                p="2vh"
            >
                <IconButton
                    aria-label='menu'
                    icon={<RiAccountPinCircleLine size="md" color='white' />}
                    bg="green.800"
                    _hover={{ bg: "green.800" }}
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
                        <DrawerHeader>Menu</DrawerHeader>
                        <DrawerBody>
                            <VStack spacing="2vh">
                                <Text
                                    as="button"
                                    onClick={() => navigate("/get/all/orders")}
                                >
                                    Go to my orders
                                </Text>
                                <Text
                                    as="button"
                                    onClick={() => navigate("/set/address/client")}
                                >
                                    Change address
                                </Text>
                                <Text
                                    as="button"
                                    onClick={() => navigate("/change/details/user")}
                                >
                                    Change account details
                                </Text>
                            </VStack>
                        </DrawerBody>
                        <DrawerFooter>
                            <Button variant='outline' mr={3} onClick={onClose}>
                                Cancel
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Flex>
        </>
    )
}

export default Footer