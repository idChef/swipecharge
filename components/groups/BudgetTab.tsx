import { Budget, BudgetRestriction, User } from "@prisma/client";
import { Avatar } from "components/common/Avatar/Avatar";
import { Button } from "components/common/Button/Button";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import useSWR from "swr";
import { amountFormatter, formatDateTime } from "utils/formatters";

type BudgetTabProps = {};

type BudgetWithRestrictionsAndUser = Budget & {
    restrictions: BudgetRestriction[];
    user: User;
};

export const BudgetTab: FunctionComponent<BudgetTabProps> = ({}) => {
    const router = useRouter();
    const { groupId } = router.query;
    const { data: budget, isLoading } = useSWR<BudgetWithRestrictionsAndUser[]>(
        `/api/group/${groupId}/budget`
    );

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
            <h3 className="text-xl text-white">Current budget</h3>

            {budget && budget.length > 0 && (
                <div className="mt-2 flex flex-col gap-3">
                    <h3 className="text-xl text-white">Budget history</h3>
                    {budget?.map((budget) => (
                        <div
                            key={budget.id}
                            className="flex justify-between gap-2 rounded bg-black p-4 text-neutral-300"
                        >
                            <div>
                                {budget.restrictions.map((restriction) => (
                                    <div
                                        key={restriction.id}
                                        className="flex items-center gap-2"
                                    >
                                        <div>{restriction.categoryId}</div>
                                        <div>
                                            {amountFormatter(
                                                restriction.amount
                                            )}{" "}
                                            PLN
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                {formatDateTime(budget.yearAndMonth)}
                                <div className="mt-2 flex items-center gap-2 text-sm">
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src={budget.user.image}
                                    />
                                    Created by {budget.user.name}
                                </div>
                            </div>
                        </div>
                    ))}
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
