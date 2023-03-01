import { Group } from "@prisma/client";
import { CaptionedSection } from "components/common/captionedSection/CaptionedSection";
import { Header } from "components/common/header/Header";
import { GroupCard } from "components/groups/groupCard/GroupCard";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FunctionComponent } from "react";
import useSWR from "swr";

const Groups: FunctionComponent = ({}) => {
    const { data: session } = useSession();

    const { data: groups } = useSWR<Group[]>(
        session?.user?.id && `/api/groups/${session?.user?.id}`
    );

    return (
        <div className="flex flex-col gap-6">
            <Header heading="Groups" showBack={false}>
                <div className="ml-auto bg-black rounded-full w-8 h-8 flex items-center justify-center absolute right-4 hover:bg-gray-500 transition-all">
                    <Link href="/groups/create">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 stroke-white"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                    </Link>
                </div>
            </Header>
            {/* <CaptionedSection caption="invites">
                <div className="flex gap-4"></div>
            </CaptionedSection> */}
            <CaptionedSection
                caption="your groups"
                captionChildren={
                    <span className="ml-auto font-bold text-sm">
                        {groups?.length}
                    </span>
                }
            >
                <div className="flex flex-col gap-4">
                    {groups?.map((group) => (
                        <Link key={group.id} href={`groups/${group.id}`}>
                            <GroupCard name={group.name} />
                        </Link>
                    ))}
                </div>
            </CaptionedSection>
        </div>
    );
};

export default Groups;