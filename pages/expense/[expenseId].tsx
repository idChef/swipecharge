import { Button } from "components/common/Button/Button";
import { Header } from "components/common/header/Header";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";
import { amountFormatter } from "utils/formatters";

const Expense: NextPage = () => {
    const router = useRouter();
    const { expenseId } = router.query;

    const { data } = useSWR(`/api/activities/${expenseId}`);

    if (!data) return null;

    return (
        <div>
            <Header heading={data.title} />

            <p className="text-center dark:text-white">
                Bill in <span className="font-medium">{data.group.name}</span>
            </p>
            <div className="flex items-center gap-2">
                <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-white dark:ring-neutral-900">
                    <Image
                        src={data.user.image || ""}
                        alt={data.user.name || ""}
                        fill
                    />
                </div>
                <p className="dark:text-white">
                    <span className="font-medium">{data.user.name}</span> paid{" "}
                    <span className="font-medium">
                        {amountFormatter(data.amount)}
                    </span>{" "}
                    PLN
                </p>
            </div>
            <div className="ml-2 mt-5 flex flex-col">
                {data.Bill.map((bill: any) => (
                    <div className="flex items-center gap-2" key={bill.id}>
                        <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white dark:ring-neutral-900">
                            <Image
                                src={bill.user.image || ""}
                                alt={bill.user.name || ""}
                                fill
                            />
                        </div>
                        <p className="dark:text-white">
                            <span className="font-medium">
                                {bill.user.name}
                            </span>{" "}
                            owes{" "}
                            <span className="font-medium">
                                {amountFormatter(bill.amount) || 0}
                            </span>{" "}
                            PLN
                        </p>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex gap-4">
                <Button>Edit</Button>
                <Button>Delete</Button>
            </div>
        </div>
    );
};

export default Expense;
