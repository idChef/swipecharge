import { Formik, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "components/common/Button/Button";
import axios from "axios";
import { useSession } from "next-auth/react";
import { StyledField } from "components/common/StyledField/StyledField";
import { Label } from "components/common/Label/Label";
import useSWR from "swr";
import { Group } from "@prisma/client";
import { CATEGORIES } from "constants/categories";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

export type Budget = {
    yearAndMonth: Date;
    restrictions: Array<{
        categoryId: string;
        amount: number | null;
    }>;
};

const CreateBudgetForm: React.FC = () => {
    const router = useRouter();
    const { groupId } = router.query;
    const { data: session } = useSession();
    const { enqueueSnackbar } = useSnackbar();

    const initialValues: Budget = {
        yearAndMonth: new Date(),
        restrictions: [
            {
                categoryId: "",
                amount: 0,
            },
        ],
    };

    const validationSchema = Yup.object({
        yearAndMonth: Yup.date().required("Required"),
        restrictions: Yup.array().of(
            Yup.object().shape({
                categoryId: Yup.string().required("Required"),
                amount: Yup.number()
                    .typeError("Must be a number")
                    .required("Required"),
            })
        ),
    });

    const handleSubmit = async (
        values: Budget,
        { resetForm }: FormikHelpers<Budget>
    ) => {
        try {
            await axios.post(`/api/group/${groupId}/budget`, {
                ...values,
                groupId: groupId,
                yearAndMonth: new Date(values.yearAndMonth),
                restrictions: values.restrictions,
                userId: session?.user.id,
            });

            resetForm();
            enqueueSnackbar("Budget created", { variant: "success" });
            router.push(`/groups/${groupId}`);
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Something went wrong", { variant: "error" });
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, values, setFieldValue, errors }) => (
                <Form className="flex flex-col gap-4">
                    <div>
                        <Label htmlFor="yearAndMonth">Month</Label>
                        <StyledField
                            type="month"
                            id="yearAndMonth"
                            name="yearAndMonth"
                        />
                    </div>

                    {values.restrictions.map((restriction, index) => (
                        <div key={index}>
                            <Label htmlFor={`restrictions.${index}.categoryId`}>
                                Category
                            </Label>
                            <StyledField
                                as="select"
                                id={`restrictions.${index}.categoryId`}
                                name={`restrictions.${index}.categoryId`}
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

                            <Label htmlFor={`restrictions.${index}.amount`}>
                                Amount
                            </Label>
                            <StyledField
                                type="number"
                                id={`restrictions.${index}.amount`}
                                name={`restrictions.${index}.amount`}
                            />
                            <ErrorMessage
                                className="text-red-500"
                                name={`restrictions.${index}.amount`}
                                component="div"
                            />
                            {index > 0 && (
                                <Button
                                    color="error"
                                    type="button"
                                    onClick={() => {
                                        const newRestrictions =
                                            values.restrictions.slice();
                                        newRestrictions.splice(index, 1);
                                        setFieldValue(
                                            "restrictions",
                                            newRestrictions
                                        );
                                    }}
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                    ))}

                    <Button
                        type="button"
                        onClick={() => {
                            setFieldValue("restrictions", [
                                ...values.restrictions,
                                { categoryId: "", amount: 0 },
                            ]);
                        }}
                    >
                        Add restriction
                    </Button>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default CreateBudgetForm;
