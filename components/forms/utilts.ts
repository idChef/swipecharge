import { ActivityWithBillAndGroup } from "types/groups";
import { Expense } from "./ExpenseForm";

export const validateAndFixCustomInitialValues = (
    customInitialValues: ActivityWithBillAndGroup | undefined
) => {
    if (!customInitialValues) {
        return undefined;
    }

    let fixedBudget = {};

    customInitialValues.Bill?.forEach((bill) => {
        fixedBudget[bill.userId] = bill.amount;
    });

    const fixedInitialValues: Expense = {
        title: customInitialValues.title,
        amount: customInitialValues.amount,
        type: "expense",
        date: {
            startDate: new Date(customInitialValues.date),
            endDate: new Date(customInitialValues.date),
        },
        group: customInitialValues.group?.id,
        repeat: customInitialValues.isRepeating,
        category: customInitialValues.categoryId || "",
        split: customInitialValues.isSplit,
        budget: fixedBudget,
    };

    if (customInitialValues.Bill)
        fixedInitialValues.group = customInitialValues.group?.id;

    if (typeof fixedInitialValues.date === "string") {
        fixedInitialValues.date = {
            startDate: new Date(fixedInitialValues.date),
            endDate: new Date(fixedInitialValues.date),
        };
    }

    return fixedInitialValues;
};
