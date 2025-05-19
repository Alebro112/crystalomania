'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardCurrency from './components/DashboardCurrency';

import { Roboto } from 'next/font/google'
import { DCurrencyDTO } from '@/api/DTO/DB/DCurrency';
import { useDasboard } from './DashboardContext';
import DashboardTeam from './components/DashboardTeam';
import { DTeamDTO } from '@/api/DTO/DB/DTeam';

const roboto = Roboto({
    subsets: ["cyrillic", "latin"],
})

interface DashboardComponentProps {

}

export default function DashboardComponent({

}: DashboardComponentProps) {
    const {
        currencies,
        teams
    } = useDasboard()

    return (
        <div className={`grid grid-cols-1 xl:grid-cols-5 w-full h-full gap-y-6 gap-x-4 ${roboto.className}`}>
            <div className="
                        col-span-1 
                        xl:col-span-2
                        grid grid-cols-2
                        xs:grid-cols-1
                        md:grid-cols-3
                        lg:grid-cols-4
                        xl:grid-cols-2
        
                        gap-4
        
                        h-full
                        w-full
                    "
            >
                {currencies.map((currency) => (
                    <DashboardCurrency key={`currency-${currency.id}`} currency={currency} />
                ))}
            </div>

            <motion.div className="
                col-span-1 
                xl:col-span-3

                h-full
                w-full
                flex
                flex-col

                space-y-4
            ">
                <AnimatePresence>
                    {teams.map((team, index) => (
                        <DashboardTeam
                            key={`team-${team.id}`}
                            team={team}
                            place={index + 1}
                            type={index === 0 ? 'winner' : index === teams.length - 1 ? 'loser' : 'place'}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}