// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId } = req.query;

    if (!(typeof userId === "string")) {
        return;
    }

    const result = await client.group.findMany({
        where: {
            users: {
                some: {
                    user: {
                        id: userId,
                    },
                },
            },
        },
    });

    res.status(200).json(result);
}
