import { Activity } from "@prisma/client";
import { CATEGORIES } from "constants/categories";
import { FunctionComponent } from "react";

type ActivityCardProps = {
    activity: Activity;
};

export const ActivityCard: FunctionComponent<ActivityCardProps> = ({
    activity,
}) => {
    const { title, amount, type } = activity;

    const categoryName = CATEGORIES.find(
        (category) => category.id === activity.categoryId
    )?.name;

    return (
        <div className="flex items-center justify-between rounded-sm bg-black px-4 py-3 dark:bg-white">
            <div className="flex w-full items-center justify-between">
                <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-sm">{categoryName}</p>
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
