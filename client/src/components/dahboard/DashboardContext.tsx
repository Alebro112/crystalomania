"use client"
import { DCurrencyDTO } from "@/api/DTO/DB/DCurrency";
import { DTeamDTO } from "@/api/DTO/DB/DTeam";
import animateValueChange from "@/func/animatedValueChange";
import React, { createContext, useContext, useState } from "react";
import { set } from "zod";

type DashboardContextType = {
    currencies: DCurrencyDTO[]
    setDashboardCurrencies: (currencies: DCurrencyDTO[]) => void,
    updateDashboardCurrencies: (currencies: DCurrencyDTO[]) => void
    teams: DTeamDTO[],
    setDashboardTeams: (teams: DTeamDTO[]) => void,
    updateDashboardTeams: (teams: DTeamDTO[]) => void
}

const DashboardContext = createContext<DashboardContextType>({} as DashboardContextType)

export const useDasboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
}

const defaultCurrencies: DCurrencyDTO[] = [
    {
        "id": 1,
        "name": "red",
        "title": "Красные кристалы",
        "baseValue": 10,
        "rate": 0,
        "total": 0
    },
    {
        "id": 2,
        "name": "blue",
        "title": "Синие кристалы",
        "baseValue": 10,
        "rate": 0,
        "total": 0
    },
    {
        "id": 3,
        "name": "green",
        "title": "Зеленые кристалы",
        "baseValue": 10,
        "rate": 0,
        "total": 0
    },
    {
        "id": 4,
        "name": "yellow",
        "title": "Желтые кристалы",
        "baseValue": 10,
        "rate": 0,
        "total": 0
    },
    {
        "id": 5,
        "name": "purple",
        "title": "Фиолетовые кристалы",
        "baseValue": 10,
        "rate": 0,
        "total": 0
    },
    {
        "id": 6,
        "name": "orange",
        "title": "Оранжевые кристалы",
        "baseValue": 10,
        "rate": 0,
        "total": 0
    }
]

const defaultTeams: DTeamDTO[] = [
    {
        "id": 1,
        "title": "",
        "balance": 0,
        "color": "turmeric"
    },
    {
        "id": 2,
        "title": "",
        "balance": 0,
        "color": "blackish-green"
    },
    {
        "id": 3,
        "title": "",
        "balance": 0,
        "color": "claret"
    },
    {
        "id": 4,
        "title": "",
        "balance": 0,
        "color": "royal-blue"
    },
    {
        "id": 5,
        "title": "",
        "balance": 0,
        "color": "zhang-qinq"
    }
]

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
    const [currencies, setDashboardCurrencies] = useState<DCurrencyDTO[]>(defaultCurrencies)
    const [teams, setDashboardTeams] = useState<DTeamDTO[]>(defaultTeams)

    function updateDashboardCurrencies(newCurrencies: DCurrencyDTO[]) {
        setDashboardCurrencies(newCurrencies)
    }

    function updateDashboardTeams(newTeams: DTeamDTO[]) {
  setDashboardTeams((prevTeams) => {
    const updatedTeams = [...prevTeams];

    newTeams.forEach((incomingTeam) => {
      const index = updatedTeams.findIndex((t) => t.id === incomingTeam.id);
      if (index !== -1) {
        const currentTeam = updatedTeams[index];

        if (incomingTeam.balance === currentTeam.balance) {
          return; // skip identical
        }

        animateValueChange(
          currentTeam.balance,
          incomingTeam.balance,
          1000,
          (value: number) => {
            setDashboardTeams((latest) => {
              const updated = latest.map((t) =>
                t.id === incomingTeam.id ? { ...incomingTeam, balance: value } : t
              );

              // 🔽 Сортировка после каждого изменения значения
              return [...updated].sort((a, b) => b.balance - a.balance);
            });
          }
        );
      }
    });

    // ⚠ Здесь нельзя сразу сортировать, потому что данные будут меняться в анимации
    return prevTeams;
  });
}


    return (
        <DashboardContext.Provider value={{
            currencies,
            setDashboardCurrencies,
            setDashboardTeams,
            teams,
            updateDashboardCurrencies,
            updateDashboardTeams
        }}>
            {children}
        </DashboardContext.Provider>
    )
}