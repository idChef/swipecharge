import { Activity, Group, User } from "@prisma/client";
import { FunctionComponent } from "react";

type DetailedActivity = Activity & {
    user: User;
    group: Group;
};

type DetailedActivityCardProps = {
    activity: DetailedActivity;
};

export const DetailedActivityCard: FunctionComponent<
    DetailedActivityCardProps
> = ({ activity }) => {
    const { title, amount, type, categoryId, user, group } = activity;

    return (
        <div className="flex items-center justify-between rounded-sm bg-black px-4 py-3 dark:bg-white">
            <div className="flex w-full items-center justify-between">
                <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-sm">Created by {user.name}</p>
                    <p className="text-sm">{group.name}</p>
                </div>
                <p
                    className={`text-lg font-medium text-gray-900 ${
                        type === "income" ? "text-green-500" : "text-red-500"
                    }`}
                >
                    {type === "income" ? "+" : "-"}
                    {amount}
                </p>
            </div>
        </div>
    );
};
