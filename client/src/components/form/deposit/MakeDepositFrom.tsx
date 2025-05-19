"use client"
import { useForm, SubmitHandler, set } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

import ComponentCard from "@/components/common/ComponentCard"

import Label from "../Label"
import Input from "../input/InputField"
import Select from "../Select"
import { useEffect, useLayoutEffect, useState } from "react"
import Button from "@/components/ui/button/Button"
import { RequestDepositSchema } from "@/api/DTO/Request/RequestDeposit";

import * as generalAPI from "@/api/generalAPI"
import { DCurrencyDTO } from "@/api/DTO/DB/DCurrency";
import { MakeDepositFormLoadingState } from "./types/MakeDepositForm";
import { OverlayLoader } from "@/components/ui/overlayLoader";
import { DTeamDTO } from "@/api/DTO/DB/DTeam";
import { parse } from "path";
import toast from "react-hot-toast";

type DepositSchema = z.infer<typeof RequestDepositSchema>

const isLoading = (loading: MakeDepositFormLoadingState) => {
    return loading.teams || loading.currencies
}

const pluralizePoints = (n: number): string => {
  const mod10 = n % 10;
  const mod100 = n % 100;

  let word = 'баллов';

  if (mod10 === 1 && mod100 !== 11) {
    word = 'балл';
  } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    word = 'балла';
  }

  return word;
}

export default function MakeDepositFrom() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        clearErrors,
        setError,
        
    } = useForm<DepositSchema>({
        resolver: zodResolver(RequestDepositSchema),
        defaultValues: {
            details: {}
        }
    })

    const [selectedTeam, setSelectedTeam] = useState<number | null>(null)
    const [currencies, setCurrencies] = useState<DCurrencyDTO[]>([])
    const [teams, setTeams] = useState<DTeamDTO[]>([])
    const [loading, setLoading] = useState<MakeDepositFormLoadingState>({
        teams: true,
        currencies: true
    })

    const resetForm = () => {
        reset()
        clearErrors()
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    useEffect(() => {
        setSelectedTeam(watch('teamId'))
    }, [watch('teamId')])


    useLayoutEffect(() => {
        resetForm()

        const getCurrencies = async () => {
            const result = await generalAPI.fetchCurrencies()

            if (result.success) {
                setCurrencies(result.data)
                setLoading(old => {
                    return { ...old, currencies: false }
                })
                return
            }

            if (result.type === 'message') {
                toast.error(result.message)
            }
        }

        const getTeams = async () => {
            const result = await generalAPI.fetchTeams()

            if (result.success) {
                setTeams(result.data)
                setLoading(old => {
                    return { ...old, teams: false }
                })
                return
            }

            if (result.type === 'message') {
                toast.error(result.message)
            }
        }

        getTeams()
        getCurrencies()
    }, [])



    const onSubmit: SubmitHandler<DepositSchema> = async (data) => {
        clearErrors()

        const response = await generalAPI.createDeposit(data)

        if (response.success) {
            resetForm()
            toast.success(`Команде [${response.data.team?.title}] начислено ${response.data.amount} ${pluralizePoints(response.data.amount)}`)
            return
        }

        if (response.type === 'zod') {
            response.errors.issues.forEach(issue => {
                const path = issue.path.join('.')
                setError(path as any, {
                    message: issue.message,
                })
            })
        }
    }


    return (
        <ComponentCard className="relative" title="Форма депозита">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {isLoading(loading) && <OverlayLoader className="rounded-2xl" />}


                <div className="pb-4">
                    <Label>Команда</Label>
                    <Select
                        options={teams.map(team => ({ value: team.id, label: team.title }))}
                        placeholder="Выбери команду"
                        className="dark:bg-dark-900"
                        {...register('teamId')}
                        value={watch('teamId')}
                        hint={errors.teamId?.message}
                        error={!!errors.teamId}
                    />
                </div>

                <div>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2">
                        {currencies.map((currency) => (
                            <div key={currency.name}>
                                <Label>{currency.title}</Label>
                                <Input
                                    type="number"
                                    {...register(`details.${currency.name}`)}
                                    hint={errors.details?.[currency.name]?.message}
                                    error={!!errors.details?.[currency.name]}
                                />
                            </div>
                        ))}
                    </div>

                    {errors.details && typeof errors.details.message === 'string' && <span className="text-red-500 mt-2 text-xs">
                        {errors.details.message}
                    </span>}
                </div>

                <div className="space-y-2 pt-4
                ">
                    <Button
                        className="w-full select-none "
                        size="sm"
                        disabled={!selectedTeam}
                    >
                        {selectedTeam
                            ? `Сделать депозит для ${teams.find((team) => team.id == selectedTeam)?.title}`
                            : 'Пожалуйста выберите команду'}
                    </Button>

                    <Button
                        className="w-full select-none"
                        size="sm"
                        variant="outline"
                        onClick={resetForm}
                    >
                        Очистить форму
                    </Button>
                </div>
            </form>
        </ComponentCard>
    )
}