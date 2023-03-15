import { Icon } from "@iconify/react";
import { Settlement, User } from "@prisma/client";
import { Avatar } from "components/common/Avatar/Avatar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import useSWR from "swr";
import { amountFormatter, formatDateTime } from "utils/formatters";

type SettlementTabProps = {};

type SettlementWithUsers = Settlement & {
    payer: User;
    payee: User;
};

export const SettlementTab: FunctionComponent<SettlementTabProps> = ({}) => {
    const router = useRouter();
    const { groupId } = router.query;

    const { data: settlements, isLoading } = useSWR<SettlementWithUsers[]>(
        `/api/settlement?groupId=${groupId}`
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!settlements) {
        return <div>Something went wrong</div>;
    }

    return (
        <div>
            <div className="mt-2 flex flex-col gap-4">
                {settlements.map((settlement) => (
                    <div
                        key={settlement.id}
                        className="flex items-center justify-center gap-2 rounded-md bg-black/60 p-4 text-white"
                    >
                        <div className="flex w-40 flex-col items-center gap-2 text-center">
                            <Avatar imgSrc={settlement.payer.image || ""} />
                            <span className="text-sm">
                                {settlement.payer.name}
                            </span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-center">
                                {amountFormatter(settlement.amount)} PLN
                            </p>
                            <Icon
                                icon="material-symbols:keyboard-double-arrow-right"
                                width={48}
                            />
                            <p className="text-center">
                                {formatDateTime(settlement.createdAt)}
                            </p>
                        </div>
                        <div className="flex w-40 flex-col items-center gap-2 text-center">
                            <Avatar imgSrc={settlement.payee.image || ""} />
                            <span className="text-sm">
                                {settlement.payee.name}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
