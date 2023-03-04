import { FunctionComponent } from "react";

interface GroupCardProps {
    name: string;
    primaryAccent?: string;
}

export const GroupCard: FunctionComponent<GroupCardProps> = ({
    name,
    primaryAccent,
}) => {
    return (
        <div className="rounded-md bg-red-500 w-full text-white px-6 py-4 flex flex-col gap-2">
            <div className="flex">
                <span className="font-bold">{name}</span>
                <div className="ml-auto"></div>
            </div>
        </div>
    );
};
