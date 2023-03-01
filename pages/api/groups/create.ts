import { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

type CreateGroupRequest = {
    groupName: string;
    userId: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { groupName, userId } = req.body as CreateGroupRequest;

    try {
        const group = await client.group.create({
            data: {
                name: groupName,
                users: {
                    create: {
                        userId: userId,
                    },
                },
            },
            include: {
                users: true,
            },
        });

        return res.status(200).json(group);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}
