"use client";
import { RequestLoginDTO, RequestLoginSchema } from "@/api/DTO/Request/RequestLogin";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { useUserStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function SignInForm() {
    const {
            register,
            handleSubmit,
            watch,
            formState: { errors },
            reset,
            clearErrors,
            setError,
            
        } = useForm<RequestLoginDTO>({
            resolver: zodResolver(RequestLoginSchema),
            defaultValues: {
                login: "",
                password: "",
            }
        })

    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const userState = useUserStore((state) => state)

    useEffect(() => {
        if (userState.user) {
            window.location.href = "/"
        }
    }, [userState.user])
    

    const onSubmit: SubmitHandler<RequestLoginDTO> = async (data) => {
        clearErrors()
        const response = await userState.login(data)
        if (response) {
            toast.error(response)
        }
    }

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeftIcon />
                    Back to dashboard
                </Link>
            </div>
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Sign In
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your login and password to sign in!
                        </p>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        Login <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <Input 
                                        type="text"
                                        placeholder="Enter your login"
                                        {...register('login')}
                                        hint={errors.login?.message}
                                        error={!!errors.login}
                                    />
                                </div>
                                <div>
                                    <Label>
                                        Password <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            {...register('password')}
                                            hint={errors.password?.message}
                                            error={!!errors.password}
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                                            ) : (
                                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <Button className="w-full" size="sm">
                                        Sign in
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
