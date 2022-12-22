import React, { FC } from 'react';
import { Card, CardHeader, CardBody, Text, CardFooter, Button, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface ISellerCard {
    heading: string,
    text: string,
    buttonText: string,
    nav: string
}

const SellerHomeCard: FC<ISellerCard> = ({ heading, text, buttonText, nav }) => {

    const navigate = useNavigate();

    return (
        <>
            <Card align='center'
                w="50vh"
            >
                <CardHeader>
                    <Heading size='md'>{heading}</Heading>
                </CardHeader>
                <CardBody>
                    <Text>{text}</Text>
                </CardBody>
                <CardFooter>
                    <Button colorScheme='blue'
                        onClick={
                            () => navigate(nav)
                        }
                    >{buttonText}</Button>
                </CardFooter>
            </Card>
        </>
    );
};

export default SellerHomeCard;