import { FunctionComponent, ReactNode } from "react";
import { Navigation } from "./common/navigation/Navigation";

interface LayoutProps {
    children: ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
    return (
        <div className="px-4 py-4 bg-neutral-50 dark:bg-neutral-700 h-full">
            <Navigation />
            {children}
        </div>
    );
};

export default Layout;
