import { useFormikContext } from "formik";
import { useSession } from "next-auth/react";
import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import useSWR from "swr";
import { GroupWithUsers } from "types/groups";
import { Avatar } from "./common/Avatar/Avatar";
import { Expense } from "./forms/ExpenseForm";

export type Label = {
    id: string;
    title: string;
    icon: ReactNode;
};

export type Budgets = {
    [key: string]: number | undefined | null;
};

type MoneySplitFormProps = {
    limitAmount: number;
    state: Budgets;
    setState: (field: string, value: any, shouldValidate?: boolean) => void;
};

export const MoneySplitForm = ({
    limitAmount,
    state,
    setState,
}: MoneySplitFormProps) => {
    const { values } = useFormikContext<Expense>();
    const { data: session } = useSession();

    const { data: selectedGroup } = useSWR<GroupWithUsers>(
        `/api/group/${values.group}`
    );

    const splitBetween =
        selectedGroup &&
        selectedGroup?.users.map((user) => {
            return {
                id: user.userId,
                title:
                    user.userId === session?.user.id
                        ? "You"
                        : (user.user.name as string),
                icon: <Avatar imgSrc={user.user.image || ""} />,
            };
        });

    const handleBudgetChange = (categoryId: string, value: number) => {
        const newValue = isNaN(value) ? null : value;
        const newBudgets = { ...state, [categoryId]: newValue };
        const totalBudget = Object.values(newBudgets).reduce(
            (acc: number, cur) => (cur ? acc + cur : acc),
            0
        );

        if (totalBudget <= limitAmount) {
            setState("budget", newBudgets);
        }
    };

    return (
        <div className="text-white">
            <div className="flex flex-col gap-4">
                {splitBetween &&
                    splitBetween.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            {item.icon}
                            <div className="flex w-full flex-col gap-1">
                                <div className="flex justify-between">
                                    <label htmlFor={item.id}>
                                        {item.title} (
                                        {limitAmount &&
                                            (
                                                ((state[item.id] ?? 0) /
                                                    limitAmount) *
                                                100
                                            ).toFixed(0)}
                                        %)
                                    </label>
                                    <input
                                        type="number"
                                        max={limitAmount}
                                        value={state[item.id]}
                                        disabled={!limitAmount}
                                        onChange={(e) =>
                                            handleBudgetChange(
                                                item.id,
                                                parseFloat(e.target.value)
                                            )
                                        }
                                        className="mt-1 w-20 text-black"
                                    />
                                </div>
                                <input
                                    type="range"
                                    max={limitAmount}
                                    step={0.01}
                                    disabled={!limitAmount}
                                    value={state[item.id]}
                                    onChange={(e) =>
                                        handleBudgetChange(
                                            item.id,
                                            parseFloat(e.target.value)
                                        )
                                    }
                                />
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};
