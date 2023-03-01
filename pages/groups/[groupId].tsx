import { Group, User } from "@prisma/client";
import { Header } from "components/common/header/Header";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import useSWR from "swr";

type GroupProps = {};

type GroupAndUsers = Group & { users?: User[] };

const Group: FunctionComponent<GroupProps> = ({}) => {
    const router = useRouter();
    const { groupId } = router.query;

    const { data: group } = useSWR<GroupAndUsers>(`/api/group/${groupId}`);

    if (!group) {
        return null;
    }

    return (
        <>
            <Header heading={group.name} />
            <div className="flex">
                {group.users &&
                    group.users.map((user) => (
                        <div className="rounded-full overflow-hidden w-32 h-32" key={user.id}>
                            <img src={user.image} />
                        </div>
                    ))}
            </div>
        </>
    );
};

export default Group;
