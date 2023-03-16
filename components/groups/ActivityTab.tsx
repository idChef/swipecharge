import { Activity } from "@prisma/client";
import { ActivityCard } from "components/activity/ActivityCard";
import ActivityFilterForm, {
    FilterValues,
} from "components/forms/ActivityFilterForm";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import useSWR from "swr";

type ActivityTabProps = {};

const buildQueryParams = (filters: Omit<FilterValues, "groupId">): string => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value) {
            if (key === "startDate" || key === "endDate") {
                queryParams.append(key, new Date(value).toISOString());
            } else {
                queryParams.append(key, value as string);
            }
        }
    });

    return queryParams.toString();
};

export const ActivityTab: FunctionComponent<ActivityTabProps> = ({}) => {
    const router = useRouter();
    const { groupId } = router.query;
    const [filters, setFilters] = useState<FilterValues>({
        activityType: "",
        category: "",
        startDate: "",
        endDate: "",
        userId: "",
    });
    const queryParams = buildQueryParams(filters);

    const { data: activity } = useSWR<Activity[]>(
        `/api/group/${groupId}/activity?${queryParams}`
    );

    const handleFilterSubmit = (filterValues: FilterValues) => {
        setFilters(filterValues);
    };

    if (!activity) {
        return <div>No activity yet</div>;
    }

    return (
        <div className="mt-4 flex flex-col gap-4">
            <ActivityFilterForm onSubmit={handleFilterSubmit} />
            {activity &&
                activity.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                ))}
        </div>
    );
};
