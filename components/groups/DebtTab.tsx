import { User } from "@prisma/client";
import { Avatar } from "components/common/Avatar/Avatar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import useSWR from "swr";
import { amountFormatter } from "utils/formatters";

type DebtTabProps = {};

type balance = {
    user: User;
    owes: number;
    owed: number;
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
                    {balanceItem.owed > 0 && (
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-center">
                                Owes you {amountFormatter(balanceItem.owed)} PLN
                            </p>
                        </div>
                    )}
                    {balanceItem.owes > 0 && (
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-center">
                                You owe {amountFormatter(balanceItem.owes)} PLN
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
