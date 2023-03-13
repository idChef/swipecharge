import { Field, FieldAttributes } from "formik";
import { FunctionComponent } from "react";

type StyledFieldProps = FieldAttributes<any>;

export const StyledField: FunctionComponent<StyledFieldProps> = (props) => {
    return (
        <Field
            className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-0 bg-gray-50 p-2.5 text-gray-900 dark:text-white/80 dark:bg-slate-800  sm:text-sm"
            {...props}
        />
    );
};
