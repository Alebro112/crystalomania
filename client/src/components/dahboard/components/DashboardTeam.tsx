import React, { useEffect, useRef, useState } from "react"
import { motion } from 'framer-motion'


import DashboardTeamPlace from "./DashboardTeamPlace"
import { DTeamDTO } from "@/api/DTO/DB/DTeam"
import padNumber from "@/func/padNumber"

export type Color = 'turmeric' | 'blackish-green' | 'claret' | 'royal-blue' | 'zhang-qinq'

const colors: Record<Color, string> = {
    turmeric: '#F5940F',
    'blackish-green': '#133E34',
    claret: '#611320',
    'royal-blue': '#1F0EBD',
    'zhang-qinq': '#161C40',
}
const getColor = (color: string) => {
    if (color in colors) {
        return colors[color as Color]
    }
    return colors['zhang-qinq']
}

function DashboardTeamBG() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                const height = entry.contentRect.height;
                setSize({ width, height });
            }
        });

        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full h-full" ref={containerRef}>
            <svg width={size.width} height={size.height} fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-10 -20H1180V197H-10V-20Z" fill="url(#paint0_linear_164_1514)" />
                <defs>
                    <linearGradient id="paint0_linear_164_1514" x1="-1048.5" y1="88" x2="1161.5" y2="95.5" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white" stopOpacity="0" />
                        <stop offset="1" stopOpacity="0.3" />
                    </linearGradient>
                </defs>
            </svg>

        </div>
    )
}

interface DashboardTeamProps {
    team: DTeamDTO
    place?: number
    type?: 'winner' | 'loser' | 'place'
}

export default function DashboardTeam({
    team,
    place = 1,
    type = 'place',
}: DashboardTeamProps) {
    const ref = useRef<HTMLDivElement>(null);
    const placeRef = useRef<HTMLDivElement>(null);
    const [contentPadding, setContentPadding] = useState(0)

    useEffect(() => {
        if (!placeRef) return;
        const container = placeRef.current;
        if (!container) return;

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                setContentPadding(width);
            }
        });

        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    return (
        <motion.div ref={ref} className="
            w-full
            h-full
            min-h-[120px]
            xl:min-h-[0px]
            flex-1


            rounded-xl
            shadow-md
            overflow-hidden
            relative
        " style={{ backgroundColor: getColor(team.color) }}
            layout 
            transition={{ duration: 1, type: 'spring' }}
        >
            <DashboardTeamBG />
            <DashboardTeamPlace containerRef={ref} place={place} type={type} ref={placeRef} />

            <div className={`
                absolute 
                top-0 
                left-0 
                w-full 
                h-full 
                z-10

                flex
                flex-col
                justify-center
                items-start
                pr-6
                xl:pr-8

                sm:flex-row
                sm:items-center
                sm:justify-between

                space-y-0
                xsm:space-y-1
            `} style={{
                    paddingLeft: `${contentPadding + 20}px`
                }}>
                <span className="text-white text-2xl xsm:text-3xl sm:text-4xl xl:text-5xl font-semibold sm:font-semibold">{team.title}</span>

                <span className="text-white text-2xl xsm:text-3xl sm:text-4xl xl:text-5xl font-light sm:font-semibold">{padNumber(team.balance, 6)}</span>
            </div>
        </motion.div>
    )
}