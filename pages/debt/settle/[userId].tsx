import { User } from "@prisma/client";
import axios from "axios";
import { Avatar } from "components/common/Avatar/Avatar";
import { Button } from "components/common/Button/Button";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";
import { Formik, Form, Field, ErrorMessage } from "formik";

import useSWR from "swr";
import { amountFormatter } from "utils/formatters";
import { Label } from "components/common/Label/Label";
import { StyledField } from "components/common/StyledField/StyledField";

type RemainingDebt = {
    amountOwed: number;
};

const DebtSettle: NextPage = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const { userId, groupId } = router.query;

    const { data: user, isLoading } = useSWR<User>(`/api/user/${userId}`);
    const { data: debt, isLoading: isLoadingDebt } = useSWR<RemainingDebt>(
        session?.user.id &&
            `/api/balance/${userId}?groupId=${groupId}&targetUserId=${session?.user.id}`
    );

    if (isLoading || isLoadingDebt) {
        return <div>Loading...</div>;
    }

    if (!user || !debt) {
        return <div>Something went wrong</div>;
    }

    const settleDebt = async (values: { amount: number }) => {
        try {
            await axios.post("/api/settlement", {
                payerId: session?.user.id,
                payeeId: userId,
                groupId: groupId as string,
                amount: values.amount,
            });

            enqueueSnackbar("Debt settled", { variant: "success" });
            router.push(`/groups/${groupId}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-full items-center justify-center">
            <Formik
                enableReinitialize
                initialValues={{ amount: debt.amountOwed }}
                onSubmit={(values) => settleDebt(values)}
            >
                {({ errors, touched }) => (
                    <Form className="flex flex-col items-center justify-center gap-2 text-white">
                        <Avatar imgSrc={user?.image || ""} />
                        <span>Settle your debt with {user.name}</span>
                        <span>
                            You owe {amountFormatter(debt.amountOwed)} PLN in
                            total
                        </span>
                        <div className="mt-4 flex flex-col items-center justify-center gap-2">
                            <Label htmlFor="amount">Amount to pay</Label>
                            <div className="currency-input relative">
                                <StyledField
                                    type="number"
                                    name="amount"
                                    step="any"
                                    min={0}
                                    className="currency-input relative w-full rounded-md border border-gray-500 bg-gray-100 px-3 py-2 text-black"
                                />
                            </div>
                            <ErrorMessage
                                name="amount"
                                component="div"
                                className="text-sm text-red-500"
                            />
                        </div>
                        <Button type="submit">Settle custom value</Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default DebtSettle;
