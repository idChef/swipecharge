import axios from "axios";
import { DetailedActivityCard } from "components/activity/DetailedActivityCard";
import { Button } from "components/common/Button/Button";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";

import useSWR from "swr";

const Swipe: NextPage = () => {
    const { data: session } = useSession();
    const { data, isLoading, mutate } = useSWR(
        `/api/activities/swipe/remaining?userId=${session?.user?.id}`
    );

    const declineActivity = async () => {
        await axios.post("/api/activities/swipe/decline", {
            userId: session?.user.id,
            activityId: data[0].id,
        });
        mutate();
    };

    const acceptActivity = async () => {
        await axios.post("/api/activities/swipe/accept", {
            userId: session?.user.id,
            activityId: data[0].id,
        });
        mutate();
    };

    if (isLoading) {
        return null;
    }

    return (
        <div className="flex h-full flex-col pb-4">
            {data.length > 0 ? (
                <>
                    <DetailedActivityCard activity={data[0]} />

                    <Button onClick={() => declineActivity()}>Decline</Button>
                    <Button primary onClick={() => acceptActivity()}>
                        Accept
                    </Button>
                    <span className="mt-auto text-center dark:text-white">
                        {data.length} left to swipe
                    </span>
                </>
            ) : (
                <>
                    <span className="dark:text-white">
                        No activities left to settle :)
                    </span>
                </>
            )}
        </div>
    );
};

export default Swipe;
