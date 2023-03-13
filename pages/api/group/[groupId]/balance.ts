import { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const groupId = req.query.groupId;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    if (!(typeof groupId === "string")) {
        return res.status(400).json({ error: "Invalid groupId." });
    }

    const expenseQuery = await client.activity.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            groupId,
            type: "expense",
            createdAt: {
                gte: startOfMonth,
                lte: endOfMonth,
            },
        },
    });

    const incomeQuery = await client.activity.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            groupId,
            type: "income",
            createdAt: {
                gte: startOfMonth,
                lte: endOfMonth,
            },
        },
    });

    const balance = {
        currentBalance:
            (incomeQuery._sum.amount || 0) - (expenseQuery._sum.amount || 0),
        incomeThisMonth: incomeQuery._sum.amount || 0,
        spendingsThisMonth: expenseQuery._sum.amount || 0,
    };

    res.status(200).json(balance);
}
