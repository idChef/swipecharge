import React, { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { Label } from "components/common/Label/Label";
import Datepicker from "react-tailwindcss-datepicker";
import { StyledField } from "components/common/StyledField/StyledField";
import { CATEGORIES } from "constants/categories";

export type FilterValues = {
    category: string;
    startDate: string | null;
    endDate: string | null;
    userId: string;
    activityType: "expense" | "income" | "";
};

type ActivityFilterFormProps = {
    onSubmit: (values: FilterValues) => void;
};

const ActivityFilterForm: React.FC<ActivityFilterFormProps> = ({
    onSubmit,
}) => {
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (
        values: FilterValues,
        { setSubmitting }: FormikHelpers<FilterValues>
    ) => {
        onSubmit(values);
        setSubmitting(false);
        setShowForm(false);
    };

    return (
        <div>
            <button
                onClick={() => setShowForm(!showForm)}
                className="rounded bg-blue-600 p-2 font-semibold text-white hover:bg-blue-700"
            >
                Filters
            </button>

            {showForm && (
                <div className="fixed top-5 left-5 right-5 rounded bg-black/95 p-4 shadow-lg">
                    <h1 className="mb-2 text-xl text-white">Filter values</h1>
                    <Formik<FilterValues>
                        initialValues={{
                            activityType: "",
                            category: "",
                            startDate: null,
                            endDate: null,
                            userId: "",
                        }}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, values, setFieldValue }) => (
                            <Form className="flex flex-col gap-4 text-white">
                                <div>
                                    <Label htmlFor="activityType">
                                        Activity type
                                    </Label>
                                    <StyledField
                                        as="select"
                                        id="activityType"
                                        name="activityType"
                                    >
                                        <option value="" disabled>
                                            Select an activity type
                                        </option>

                                        <option key="expense" value="expense">
                                            expense
                                        </option>

                                        <option key="income" value="income">
                                            income
                                        </option>
                                    </StyledField>
                                </div>

                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <StyledField
                                        as="select"
                                        id="category"
                                        name="category"
                                    >
                                        <option value="" disabled>
                                            Select a category
                                        </option>
                                        {CATEGORIES.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </StyledField>
                                </div>

                                <div>
                                    <Label htmlFor="group">Date</Label>
                                    <Datepicker
                                        useRange={false}
                                        value={{
                                            startDate: values.startDate,
                                            endDate: values.endDate,
                                        }}
                                        onChange={(val) => {
                                            setFieldValue(
                                                "startDate",
                                                val?.startDate
                                            );
                                            setFieldValue(
                                                "endDate",
                                                val?.endDate
                                            );
                                        }}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="userId"
                                        className="mb-2 block"
                                    >
                                        User ID
                                    </label>
                                    <Field
                                        type="text"
                                        id="userId"
                                        name="userId"
                                        className="w-full rounded border border-gray-700 bg-gray-800 p-2"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-4 w-full rounded bg-blue-600 p-2 font-semibold text-white hover:bg-blue-700"
                                >
                                    {isSubmitting ? "Submitting..." : "Apply"}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}
        </div>
    );
};

export default ActivityFilterForm;
