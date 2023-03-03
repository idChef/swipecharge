import { FunctionComponent } from "react";
import {
    HomeIcon,
    UserGroupIcon,
    BanknotesIcon,
    UserIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";

const ROUTES = [
    {
        name: "Home",
        path: "/",
        icon: <HomeIcon className="stroke-2" />,
    },
    {
        name: "Groups",
        path: "/groups",
        icon: <UserGroupIcon className="stroke-2" />,
    },
    {
        name: "Expense",
        path: "/expense/add",
        icon: <BanknotesIcon className="stroke-2" />,
    },
    {
        name: "Profile",
        path: "/profile/me",
        icon: <UserIcon className="stroke-2" />,
    },
    {
        name: "Settings",
        path: "/settings",
        icon: <Cog6ToothIcon className="stroke-2" />,
    },
];

export const Navigation: FunctionComponent = ({}) => {
    const router = useRouter();

    return (
        <div className="fixed bottom-0 left-0 flex h-24 w-full items-center justify-center gap-6 border-t px-4  drop-shadow-sm dark:bg-neutral-900 dark:border-t-0">
            {ROUTES.map(({ path, icon, name }) => (
                <Link
                    key={name}
                    href={path}
                    className={`flex flex-col items-center justify-center text-gray-400 ${
                        router.pathname === path ||
                        router.pathname.startsWith(`${path}/`)
                            ? "text-black dark:text-white"
                            : ""
                    }`}
                >
                    <div className="w-6">{icon}</div>
                    <span className="text-center">{name}</span>
                </Link>
            ))}
        </div>
    );
};
