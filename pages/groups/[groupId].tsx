import { Group, User } from "@prisma/client";
import { Header } from "components/common/header/Header";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import useSWR, { mutate } from "swr";

type GroupProps = {};

type GroupAndUsers = Group & { users?: User[] };

const Group: FunctionComponent<GroupProps> = ({}) => {
    const router = useRouter();
    const { groupId } = router.query;
    const { data: session } = useSession();
    const { data: group } = useSWR<GroupAndUsers>(`/api/group/${groupId}`);

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
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                    </svg>
                </button>
            </Header>
            <div className="flex">
                {group.users &&
                    group.users.map((user) => (
                        <div
                            className="relative rounded-full overflow-hidden w-16 h-16"
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
        </>
    );
};

export default Group;
