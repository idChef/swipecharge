import { Header } from "components/common/header/Header";
import { Tabs } from "components/common/Tabs/Tabs";
import { ActivityTab } from "components/groups/ActivityTab";
import { SplitTab } from "components/groups/SplitTab";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import useSWR, { mutate } from "swr";
import { GroupWithExpenseAndUsers } from "types/groups";
import { copyToClipboard } from "utils/clipboard";

type GroupProps = {};

const groupTabs = [
    {
        name: "Activity",
        component: <ActivityTab />,
    },
    {
        name: "Split",
        component: <SplitTab />,
    },
    {
        name: "Settlements",
        component: <div className="dark:text-white">Not yet implemented</div>,
    },
];

const Group: FunctionComponent<GroupProps> = ({}) => {
    const router = useRouter();
    const { groupId } = router.query;
    const { data: session } = useSession();
    const { data: group } = useSWR<GroupWithExpenseAndUsers>(
        `/api/group/${groupId}/activity`
    );

    if (!group) {
        return null;
    }

    async function deleteGroupById(groupId: string) {
        try {
            const response = await fetch("/api/groups/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: groupId }),
            });

            if (response.ok) {
                console.log(`Group ${groupId} deleted successfully`);
                console.log(response);
                router.push("/groups");
                mutate(`/api/groups/${session?.user?.id}`);
            } else {
                console.error(
                    `Failed to delete group ${groupId}:`,
                    response.status
                );
            }
        } catch (error) {
            console.error(`Error deleting group ${groupId}:`, error);
        }
    }

    const handleCopyInviteLink = () => {
        const inviteLink = `${window.location.protocol}//${window.location.host}/groups/join/${group.inviteLink}`;

        copyToClipboard(inviteLink);
    };

    return (
        <>
            <Header heading={group.name}>
                <button
                    onClick={() => deleteGroupById(groupId as string)}
                    className="absolute right-4"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6 dark:stroke-white"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                    </svg>
                </button>
            </Header>

            <div className="mt-6 flex items-center gap-4">
                <button
                    type="button"
                    onClick={handleCopyInviteLink}
                    className="inline-flex gap-1 items-center rounded-lg bg-blue-700 px-4 py-2 text-center text-xs font-medium text-white hover:bg-blue-800"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                    >
                        <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0121 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 017.5 16.125V3.375z" />
                        <path d="M15 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0017.25 7.5h-1.875A.375.375 0 0115 7.125V5.25zM4.875 6H6v10.125A3.375 3.375 0 009.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V7.875C3 6.839 3.84 6 4.875 6z" />
                    </svg>
                    Copy invite link
                </button>
                <div className="flex -space-x-2">
                    {group.users &&
                        group.users.map(({ user }) => (
                            <div
                                className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white dark:ring-neutral-900"
                                key={user.id}
                            >
                                <Image
                                    src={user.image || ""}
                                    alt={user.name || ""}
                                    fill
                                />
                            </div>
                        ))}
                </div>
            </div>

            <Tabs tabs={groupTabs} />
        </>
    );
};

export default Group;
