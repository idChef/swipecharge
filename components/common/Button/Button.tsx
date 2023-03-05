import { ButtonHTMLAttributes, FunctionComponent } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    primary?: boolean;
};

export const Button: FunctionComponent<ButtonProps> = (props) => {
    return (
        <button
            className={`hover:bg-primary-700 focus:ring-primary-300 mt-2 w-full rounded-lg  px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 disabled:bg-gray-500 ${
                props.primary ? "bg-blue-700" : "bg-black"
            }`}
            {...props}
        >
            {props.children}
        </button>
    );
};
