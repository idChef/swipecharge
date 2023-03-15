import type { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId } = req.query;

    if (!(typeof userId === "string")) {
        return res.status(400).json({ error: "Invalid userId." });
    }

    const result = await client.user.findUnique({
        where: {
            id: userId,
        },
    });

    res.status(200).json(result);
}
