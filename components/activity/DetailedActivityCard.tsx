import { Icon } from "@iconify/react";
import { Activity, Group, User } from "@prisma/client";
import { Avatar } from "components/common/Avatar/Avatar";
import { CATEGORIES } from "constants/categories";
import { FunctionComponent } from "react";
import { amountFormatter } from "utils/formatters";

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

    const category = CATEGORIES.find((category) => category.id === categoryId);

    return (
        <div className="flex w-80 select-none items-center justify-between rounded-xl bg-black p-4 py-12 text-white">
            <div className="flex w-full flex-col items-center justify-between">
                <div className="flex flex-col items-center">
                    <div className="mb-4 rounded-full bg-white/20 p-5 text-white ring-2 ring-black ">
                        {type === "expense" ? (
                            <>
                                {category?.icon ? (
                                    <Icon
                                        icon={category?.icon}
                                        width={30}
                                        color="current"
                                    />
                                ) : (
                                    <Icon
                                        icon="icon-park-solid:bill"
                                        width={30}
                                    />
                                )}
                            </>
                        ) : (
                            <Icon icon="ph:trend-up-bold" width={30} />
                        )}
                    </div>
                    <span className="text-neutral-300">Total Bill</span>
                    <span className="text-2xl">
                        {amountFormatter(amount)} PLN
                    </span>
                </div>
                <span className="text-sm text-neutral-300">{title}</span>
                <div className="mt-6 text-sm text-neutral-300">
                    <div className="flex items-center gap-6">
                        <div>
                            Created by {user.name} in {group.name}
                        </div>
                        <Avatar imgSrc={user.image} />
                    </div>
                </div>
            </div>
        </div>
    );
};
