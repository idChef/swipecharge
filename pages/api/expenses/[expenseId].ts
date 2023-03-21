import { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

type ExpenseRequest = {
    title: string;
    amount: number;
    userId: string;
    date: Date;
    groupId: string;
    categoryId: string;
    isSplit: boolean;
    type: "expense" | "income";
    isRepeating: boolean;
    budget?: Record<string, number>;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        title,
        amount,
        groupId,
        date,
        categoryId,
        isSplit,
        type,
        isRepeating,
        budget,
    } = req.body as ExpenseRequest;

    try {
        if (req.method === "PUT") {
            const { expenseId } = req.query;

            if (!expenseId) {
                return res.status(400).send("Bad Request: Missing expenseId");
            }

            const activityData = await client.activity.findUnique({
                where: {
                    id: expenseId as string,
                },
                include: {
                    Bill: true,
                },
            });

            let updateData: any = {
                title,
                amount: +amount,
                type,
                date,
                isRepeating,
                categoryId,
                isSplit: isSplit,
            };

            if (budget && activityData) {
                const entries = Object.entries(budget);
                const data = entries.map(([key, val]) => {
                    const bill = activityData.Bill.find(
                        (b) => b.userId === key
                    );
                    const billId = bill ? bill.id : undefined;
                    return {
                        id: billId,
                        userId: key,
                        amount: val,
                        hasParticipated: true,
                    };
                });

                updateData.Bill = {
                    upsert: data.map((billData: any) => ({
                        where: { id: billData.id },
                        update: { amount: billData.amount },
                        create: {
                            ...billData,
                        },
                    })),
                };
            }

            const activity = await client.activity.update({
                where: {
                    id: expenseId as string,
                },
                data: updateData,
            });

            return res.status(200).json(activity);
        } else {
            res.setHeader("Allow", ["POST", "PUT"]);
            return res.status(405).send(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}
