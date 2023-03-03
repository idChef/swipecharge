import { Header } from "components/common/header/Header";
import { Field, Form, Formik, useFormikContext } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";

type CreateProps = {};

const Create: FunctionComponent<CreateProps> = ({}) => {
    const { data: session } = useSession();
    const router = useRouter();
    const formik = useFormikContext();

    return (
        <div>
            <Header heading="Create group" />
            <Formik
                initialValues={{
                    groupName: "",
                    lastName: "",
                    email: "",
                }}
                onSubmit={async (values, { resetForm }) => {
                    try {
                        const response = await fetch("/api/groups/create", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                groupName: values.groupName,
                                userId: session?.user.id,
                            }),
                        });

                        if (response.ok) {
                            const data = await response.json();
                            router.push(`/groups/${data.id}`);
                        } else {
                            console.error(
                                "Failed to create group:",
                                response.status
                            );
                        }
                    } catch (error) {
                        console.error("Error creating group:", error);
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="mt-4">
                        <div>
                            <label
                                htmlFor="groupName"
                                className="mb-2 block text-sm font-medium text-gray-900"
                            >
                                Group name
                            </label>
                            <Field
                                id="groupName"
                                className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-black bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
                                name="groupName"
                                placeholder=""
                            />
                        </div>

                        <button
                            className="hover:bg-primary-700 focus:ring-primary-300 mt-2 w-full rounded-lg bg-black px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 disabled:bg-gray-500"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Create;
