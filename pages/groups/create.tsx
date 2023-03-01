import { Header } from "components/common/header/Header";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";

type CreateProps = {};

const Create: FunctionComponent<CreateProps> = ({}) => {
    const { data: session } = useSession();
    const router = useRouter();

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
                    await new Promise((r) => setTimeout(r, 500));

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
                            console.log("Group created:", data);
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

                    resetForm();
                }}
            >
                <Form className="mt-4">
                    <div>
                        <label
                            htmlFor="groupName"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Group name
                        </label>
                        <Field
                            id="groupName"
                            className="bg-gray-50 border border-black text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            name="groupName"
                            placeholder=""
                        />
                    </div>

                    <button
                        className="w-full mt-2 text-white bg-black hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        type="submit"
                    >
                        Submit
                    </button>
                </Form>
            </Formik>
        </div>
    );
};

export default Create;
