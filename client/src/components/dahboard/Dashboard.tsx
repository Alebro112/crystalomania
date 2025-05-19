'use client'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import DashboardComponent from './DashboardComponent';
import { OverlayLoader } from '../ui/overlayLoader';
import { DCurrencyArraySchema, DCurrencyDTO } from '@/api/DTO/DB/DCurrency';

import * as generalAPI from "@/api/generalAPI"
import { DashboardProvider, useDasboard } from './DashboardContext';
import { connectSocket } from '@/api/socket';
import subscribeSocketEvent from '@/api/socket/subscribe';
import { set, z } from 'zod';
import { DTeamArraySchema } from '@/api/DTO/DB/DTeam';
import toast from 'react-hot-toast';

type LoadingState = {
    currencies: boolean,
    teams: boolean
}

const DashboardUpdateSchema = z.object({
    currencies: DCurrencyArraySchema,
    teams: DTeamArraySchema
})

const isLoading = (loading: LoadingState): boolean => {
    return loading.teams || loading.currencies
}

function DashboardNaked() {
    const [loading, setLoading] = useState<LoadingState>({ currencies: true, teams: true })
    const {
        setDashboardTeams,
        setDashboardCurrencies,
        updateDashboardCurrencies,
        updateDashboardTeams
    } = useDasboard()

    //fetch data socket.io
    useEffect(() => {
        const fetchCurrencies = async () => {
            const response = await generalAPI.fetchCurrencies()

            if (response.success) {
                setDashboardCurrencies(response.data)
                setLoading(prev => {
                    return { ...prev, currencies: false }
                })
                return
            }

            console.log('response', response)

            if (response.type === 'message') {
                toast.error(response.message)
            }
        }

        const fetchTeams = async () => {
            const response = await generalAPI.fetchTeams()

            if (response.success) {
                setDashboardTeams(response.data.sort((a, b) => b.balance - a.balance))
                setLoading(prev => {
                    return { ...prev, teams: false }
                })
                return
            }

            if (response.type === 'message') {
                toast.error(response.message)
            }
        }

        fetchTeams()
        fetchCurrencies()

        const socket = connectSocket()

        subscribeSocketEvent('dashboard:update', DashboardUpdateSchema, (data) => {
            updateDashboardCurrencies(data.currencies)
            updateDashboardTeams(data.teams)
        })
    }, [])


    return (
        <div>
            {isLoading(loading) && <OverlayLoader />}
            <DashboardComponent />
        </div>
    );
}

export default function Dashboard() {
    return (
        <DashboardProvider>
            <DashboardNaked />
        </DashboardProvider>
    )
}