import { Icon } from "@iconify/react";
import { CATEGORIES } from "constants/categories";
import React, { useState } from "react";
import { Button } from "./common/Button/Button";

const mainBudget = 1000; // example main budget

type Budgets = {
    [key: string]: number | undefined;
};

export const BudgetInput = () => {
    const [budgets, setBudgets] = useState<Budgets>({});

    const handleBudgetChange = (categoryId: string, value: number) => {
        const newBudgets = { ...budgets, [categoryId]: value };
        const totalBudget = Object.values(newBudgets).reduce(
            (acc: number, cur) => (cur ? acc + cur : acc),
            0
        );

        if (totalBudget && totalBudget <= mainBudget) {
            setBudgets(newBudgets);
        }
    };

    return (
        <div className="text-white">
            <span className="mt-6 mb-2 block font-semibold">
                Max budget: {mainBudget} PLN
            </span>
            <div className="flex flex-col gap-4">
                {CATEGORIES.map((category) => (
                    <div key={category.id} className="flex gap-4">
                        <div className="rounded-full bg-blue-200 p-3 text-blue-800 ring-2 ring-blue-800">
                            <Icon
                                icon={category?.icon}
                                width={24}
                                color="current"
                            />
                        </div>
                        <div className="flex w-full flex-col gap-1">
                            <div className="flex justify-between">
                                <label htmlFor={category.id}>
                                    {category.name}
                                </label>
                                <span>{budgets[category.id] ?? 0} PLN</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max={mainBudget}
                                value={budgets[category.id] ?? 0}
                                onChange={(e) =>
                                    handleBudgetChange(
                                        category.id,
                                        parseInt(e.target.value)
                                    )
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>
            <Button>Submit budget</Button>
        </div>
    );
};
