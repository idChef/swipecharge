import { Header } from "components/common/header/Header";
import CreateExpenseForm from "components/forms/ExpenseForm";
import { FunctionComponent } from "react";

type AddProps = {};

export const Add: FunctionComponent<AddProps> = ({}) => {
    return (
        <>
        <Header heading="Add activity"  />
        <CreateExpenseForm/>
        </>
    );
};

export default Add;
