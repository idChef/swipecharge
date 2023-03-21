import type { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { groupId, userId } = req.query;

    if (!(typeof groupId === "string")) {
        return res.status(400).json({ error: "Invalid groupId." });
    }

    if (!(typeof userId === "string")) {
        return res.status(400).json({ error: "Invalid userId." });
    }

    const result = await client.group.findUnique({
        where: {
            id: groupId,
        },
        include: {
            Activity: {
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    Bill: true,
                    user: true,
                },
                where: {
                    type: "expense",
                },
            },
            users: {
                include: {
                    user: true,
                },
            },
        },
    });

    if (!result) {
        return res.status(404).json({ error: "No activity of this id." });
    }

    const updatedResult = { ...result };

    updatedResult.Activity = updatedResult.Activity.map((activity) => {
        const currentUserBill = activity.Bill.find(
            (bill) => bill.userId === userId
        );
        return { ...activity, currentUserBill };
    });

    res.status(200).json(updatedResult);
}
