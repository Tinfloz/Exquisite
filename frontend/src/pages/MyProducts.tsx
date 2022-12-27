import React, { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../typed.hooks/hooks';
import { useNavigate } from "react-router-dom";
import {
    Table,
    Thead,
    Tbody,
    Th,
    Tr,
    Td,
    TableCaption,
    TableContainer,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Flex,
    Text
} from '@chakra-ui/react'
import { IProduct } from '../interfaces/redux.interfaces/product.interfaces';
import { deleteProductsSeller, resetUserHelpers } from '../reducers/auth.reducer/auth.slice';

const MyProducts: FC = () => {

    console.log("rerender my ptoducts")
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!user) {
        navigate("/login/vendor");
    };

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                pt="10vh"
            >
                {
                    JSON.parse(localStorage.getItem("user")!).sendUser!.loginUser!.products.length === 0 ? (
                        <Text
                            as="b"
                            fontSize="5vh"
                            color="gray.300"
                        >
                            There are no products
                        </Text>
                    ) : (
                        <TableContainer>
                            <Table
                                size="lg"
                                variant="striped"
                            >
                                <TableCaption>My Products</TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th>Product Id</Th>
                                        <Th>Item</Th>
                                        <Th>Stock</Th>
                                        <Th>Price</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        JSON.parse(localStorage.getItem("user")!).sendUser!.loginUser!.products.map((element: IProduct) => (
                                            <Tr key={element._id}>
                                                <Td key={element._id}>{element._id}</Td>
                                                <Td key={element._id}>{element.item}</Td>
                                                <Td key={element._id}>{element.stock}</Td>
                                                <Td key={element._id}>{element.price}</Td>
                                                <Td as="button"
                                                    onClick={onOpen}
                                                    key={element._id}
                                                >
                                                    Update
                                                </Td>
                                                <Modal isOpen={isOpen} onClose={onClose}>
                                                    <ModalOverlay />
                                                    <ModalContent>
                                                        <ModalHeader>{`Update ${element.item}`}</ModalHeader>
                                                        <ModalCloseButton />
                                                        <ModalBody>
                                                            {`Do you want to delete this product ${element.item} or update it?`}
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            <Button colorScheme='blue' mr={3}
                                                                onClick={() => {
                                                                    navigate(`/update/stock/${element!._id}`);
                                                                    onClose();
                                                                }}
                                                            >
                                                                Update
                                                            </Button>
                                                            <Button variant='ghost'
                                                                onClick={async () => {
                                                                    await dispatch(deleteProductsSeller(element._id));
                                                                    dispatch(resetUserHelpers());
                                                                    onClose();
                                                                }}
                                                            >Delete</Button>
                                                        </ModalFooter>
                                                    </ModalContent>
                                                </Modal>
                                            </Tr>
                                        ))
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>
                    )
                }
            </Flex>
        </>
    )
}

export default MyProducts