import { Formik, Form, ErrorMessage, FormikHelpers, Field } from "formik";
import * as Yup from "yup";
import { Button } from "components/common/Button/Button";
import axios from "axios";
import { useSession } from "next-auth/react";
import { StyledField } from "components/common/StyledField/StyledField";
import { Label } from "components/common/Label/Label";
import useSWR from "swr";
import { Group } from "@prisma/client";
import { CATEGORIES } from "constants/categories";

type Expense = any;

type CreateExpenseFormProps = {};

const CreateExpenseForm: React.FC<CreateExpenseFormProps> = () => {
    const { data: session } = useSession();

    const { data: groups } = useSWR<Group[]>(
        session?.user?.id && `/api/groups/${session?.user?.id}`
    );

    const initialValues: Expense = {
        title: "",
        amount: "",
        group: groups?.[0]?.id ?? "",
        category: "",
        split: true,
    };

    const validationSchema = Yup.object({
        title: Yup.string().required("Required"),
        amount: Yup.number().typeError("Must be a number").required("Required"),
    });

    const handleSubmit = async (
        values: Expense,
        { resetForm }: FormikHelpers<Expense>
    ) => {
        if (!session?.user.id) {
            return;
        }

        try {
            await axios.post("/api/expenses", {
                ...values,
                userId: session?.user.id,
                groupId: values.group,
                categoryId: values.category,
                isSplit: values.split,
            });

            resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({ isSubmitting, values }) => (
                <Form className="flex flex-col gap-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <StyledField type="text" id="title" name="title" />
                        <ErrorMessage
                            className="text-red-500"
                            name="title"
                            component="div"
                        />
                    </div>

                    <div>
                        <Label htmlFor="amount">Amount</Label>
                        <StyledField type="text" id="amount" name="amount" />
                        <ErrorMessage
                            className="text-red-500"
                            name="amount"
                            component="div"
                        />
                    </div>

                    <div>
                        <Label htmlFor="group">Group</Label>
                        <StyledField as="select" id="group" name="group">
                            {groups?.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </StyledField>
                    </div>

                    <div>
                        <Label htmlFor="category">Category</Label>
                        <StyledField as="select" id="category" name="category">
                            <option value="" disabled>
                                Select a category
                            </option>
                            {CATEGORIES.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </StyledField>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center">
                        <Field
                            type="checkbox"
                            name="split"
                            className="peer sr-only"
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Split this expense?
                        </span>
                    </label>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default CreateExpenseForm;
