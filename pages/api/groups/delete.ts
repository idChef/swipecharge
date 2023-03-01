import { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    const { id } = req.body;

    // TODO: Check if user is authorized to delete this group (if it is the creator of the group)
    // TODO: Create endpoints in one file and read the method -> act accordingly

    try {
        await client.group.delete({
            where: { id: String(id) },
            include: {
                users: true,
            },
        });

        return res.status(204).send("");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}
