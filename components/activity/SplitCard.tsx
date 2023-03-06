import { CATEGORIES } from "constants/categories";
import { useSession } from "next-auth/react";
import { FunctionComponent } from "react";
import { ActivityWithBill } from "types/groups";

type SplitCardProps = {
    activity: ActivityWithBill;
};

export const SplitCard: FunctionComponent<SplitCardProps> = ({ activity }) => {
    const {
        title,
        Bill: [userBill],
    } = activity;

    const { data: session } = useSession();

    if (!userBill) {
        return null;
    }

    return (
        <div className="flex items-center justify-between rounded-sm bg-black px-4 py-3 dark:bg-white">
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

                {userBill.hasParticipated ? (
                    <span className="font-medium text-red-500">
                        You owe {userBill.amount}
                    </span>
                ) : (
                    <span>Not involved</span>
                )}
            </div>
        </div>
    );
};
