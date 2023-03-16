import { Header } from "components/common/header/Header";
import CreateBudgetForm from "components/forms/BudgetCreationForm";
import type { NextPage } from "next";

const BudgetCreate: NextPage = () => {
    return (
        <div>
            <Header heading="Create budget" />
            <CreateBudgetForm />
        </div>
    );
};

export default BudgetCreate;
