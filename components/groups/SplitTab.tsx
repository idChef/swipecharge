import { SplitCard } from "components/activity/SplitCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import useSWR from "swr";
import type { GroupWithActivityAndBill } from "types/groups";

type SplitTabProps = {};

export const SplitTab: FunctionComponent<SplitTabProps> = ({}) => {
    const router = useRouter();
    const { data: session } = useSession();
    const { groupId } = router.query;
    const { data: group } = useSWR<GroupWithActivityAndBill>(
        `/api/group/${groupId}/split?userId=${session?.user?.id}`
    );

    console.log(session?.user?.id);

    console.log(group);

    if (!group) {
        return <div>No splits yet</div>;
    }

    return (
        <div className="mt-4 flex flex-col gap-2">
            {group.Activity &&
                group.Activity.map((activity) => (
                    <SplitCard key={activity.id} activity={activity} />
                ))}
        </div>
    );
};
