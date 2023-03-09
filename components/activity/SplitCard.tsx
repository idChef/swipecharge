import { CATEGORIES } from "constants/categories";
import { useSession } from "next-auth/react";
import { FunctionComponent } from "react";
import { ActivityWithBill } from "types/groups";

type SplitCardProps = {
    activity: ActivityWithBill;
};

export const SplitCard: FunctionComponent<SplitCardProps> = ({ activity }) => {
    const { title, currentUserBill, Bill } = activity;

    const { data: session } = useSession();

    const moneyLent = Bill.reduce((total, item) => {
        if (item.userId !== activity.user.id && item.hasParticipated) {
            return total + (item.amount || 0);
        } else {
            return total;
        }
    }, 0);

    const moneyOwed = Bill.reduce((total, item) => {
        if (item.userId === session?.user?.id && item.hasParticipated) {
            return total + (item.amount || 0);
        } else {
            return total;
        }
    }, 0);

    return (
        <div className="flex items-center justify-between rounded-sm bg-black px-4 py-3 text-white dark:bg-white dark:text-black">
            <div className="flex w-full items-center justify-between">
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
                            {activity.amount} PLN
                        </span>
                    </p>
                </div>

                <>
                    {!currentUserBill ? (
                        <span className="font-medium">No balance</span>
                    ) : (
                        <>
                            {Bill.length === 1 &&
                            currentUserBill.userId === session?.user.id ? (
                                <span className="font-medium">No balance</span>
                            ) : (
                                <>
                                    {activity.user.id === session?.user.id ? (
                                        <>
                                            {moneyLent === 0 ? (
                                                <span className="font-medium">
                                                    No balance
                                                </span>
                                            ) : (
                                                <span className="font-medium text-green-500">
                                                    You lent {moneyLent}
                                                </span>
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
                                                    You owe {moneyOwed}
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
    );
};
