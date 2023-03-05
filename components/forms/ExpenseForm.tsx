import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
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
    const [submitting, setSubmitting] = useState(false);
    const { data: session } = useSession();

    const { data: groups } = useSWR<Group[]>(
        session?.user?.id && `/api/groups/${session?.user?.id}`
    );

    const initialValues: Expense = {
        title: "",
        amount: "",
        group: groups?.[0]?.id ?? "",
        category: "",
    };

    const validationSchema = Yup.object({
        title: Yup.string().required("Required"),
        amount: Yup.number().typeError("Must be a number").required("Required"),
    });

    const handleSubmit = async (values: Expense) => {
        if (!session?.user.id) {
            return;
        }

        setSubmitting(true);
        try {
            axios.post("/api/expenses", {
                ...values,
                userId: session?.user.id,
                groupId: values.group,
                categoryId: values.category,
            });
            setSubmitting(false);
        } catch (error) {
            console.error(error);
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({ isSubmitting }) => (
                <Form>
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

                    <Button type="submit" disabled={isSubmitting || submitting}>
                        {submitting ? "Submitting..." : "Submit"}
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default CreateExpenseForm;
