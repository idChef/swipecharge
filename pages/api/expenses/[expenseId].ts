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
    } = req.body as ExpenseRequest;

    try {
        if (req.method === "PUT") {
            const { expenseId } = req.query;

            if (!expenseId) {
                return res.status(400).send("Bad Request: Missing expenseId");
            }

            const activity = await client.activity.update({
                where: {
                    id: expenseId as string,
                },
                data: {
                    title,
                    amount: +amount,
                    type,
                    date,
                    isRepeating,
                    categoryId,
                    isSplit: isSplit,
                },
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
