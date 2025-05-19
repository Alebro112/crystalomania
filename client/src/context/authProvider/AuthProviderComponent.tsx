'use client'
import React, { useLayoutEffect } from 'react'

import { useUserStore } from '@/store'

export const AuthProviderComponent = () => {
    const userState = useUserStore((state) => state)

    useLayoutEffect(() => {
        const fetchUser = async () => {
            await userState.fetchUser()
        }

        fetchUser()
    }, [])

    

    return (
        <>
           
        </>
    )
}
