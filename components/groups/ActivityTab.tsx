import { ActivityCard } from "components/activity/ActivityCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import useSWR from "swr";
import { GroupWithExpenseAndUsers } from "types/groups";

type ActivityTabProps = {};

export const ActivityTab: FunctionComponent<ActivityTabProps> = ({}) => {
    const router = useRouter();
    const { groupId } = router.query;
    const { data: group } = useSWR<GroupWithExpenseAndUsers>(
        `/api/group/${groupId}/activity`
    );

    if (!group) {
        return <div>No activity yet</div>;
    }

    return (
        <div className="mt-4 flex flex-col gap-2">
            {group.Activity &&
                group.Activity.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                ))}
        </div>
    );
};
