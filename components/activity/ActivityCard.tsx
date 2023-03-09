import { Icon } from "@iconify/react";
import { Activity } from "@prisma/client";
import { CATEGORIES } from "constants/categories";
import { FunctionComponent } from "react";
import { amountFormatter, formatDateTime } from "utils/formatters";

type ActivityCardProps = {
    activity: Activity;
};

export const ActivityCard: FunctionComponent<ActivityCardProps> = ({
    activity,
}) => {
    const { title, amount, type, createdAt } = activity;

    const category = CATEGORIES.find(
        (category) => category.id === activity.categoryId
    );

    return (
        <div className="flex items-center justify-between rounded-sm bg-black px-4 py-3 dark:bg-white">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-200 p-3 text-blue-800 ring-2 ring-blue-800">
                        {category?.icon ? (
                            <Icon
                                icon={category?.icon}
                                width={24}
                                color="current"
                            />
                        ) : (
                            <Icon icon="icon-park-solid:bill" width={24} />
                        )}
                    </div>
                    <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm text-neutral-700">
                            {category?.name ?? "none"} -{" "}
                            <span className="text-[12px] text-neutral-700">
                                {formatDateTime(createdAt)}
                            </span>
                        </p>
                    </div>
                </div>
                <p
                    className={`text-lg font-medium text-gray-900 ${
                        type === "income" ? "text-green-500" : "text-red-500"
                    }`}
                >
                    {type === "income" ? "+" : "-"}
                    {amountFormatter(amount)} PLN
                </p>
            </div>
        </div>
    );
};
