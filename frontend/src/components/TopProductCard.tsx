import React, { FC } from 'react'
import { ITopProducts } from '../interfaces/redux.interfaces/seller.slice.interface';
import { Card, CardBody, Image, Stack, Text, Heading } from '@chakra-ui/react'

interface ITopProductProp {
    product: ITopProducts,
    sales: boolean
}

const TopProductCard: FC<ITopProductProp> = ({ product, sales }) => {
    return (
        <>
            <Card
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                variant='outline'
                w="70vh"
            >
                <Image
                    objectFit='cover'
                    maxW={{ base: '100%', sm: '200px' }}
                    src={product.image}
                    alt={product.item}
                />

                <Stack>
                    <CardBody>
                        <Heading size='md'>{product.item}</Heading>
                        <Text py='2'>
                            {sales ? `${product.totalSales}` : `${product.total}`}
                        </Text>
                    </CardBody>
                </Stack>
            </Card>
        </>

    )
}

export default TopProductCard