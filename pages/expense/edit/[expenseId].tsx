import CreateExpenseForm from "components/forms/ExpenseForm";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";

const Edit: NextPage = () => {
    const router = useRouter();
    const { expenseId } = router.query;
    const { data } = useSWR(`/api/activities/${expenseId}`);

    if (typeof expenseId !== "string") return null;

    return (
        <div>
            <CreateExpenseForm
                customInitialValues={data}
                expenseId={expenseId}
                formType="edit"
            />
        </div>
    );
};

export default Edit;
