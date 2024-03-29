import {
    Formik,
    Form,
    ErrorMessage,
    FormikHelpers,
    Field,
    useFormikContext,
} from "formik";
import * as Yup from "yup";
import { Button } from "components/common/Button/Button";
import axios from "axios";
import { useSession } from "next-auth/react";
import { StyledField } from "components/common/StyledField/StyledField";
import { Label } from "components/common/Label/Label";
import useSWR from "swr";
import { Group } from "@prisma/client";
import { CATEGORIES } from "constants/categories";
import { enqueueSnackbar } from "notistack";
import Datepicker from "react-tailwindcss-datepicker";
import { validateAndFixCustomInitialValues } from "./utilts";
import { useRouter } from "next/router";
import {
    Budgets,
    Label as LabelType,
    MoneySplitForm,
} from "components/MoneySplitForm";

export type Expense = {
    title: string;
    amount: number | null;
    type: "expense" | "income";
    date: {
        startDate: Date;
        endDate: Date;
    };
    group: string;
    category: string;
    repeat: boolean;
    split: boolean;
    budget: Budgets;
};

type CreateExpenseFormProps = {
    formType?: "create" | "edit";
    customInitialValues?: Expense;
    expenseId?: string;
};

const DatePickerField = ({
    value,
    onChange,
}: {
    value: any;
    onChange: any;
}) => {
    return (
        <Datepicker
            useRange={false}
            asSingle
            value={value}
            onChange={(val) => {
                onChange("date", val);
            }}
        />
    );
};

const CreateExpenseForm: React.FC<CreateExpenseFormProps> = ({
    customInitialValues,
    formType = "create",
    expenseId,
}) => {
    const router = useRouter();
    const { data: session } = useSession();
    const { data: groups } = useSWR<Group[]>(
        session?.user?.id && `/api/groups/${session?.user?.id}`
    );

    const fixedCustomInitialValues =
        validateAndFixCustomInitialValues(customInitialValues);

    const initialValues: Expense = fixedCustomInitialValues ?? {
        title: "",
        amount: null,
        type: "expense",
        date: { startDate: new Date(), endDate: new Date() },
        group: groups?.[0]?.id ?? "",
        category: "",
        repeat: false,
        split: true,
        budget: {},
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
            await axios[formType === "create" ? "post" : "put"](
                formType === "create"
                    ? "/api/expenses"
                    : `/api/expenses/${expenseId}`,
                {
                    ...values,
                    userId: session?.user.id,
                    groupId: values.group,
                    date: new Date(values.date.startDate),
                    categoryId: values.category,
                    isSplit: values.split,
                    type: values.type,
                    isRepeating: values.repeat,
                    budget: !values.split && values.budget,
                }
            );
            enqueueSnackbar(
                `${values.type} ${
                    formType === "create" ? "added" : "updated"
                } successfully`
            );

            formType === "create"
                ? resetForm()
                : router.push(`/expense/${expenseId}`);
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
            {({ isSubmitting, values, setFieldValue }) => (
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
                        <Label htmlFor="group">Date</Label>
                        <DatePickerField
                            value={values.date}
                            onChange={setFieldValue}
                        />
                    </div>

                    <div>
                        <Label htmlFor="type">Type</Label>
                        <StyledField as="select" id="type" name="type">
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </StyledField>
                    </div>

                    {values.type === "expense" && (
                        <>
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
                            <label className="relative inline-flex cursor-pointer items-center">
                                <Field
                                    type="checkbox"
                                    name="split"
                                    className="peer sr-only"
                                />
                                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Split this expense evenly between all
                                    participants
                                </span>
                            </label>
                            {!values.split && (
                                <MoneySplitForm
                                    limitAmount={values.amount || 0}
                                    state={values.budget}
                                    setState={setFieldValue}
                                />
                            )}
                        </>
                    )}

                    <label className="relative inline-flex cursor-pointer items-center">
                        <Field
                            type="checkbox"
                            name="repeat"
                            className="peer sr-only"
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Repeats monthly
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
