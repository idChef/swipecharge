import { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

type CreateExpenseRequest = {
    title: string;
    amount: number;
    userId: string;
    date: string;
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
        userId,
        groupId,
        date,
        categoryId,
        isSplit,
        type,
        isRepeating,
    } = req.body as CreateExpenseRequest;

    try {
        const activity = await client.activity.create({
            data: {
                title,
                amount: +amount,
                type,
                date,
                isRepeating,
                categoryId,
                isSplit: isSplit,
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

        return res.status(200).json(activity);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}
