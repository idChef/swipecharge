import { User } from "@prisma/client";
import axios from "axios";
import { Avatar } from "components/common/Avatar/Avatar";
import { Button } from "components/common/Button/Button";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";

import useSWR from "swr";
import { amountFormatter } from "utils/formatters";

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

    const settleDebt = async () => {
        try {
            await axios.post("/api/settlement", {
                payerId: session?.user.id,
                payeeId: userId,
                groupId: groupId as string,
                amount: debt.amountOwed,
            });

            enqueueSnackbar("Debt settled", { variant: "success" });
            router.push(`/groups/${groupId}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-2 text-white">
                <Avatar imgSrc={user?.image || ""} />
                <span>Settle your debt with {user.name}</span>
                <span>You owe {amountFormatter(debt.amountOwed)} PLN</span>
                <Button onClick={settleDebt}>Settle whole debt</Button>
                <Button disabled>Settle custom value</Button>
            </div>
        </div>
    );
};

export default DebtSettle;
