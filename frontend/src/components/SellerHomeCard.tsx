import React, { FC } from 'react';
import { Card, CardHeader, CardBody, Text, CardFooter, Button, Heading } from "@chakra-ui/react";

interface ISellerCard {
    heading: string,
    text: string,
    buttonText: string
}

const SellerHomeCard: FC<ISellerCard> = ({ heading, text, buttonText }) => {
    return (
        <>
            <Card align='center'>
                <CardHeader>
                    <Heading size='md'>{heading}</Heading>
                </CardHeader>
                <CardBody>
                    <Text>{text}</Text>
                </CardBody>
                <CardFooter>
                    <Button colorScheme='blue'>{buttonText}</Button>
                </CardFooter>
            </Card>
        </>
    );
};

export default SellerHomeCard;