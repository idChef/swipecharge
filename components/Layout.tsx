import { FunctionComponent, ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
    return <div className="px-4 py-4">{children}</div>;
};

export default Layout;
