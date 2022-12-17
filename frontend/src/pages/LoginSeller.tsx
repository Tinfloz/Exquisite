import { Flex } from '@chakra-ui/react'
import React, { FC } from 'react';
import UserCreds from '../components/UserCreds';

const LoginSeller: FC = () => {
    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="3vh"
            >
                <UserCreds first={false} seller={true} />
            </Flex>
        </>
    );
};

export default LoginSeller