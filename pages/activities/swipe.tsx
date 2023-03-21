import React from "react";
import axios from "axios";
import { DetailedActivityCard } from "components/activity/DetailedActivityCard";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import dynamic from "next/dynamic";

const Swipe: NextPage = () => {
    const { data: session } = useSession();
    const { data, isLoading, mutate } = useSWR(
        `/api/activities/swipe/remaining?userId=${session?.user?.id}`
    );

    const TinderCard = dynamic(() => import("react-tinder-card"), {
        ssr: false,
    });

    const onSwipe = async (direction: string, activityId: string) => {
        const action = direction === "left" ? "decline" : "accept";

        await axios.post(`/api/activities/swipe/${action}`, {
            userId: session?.user.id,
            activityId: activityId,
        });

        mutate();
    };

    if (isLoading) {
        return null;
    }

    return (
        <div className="flex h-full flex-col items-center justify-center pb-4">
            {data.length > 0 ? (
                <>
                    {data.map((activity) => (
                        <TinderCard
                            key={activity.id}
                            onSwipe={(dir) => onSwipe(dir, activity.id)}
                            className="absolute"
                            preventSwipe={["up", "down"]}
                        >
                            <DetailedActivityCard activity={activity} />
                        </TinderCard>
                    ))}

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
