import { Flex } from '@chakra-ui/react'
import React, { FC } from 'react';
import UserCreds from '../components/UserCreds';

const LoginClient: FC = () => {
    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="3vh"
            >
                <UserCreds first={false} seller={false} />
            </Flex>
        </>
    )
}

export default LoginClient