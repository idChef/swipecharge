import { User } from "@prisma/client";
import axios from "axios";
import { Button } from "components/common/Button/Button";
import { Header } from "components/common/header/Header";
import { Label } from "components/common/Label/Label";
import { StyledField } from "components/common/StyledField/StyledField";
import { Form, Formik } from "formik";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";

import useSWR from "swr";

const Profile: NextPage = () => {
    const { data: session } = useSession();

    const { data: user } = useSWR<User>(
        session?.user?.id && `/api/profile/${session?.user?.id}`
    );
    const initialValues = {
        blik: user?.blikNumber,
    };

    const handleSubmit = async (values: any) => {
        if (!session?.user.id) {
            return;
        }

        try {
            await axios.put("/api/profile/blik", {
                blikNumber: values.blik,
                userId: session?.user.id,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Header heading="Profile" showBack={false} />
            <div className="my-4 mt-8 flex flex-col items-center justify-center">
                <div className="relative h-20 w-20 overflow-hidden rounded-full">
                    {session && (
                        <Image
                            src={session?.user.image || ""}
                            alt={session?.user.name || ""}
                            fill
                        />
                    )}
                </div>
                <h2 className="mt-2 text-lg font-medium dark:text-white">
                    {session?.user.name}
                </h2>
                <span className="dark:text-neutral-300">
                    {session?.user.email}
                </span>
            </div>
            <div className="mt-20">
                <h2 className="text-lg dark:text-white">Setup BLIK payments</h2>
                <span className="text-neutral-300">
                    Set up your BLIK number to receive payments from other
                    users.
                </span>
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mt-4">
                                <Label htmlFor="blik">BLIK Number</Label>
                                <StyledField type="tel" id="blik" name="blik" />
                            </div>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Profile;
