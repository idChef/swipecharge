import { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId } = req.query;

    if (typeof userId !== "string") {
        return res.status(400).json({ error: "Invalid userId." });
    }

    try {
        const activities = await client.activity.findMany({
            where: {
                Bill: {
                    none: {
                        userId,
                    },
                },
                isSplit: true,
                group: {
                    users: {
                        some: {
                            userId,
                        },
                    },
                },
            },
            include: {
                group: true,
                user: true,
                Bill: true,
            },
        });

        res.status(200).json(activities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to fetch activities." });
    }
}
