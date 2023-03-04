import { FunctionComponent, LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
    children: string;
};

export const Label: FunctionComponent<LabelProps> = (props) => {
    return (
        <label
            {...props}
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
            {props.children}
        </label>
    );
};
