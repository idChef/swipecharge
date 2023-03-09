import { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { activityId, userId } = req.body;

    if (typeof userId !== "string") {
        return res.status(400).json({ error: "Invalid userId." });
    }

    if (typeof activityId !== "string") {
        return res.status(400).json({ error: "Invalid activityId." });
    }

    try {
        await client.bill.create({
            data: {
                amount: 0,
                activity: {
                    connect: {
                        id: activityId,
                    },
                },
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });

        return res.status(200).json({ message: "Bill declined." });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}
