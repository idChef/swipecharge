import { FunctionComponent, ReactNode } from "react";

interface HeaderProps {
    heading: string;
    children?: ReactNode;
}

export const Header: FunctionComponent<HeaderProps> = ({
    heading,
    children,
}) => {
    return (
        <div className="flex items-center">
            <h2 className="font-bold text-4xl">{heading}</h2>
            {children}
        </div>
    );
};
