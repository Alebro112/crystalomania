import { Nunito } from 'next/font/google';
import './globals.css';

import { Toaster } from 'react-hot-toast';


import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useLayoutEffect } from 'react';
import { AuthProvider } from '@/context/authProvider/AuthProvider';

const font = Nunito({
    subsets: ["cyrillic", "latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${font.className} dark:bg-gray-900`}>
                <ThemeProvider>
                    <AuthProvider>
                        <SidebarProvider>{children}</SidebarProvider>
                    </AuthProvider>
                    <Toaster toastOptions={{
                        duration: 5000,
                        position: "bottom-center",

                    }} />
                </ThemeProvider>
            </body>
        </html>
    );
}
