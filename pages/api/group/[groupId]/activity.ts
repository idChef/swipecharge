import type { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { groupId } = req.query;

    if (!(typeof groupId === "string")) {
        return res.status(400).json({ error: "Invalid groupId." });
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
            },
            users: {
                include: {
                    user: true,
                },
            },
        },
    });

    res.status(200).json(result);
}
