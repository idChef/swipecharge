import { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const { inviteLink } = req.query;

        try {
            const group = await client.group.findUnique({
                where: {
                    inviteLink: inviteLink as string,
                },
                include: {
                    users: true,
                },
            });

            if (!group) {
                return res.status(404).json({ error: "Group not found" });
            }

            return res.status(200).json(group);
        } catch (error) {
            console.error(error);
            return res.status(500).send("Internal Server Error");
        }
    }

    if (req.method === "POST") {
        const { inviteLink, userId } = req.body;

        try {
            const group = await client.group.findUnique({
                where: {
                    inviteLink: inviteLink,
                },
            });

            if (!group) {
                return res.status(404).json({ error: "Group not found" });
            }

            const existingUser = await client.usersOnGroups.findFirst({
                where: {
                    groupId: group.id,
                    userId: userId,
                },
            });

            if (existingUser) {
                return res.status(409).json({ error: "User already in group" });
            }

            const userOnGroup = await client.usersOnGroups.create({
                data: {
                    userId: userId,
                    groupId: group.id,
                },
            });

            return res.status(200).json(userOnGroup);
        } catch (error) {
            console.error(error);
            return res.status(500).send("Internal Server Error");
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
