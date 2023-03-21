import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FunctionComponent } from "react";
import { ActivityWithBill } from "types/groups";
import { amountFormatter } from "utils/formatters";

type SplitCardProps = {
    activity: ActivityWithBill;
};

export const SplitCard: FunctionComponent<SplitCardProps> = ({ activity }) => {
    const { title, currentUserBill, Bill, amount, isSplit } = activity;

    const { data: session } = useSession();

    const moneyLent = Bill.reduce((total, item) => {
        if (item.userId !== activity.user.id && item.hasParticipated) {
            return total + (item.amount || 0);
        } else {
            return total;
        }
    }, 0);

    const moneyUndecided = amount - moneyLent;

    const moneyOwed = Bill.reduce((total, item) => {
        if (item.userId === session?.user?.id && item.hasParticipated) {
            return total + (item.amount || 0);
        } else {
            return total;
        }
    }, 0);

    return (
        <Link href={`/expense/${activity.id}`}>
            <div className="flex items-center justify-between rounded-sm bg-black/80 px-4 py-3 text-neutral-300 ">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center justify-center text-xs text-neutral-500 min-w-[40px]">
                            {isSplit ? (
                                <>
                                    <Icon
                                        icon="ic:sharp-grid-view"
                                        className="h-6 w-6"
                                    />
                                    <span>Evenly</span>
                                </>
                            ) : (
                                <>
                                    <Icon
                                        icon="material-symbols:space-dashboard-sharp"
                                        className="h-6 w-6"
                                    />
                                    <span>Custom</span>
                                </>
                            )}
                        </div>
                        <div>
                            <p className="text-lg font-medium">{title}</p>
                            <p>
                                <span className="font-medium">
                                    {activity.user.id === session?.user.id
                                        ? "You"
                                        : activity.user.name}
                                </span>{" "}
                                paid{" "}
                                <span className="font-medium">
                                    {amountFormatter(activity.amount)} PLN
                                </span>
                            </p>
                        </div>
                    </div>
                    <>
                        {!currentUserBill ? (
                            <span className="font-medium">No balance</span>
                        ) : (
                            <>
                                {Bill.length === 1 &&
                                currentUserBill.userId === session?.user.id ? (
                                    <span className="font-medium">
                                        No balance
                                    </span>
                                ) : (
                                    <>
                                        {activity.user.id ===
                                        session?.user.id ? (
                                            <>
                                                {moneyLent === 0 ? (
                                                    <span className="font-medium">
                                                        No balance
                                                    </span>
                                                ) : (
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-green-500">
                                                            You lent{" "}
                                                            {amountFormatter(
                                                                moneyLent
                                                            )}{" "}
                                                            PLN
                                                        </span>
                                                        {moneyUndecided > 0 && (
                                                            <span className="text-xs">
                                                                (
                                                                {amountFormatter(
                                                                    moneyUndecided
                                                                )}{" "}
                                                                PLN left to
                                                                split)
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {moneyOwed === 0 ? (
                                                    <span className="font-medium">
                                                        No balance
                                                    </span>
                                                ) : (
                                                    <span className="font-medium text-red-500">
                                                        You owe{" "}
                                                        {amountFormatter(
                                                            moneyOwed
                                                        )}{" "}
                                                        PLN
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </>
                </div>
            </div>
        </Link>
    );
};
