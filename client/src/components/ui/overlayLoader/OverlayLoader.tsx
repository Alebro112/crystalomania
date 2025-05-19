"use client"


import useMediaQuery from "@/hooks/useMediaQuery"
import "./overlayLoader.css"

interface OverlayLoaderProps {
    className?: string
}

export default function OverlayLoader({
    className
}: OverlayLoaderProps) {
    return (
        <div style={{zIndex: 600}} className={`absolute top-0 left-0 right-0 bottom-0 w-full h-full overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center ${className}`}>
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
            <h2 className="text-center text-white text-xl font-semibold">Загрузка...</h2>
            <p className="w-1/2 text-center text-white mt-2">Это может занять некоторое время.</p>
        </div>
    )
}