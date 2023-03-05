import { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

type CreateExpenseRequest = {
    title: string;
    amount: number;
    userId: string;
    groupId: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { title, amount, userId, groupId } = req.body as CreateExpenseRequest;

    try {
        const expense = await client.activity.create({
            data: {
                title,
                amount: +amount,
                type: "expense",
                group: {
                    connect: {
                        id: groupId,
                    },
                },
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });

        return res.status(200).json(expense);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}
