import React, { useEffect, useId, useRef, useState } from 'react';
import { Color } from './DashboardCurrency';

interface DashboardCurrencyBGProps {
    color?: Color
    className?: string
    props?: any
}


const colors: {
    [key in Color]: {
        startColor: string;
        endColor: string;
    };
} = {
    red: { startColor: '#AE1C1C', endColor: '#480C0C' },
    yellow: { startColor: '#FEE11F', endColor: '#B58001' },
    green: { startColor: '#13933F', endColor: '#013D19' },
    purple: { startColor: '#813F9C', endColor: '#230D3E' },
    blue: { startColor: '#381BDB', endColor: '#291884' },
    orange: { startColor: '#FEBE00', endColor: '#B58001' },
}


export function DashboardCurrencyBG({
    color = 'red',
    className,
    ...props
}: DashboardCurrencyBGProps) {
    const id = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                const screenWidth = window.innerWidth;

                let aspectRatio;
                if (screenWidth < 300) {
                    aspectRatio = 230 / 326;
                } else if (screenWidth < 1500) {
                    aspectRatio = 245 / 326;
                } else {
                    aspectRatio = 255 / 326;
                }


                const height = width * aspectRatio;
                setSize({ width, height });
            }
        });

        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className={`absolute top-0 left-0 w-full h-full ${className}`}
            {...props}
        >
            <svg width={size.width} height={size.height} viewBox="0 0 326 266" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_169_337)">
                    <ellipse cx="123.5" cy="43" rx="252.5" ry="213" fill={`url(#${id})`} />
                </g>
                <defs>
                    <linearGradient id={id} x1="-25.9474" y1="-170" x2="252.667" y2="268.875" gradientUnits="userSpaceOnUse">
                        <stop stopColor={colors[color].startColor} />
                        <stop offset="1" stopColor={colors[color].endColor} />
                    </linearGradient>
                </defs>
            </svg>

        </div>
    );
}