import { User } from "@prisma/client";
import { Avatar } from "components/common/Avatar/Avatar";
import { Button } from "components/common/Button/Button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import useSWR from "swr";
import { amountFormatter } from "utils/formatters";

type DebtTabProps = {};

type balance = {
    user: User;
    netBalance: number;
};

export const DebtTab: FunctionComponent<DebtTabProps> = ({}) => {
    const router = useRouter();
    const { groupId } = router.query;

    const { data: session } = useSession();

    const { data: balance, isLoading } = useSWR<balance[]>(
        `/api/balance?userId=${session?.user?.id}&groupId=${groupId}`
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!balance) {
        return <div>Something went wrong</div>;
    }

    return (
        <div className="mt-4 flex flex-col gap-4 ">
            {balance.map((balanceItem) => (
                <div
                    key={balanceItem.user.id}
                    className="flex justify-between rounded-md bg-black/70 p-4 text-white"
                >
                    <div className="flex w-32 flex-col items-center gap-2 text-center">
                        <Avatar imgSrc={balanceItem.user.image || ""} />
                        <p>{balanceItem.user.name}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">
                        {balanceItem.netBalance > 0 ? (
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-center">
                                    Owes you{" "}
                                    {amountFormatter(balanceItem.netBalance)}{" "}
                                    PLN
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col items-center justify-center">
                                    <p className="text-center">
                                        You owe{" "}
                                        {amountFormatter(
                                            Math.abs(balanceItem.netBalance)
                                        )}{" "}
                                        PLN
                                    </p>
                                </div>
                                <Button
                                    className="rounded bg-white px-2 py-1 text-black disabled:bg-white/50 disabled:text-black/70"
                                    disabled={!balanceItem.user.blikNumber}
                                    onClick={() =>
                                        router.push(
                                            `/debt/settle/${balanceItem.user.id}?groupId=${groupId}`
                                        )
                                    }
                                >
                                    Settle debt
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
