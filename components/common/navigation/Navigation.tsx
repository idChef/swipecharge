import { FunctionComponent } from "react";
import { HomeIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const ROUTES = [
    {
        name: "Home",
        path: "/",
        icon: <HomeIcon />,
    },
    {
        name: "Groups",
        path: "/groups",
        icon: <UserGroupIcon />,
    },
];

export const Navigation: FunctionComponent = ({}) => {
    return (
        <div className="flex items-center gap-4 fixed bottom-0 drop-shadow-sm border-t border-black w-full left-0 h-12">
            {ROUTES.map(({ path, icon, name }) => (
                <Link key={name} href={path}>
                    <div className="w-8">{icon}</div>
                </Link>
            ))}
        </div>
    );
};
