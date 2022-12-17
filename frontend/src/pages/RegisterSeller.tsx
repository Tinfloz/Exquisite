import { Flex } from '@chakra-ui/react'
import React from 'react'
import UserCreds from '../components/UserCreds'

const RegisterSeller = () => {
    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="3vh"
            >
                <UserCreds first={true} seller={true} />
            </Flex>
        </>
    )
}

export default RegisterSeller