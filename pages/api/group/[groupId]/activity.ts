import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { groupId, category, startDate, endDate, userId, activityType } =
        req.query;

    if (!(typeof groupId === "string")) {
        return res.status(400).json({ error: "Invalid groupId." });
    }

    const filters: Prisma.ActivityWhereInput = {
        group: {
            id: groupId,
        },
    };

    if (typeof category === "string") {
        filters.categoryId = category;
    }

    if (typeof startDate === "string" && typeof endDate === "string") {
        filters.date = {
            gte: new Date(startDate),
            lte: new Date(endDate),
        };
    }

    if (typeof userId === "string") {
        filters.userId = userId;
    }

    if (activityType === "expense" || activityType === "income") {
        filters.type = activityType;
    }

    const result = await client.activity.findMany({
        where: filters,
    });

    res.status(200).json(result);
}
