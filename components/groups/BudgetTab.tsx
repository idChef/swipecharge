import { Button } from "components/common/Button/Button";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import useSWR from "swr";

type BudgetTabProps = {};

export const BudgetTab: FunctionComponent<BudgetTabProps> = ({}) => {
    const router = useRouter();
    const { groupId } = router.query;
    const { data: budget, isLoading } = useSWR(`/api/group/${groupId}/budget`);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {(!budget || budget.length < 1) && (
                <div className="mt-2 rounded bg-black p-4 text-neutral-300">
                    No budgets yet
                </div>
            )}
            <Button
                onClick={() => router.push(`/groups/${groupId}/budget/create`)}
            >
                Create new budget
            </Button>
        </div>
    );
};
