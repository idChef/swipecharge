import { Expense } from "./ExpenseForm";

export const validateAndFixCustomInitialValues = (
    customInitialValues: Expense | undefined
) => {
    if (!customInitialValues) {
        return undefined;
    }

    const fixedInitialValues = { ...customInitialValues };

    if (typeof fixedInitialValues.date === "string") {
        fixedInitialValues.date = {
            startDate: new Date(fixedInitialValues.date),
            endDate: new Date(fixedInitialValues.date),
        };
    }

    return fixedInitialValues;
};
