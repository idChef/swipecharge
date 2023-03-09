import type { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    if (!(typeof id === "string")) {
        return res.status(400).json({ error: "Invalid activityId." });
    }

    const result = await client.activity.findUnique({
        where: {
            id: id,
        },
        include: {
            group: true,
            user: true,
            Bill: {
                include: {
                    user: true,
                },
            },
        },
    });

    res.status(200).json(result);
}
