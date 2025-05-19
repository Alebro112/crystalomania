import React from 'react'
import { DashboardCurrencyBG } from './DashboardCurrencyBG'
import { DCurrencyDTO } from '@/api/DTO/DB/DCurrency';

export type Color = 'red' | 'yellow' | 'green' | 'purple' | 'blue' | 'orange';

interface DashboardCurrencyProps {
    currency: DCurrencyDTO;
}

export default function DashboardCurrency({
    currency
}: DashboardCurrencyProps) {
    return (
        <div className="
            aspect-square 
            bg-white 
            shadow-md 
            rounded-xl

            relative
            overflow-hidden
        ">
            <div className="
                absolute 
                top-0 
                left-0 
                w-full 
                h-full

                pt-1
                pb-1
                xsm:pb-2
                sm:pt-2
                sm:pb-4

                flex
                flex-col
                justify-between
                items-center

                z-10
            ">
                <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
                    <img
                        alt={`${currency.name} gem`}
                        src={`/images/gems/${currency.name}.png`}
                        className="
                        max-w-full 
                        max-h-full 
                        object-contain
                        scale-120
                        translate-y-[0%]
                    "
                        loading="lazy"
                    />
                </div>

                <span className={`text-2xl 3xsm:text-3xl 2xsm:text-3xl xsm:text-4xl sm:text-5xl lg:text-4xl xl:text-5xl font-black `}>
                    x{(currency.baseValue * currency.rate).toFixed(2)}
                </span>

            </div>

            <DashboardCurrencyBG color={currency.name as any} />
        </div>
    )
}