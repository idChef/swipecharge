import { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId, blikNumber } = req.body;

    if (typeof userId !== "string") {
        return res.status(400).json({ error: "Invalid userId." });
    }

    if (typeof blikNumber !== "string") {
        return res.status(400).json({ error: "Invalid blikNumber." });
    }

    try {
        const updatedProfile = await client.user.update({
            where: {
                id: userId,
            },
            data: {
                blikNumber,
            },
        });

        return res.status(200).json(updatedProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to update profile." });
    }
}
