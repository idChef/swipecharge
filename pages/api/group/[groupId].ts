import type { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { groupId } = req.query;

    if (!(typeof groupId === "string")) {
        return;
    }

    const result = await client.group.findUnique({
        where: {
            id: groupId,
        },
    });

    const usersInGroup = await client.user.findMany({
        where: {
            groups: {
                some: {
                    group: {
                        id: groupId,
                    },
                },
            },
        },
    });

    const groupAndUsers = {
        ...result,
        users: usersInGroup,
    };

    console.log(groupAndUsers);

    res.status(200).json(groupAndUsers);
}
