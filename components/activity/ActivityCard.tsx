import { Activity } from "@prisma/client";
import { FunctionComponent } from "react";

type ActivityCardProps = {
    activity: Activity;
};

export const ActivityCard: FunctionComponent<ActivityCardProps> = ({
    activity,
}) => {
    const { title, amount, type } = activity;

    return (
        <div className="flex items-center justify-between rounded-sm bg-black px-4 py-2 dark:bg-white">
            <div className="flex w-full items-center justify-between">
                <p>{title}</p>
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
