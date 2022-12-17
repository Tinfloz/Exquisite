import { Flex } from '@chakra-ui/react'
import React, { FC } from 'react'
import UserCreds from '../components/UserCreds'

const RegisterClient: FC = () => {
    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="3vh"
            >
                <UserCreds first={true} seller={false} />
            </Flex>
        </>
    )
}

export default RegisterClient