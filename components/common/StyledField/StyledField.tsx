import { Field, FieldAttributes } from "formik";
import { FunctionComponent } from "react";

type StyledFieldProps = FieldAttributes<any>;

export const StyledField: FunctionComponent<StyledFieldProps> = (props) => {
    return (
        <Field
            className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-black bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
            {...props}
        />
    );
};
