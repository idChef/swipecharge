import { Group, User } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { NextRouter, useRouter } from "next/router";
import { FunctionComponent } from "react";
import useSWR from "swr";

type joinProps = {};

type GroupAndUsers = Group & { users?: User[] };

const Join: FunctionComponent<joinProps> = ({}) => {
    const router = useRouter();
    const { data: session } = useSession();
    const { inviteCode } = router.query;
    const { data: group, isLoading } = useSWR<GroupAndUsers>(
        `/api/groups/inviteLink/${inviteCode}`
    );

    const handleGroupJoin = async () => {
        try {
            if (!session) {
                return;
            }

            const res = await fetch(`/api/groups/inviteLink/${inviteCode}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inviteLink: inviteCode,
                    userId: session.user.id,
                }),
            });

            if (res.ok) {
                router.push(`/groups/${group?.id}`);
            } else if (res.status === 404) {
                // Handle group not found error
            } else if (res.status === 409) {
                // Handle user already in group error
            } else {
                // Handle other errors
            }
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!group) {
        return <div>Invite invalid</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <span>
                You were invited to join <strong>{group?.name}</strong>
            </span>
            <button
                onClick={handleGroupJoin}
                className="hover:bg-primary-700 focus:ring-primary-300 mt-2 rounded-lg bg-black px-8 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
            >
                Join
            </button>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    // Check if user session is available
    const session = await getSession(context);
    const route = context.resolvedUrl as unknown as NextRouter;

    if (!session) {
        return {
            redirect: {
                destination: `/api/auth/signin?callbackUrl=${route}`,
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};

export default Join;
