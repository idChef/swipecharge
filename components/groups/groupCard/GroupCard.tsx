import { Icon } from "@iconify/react";
import Image from "next/image";
import { FunctionComponent } from "react";
import { GroupWithUsers } from "types/groups";

interface GroupCardProps {
    group: GroupWithUsers;
    primaryAccent?: string;
}

export const GroupCard: FunctionComponent<GroupCardProps> = ({
    group,
    primaryAccent,
}) => {
    console.log(group);

    const [pickedUsers, restOfTheUsers] = [
        group?.users.slice(0, 5),
        group?.users.slice(5, group?.users.length),
    ];

    return (
        <div className="flex w-full items-center justify-between gap-2 rounded-md bg-black/80 px-6 py-4 text-neutral-200 hover:bg-black/30 transition-all">
            <div className="flex flex-col gap-2">
                <span className="font-bold">{group.name}</span>
                <div className="flex -space-x-2">
                    {pickedUsers.map((user) => (
                        <div
                            className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-white dark:ring-neutral-900"
                            key={user?.id}
                        >
                            <Image
                                src={user?.user.image || ""}
                                alt={user?.user.name || ""}
                                fill
                            />
                        </div>
                    ))}
                    {restOfTheUsers?.length > 0 && (
                        <div className="relative flex h-8 w-8  items-center justify-center overflow-hidden rounded-full bg-neutral-700 text-xs text-white ring-2 ring-white dark:ring-neutral-900">
                            +{restOfTheUsers?.length}
                        </div>
                    )}
                </div>
            </div>
            <Icon icon="ic:round-star-outline" className="w-10 h-10" />
        </div>
    );
};
