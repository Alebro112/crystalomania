import React from 'react'

import { AuthProviderComponent } from '@/context/authProvider/AuthProviderComponent'

export const AuthProvider = async ({ children }: { children: React.ReactNode }) => {

   return (
      <>
         <AuthProviderComponent />
         {children}
      </>
   )
}
