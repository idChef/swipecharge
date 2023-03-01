import { useRouter } from "next/router";
import { FunctionComponent, ReactNode } from "react";

interface HeaderProps {
    heading: string;
    children?: ReactNode;
    showBack?: boolean;
}

export const Header: FunctionComponent<HeaderProps> = ({
    heading,
    children,
    showBack = true,
}) => {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="flex items-center justify-center">
            {showBack && (
                <button onClick={handleGoBack} className="absolute left-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                        />
                    </svg>
                </button>
            )}
            <h2 className="font-bold text-2xl">{heading}</h2>
            {children}
        </div>
    );
};
