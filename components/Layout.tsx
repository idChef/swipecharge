import { useRouter } from "next/router";
import { FunctionComponent, ReactNode } from "react";
import { Navigation } from "./common/navigation/Navigation";

interface LayoutProps {
    children: ReactNode;
}

const EXCLUDED_ROUTES = ["/login", "/signup"];

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
    const router = useRouter();

    if (EXCLUDED_ROUTES.includes(router.pathname)) {
        return (
            <div className="h-full bg-neutral-50 px-4 py-4 pb-8 dark:bg-neutral-900 overflow-auto">
                {children}
            </div>
        );
    }

    return (
        <div className="h-full bg-neutral-50 px-4 py-4 pb-32 dark:bg-neutral-900 overflow-auto">
            <Navigation />
            {children}
        </div>
    );
};

export default Layout;
