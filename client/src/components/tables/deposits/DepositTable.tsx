'use client'
import { DDepositDTO } from '@/api/DTO/DB/DDeposit'
import React, { use, useEffect, useState } from 'react'
import DepositsTableComponent from './DepositsTableComponent'
import { OverlayLoader } from '@/components/ui/overlayLoader'
import * as generalAPI from "@/api/generalAPI"
import toast from 'react-hot-toast'

interface DepositTableProps {
    
}

export default function DepositsTable({

}: DepositTableProps) {
    const [deposits, setDeposits] = useState<DDepositDTO[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchDeposits = async () => {
            const response = await generalAPI.fetchDeposits()

            if (response.success) {
                setDeposits(response.data)
                setLoading(false)
                return
            }

            if (response.type === 'message') {
                toast.error(response.message)
                return
            }

            toast.error('Произошла ошибка')
        }

        fetchDeposits()
        const interval = setInterval(fetchDeposits, 30000)

        return () => clearInterval(interval)
    }, [])

    return (
        <>
            {loading && <OverlayLoader />}
            <DepositsTableComponent deposits={deposits} />
        </>
    )
}