import { FunctionComponent, ReactNode } from "react";
import { Navigation } from "./common/navigation/Navigation";

interface LayoutProps {
    children: ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
    return (
        <div className="h-full bg-neutral-50 px-4 py-4 pb-24 dark:bg-neutral-900">
            <Navigation />
            {children}
        </div>
    );
};

export default Layout;
