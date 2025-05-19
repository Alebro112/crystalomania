import useMediaQuery from "@/hooks/useMediaQuery";
import React, { useEffect } from "react"

interface IconProps {
    width: number;
    height: number;
}

function WinnerMedal({
    width,
    height
}: IconProps) {
    return (
        <svg width={width} height={height} viewBox={`0 0 44 70`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M33.3274 37.8492L38.1756 65.1333C38.2299 65.4546 38.1848 65.7848 38.0464 66.0797C37.9079 66.3747 37.6828 66.6204 37.4009 66.7839C37.1191 66.9474 36.7941 67.021 36.4693 66.9948C36.1445 66.9686 35.8355 66.8439 35.5835 66.6373L24.1271 58.0386C23.5741 57.6255 22.9022 57.4022 22.2118 57.4022C21.5215 57.4022 20.8496 57.6255 20.2966 58.0386L8.821 66.6341C8.56921 66.8403 8.26054 66.9649 7.93615 66.9911C7.61177 67.0173 7.2871 66.944 7.00546 66.7809C6.72382 66.6178 6.4986 66.3728 6.35985 66.0784C6.22111 65.784 6.17543 65.4543 6.22891 65.1333L11.0739 37.8492" stroke="url(#paint0_linear_169_348)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22.2006 41.4013C32.8049 41.4013 41.4013 32.8049 41.4013 22.2006C41.4013 11.5964 32.8049 3 22.2006 3C11.5964 3 3 11.5964 3 22.2006C3 32.8049 11.5964 41.4013 22.2006 41.4013Z" stroke="url(#paint1_linear_169_348)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
                <linearGradient id="paint0_linear_169_348" x1="6.20715" y1="41.0899" x2="38.198" y2="63.7593" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F6D365" />
                    <stop offset="1" stopColor="#FDA085" />
                </linearGradient>
                <linearGradient id="paint1_linear_169_348" x1="4.04633" y1="3" x2="40.355" y2="41.4013" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F6D365" />
                    <stop offset="1" stopColor="#FDA085" />
                </linearGradient>
            </defs>
        </svg>
    )
}

function PlaceBG({
    width,
    height
}: IconProps) {
    return (
        <svg width={width} height={height} viewBox={`0 0 105 187`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="-280" cy="93.5" rx="385" ry="395.5" fill="white" />
        </svg>
    )
}

interface DashboardCurrencyBGProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
    place?: number
    type?: 'winner' | 'loser' | 'place',
    ref?: React.Ref<HTMLDivElement>
}

export default function DashboardTeamPlace({
    containerRef,
    place = 1,
    type = 'place',
    ref,
}: DashboardCurrencyBGProps) {
    const [size, setSize] = React.useState<{ width: number; height: number }>({ width: 0, height: 0 });

    const isXL = useMediaQuery('(min-width: 1280px)'); // 💡 следим за шириной


    useEffect(() => {
        if (!containerRef) return;
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const height = entry.contentRect.height;


                let aspectRatio = 105 / 187

                const width = height * aspectRatio;
                setSize({ width, height });
            }
        });

        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="absolute top-0 left-0" ref={ref}>
            <PlaceBG width={size.width} height={size.height} />

            <span className={`
                absolute
                top-1/2
                left-1/2
                transform
                -translate-x-1/2
                -translate-y-1/2
                text-5xl
                xl:text-6xl
                xl:font-medium

                ${type === 'place' && 'text-green-500'}
                ${type === 'loser' && 'text-red-500'}
            `}>
                {type === 'winner' ? <WinnerMedal width={isXL ? 40 : 36} height={120}/> : place}
            </span>
        </div>
    );
}