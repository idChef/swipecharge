import { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const {
            groupId,
            statsStartDate,
            statsEndDate,
            compareStartDate,
            compareEndDate,
        } = req.query;

        if (typeof groupId !== "string") {
            return res.status(400).json({ error: "Invalid groupId." });
        }

        if (
            typeof statsStartDate !== "string" ||
            typeof statsEndDate !== "string" ||
            typeof compareStartDate !== "string" ||
            typeof compareEndDate !== "string"
        ) {
            return res.status(400).json({ error: "Dates are invalid" });
        }

        const baseFlow = await client.activity.groupBy({
            by: ["type"],
            _sum: {
                amount: true,
            },
            where: {
                groupId,
                date: {
                    gte: new Date(statsStartDate),
                    lte: new Date(statsEndDate),
                },
            },
        });

        const compareFlow = await client.activity.groupBy({
            by: ["type"],
            _sum: {
                amount: true,
            },
            where: {
                groupId,
                date: {
                    gte: new Date(compareStartDate),
                    lte: new Date(compareEndDate),
                },
            },
        });

        const baseFlowReturn = {
            startDate: statsStartDate,
            endDate: statsEndDate,
        };

        baseFlow.forEach((flow) => {
            baseFlowReturn[flow.type] = flow._sum.amount;
        });

        const compareFlowReturn = {
            startDate: compareStartDate,
            endDate: compareEndDate,
        };

        compareFlow.forEach((flow) => {
            compareFlowReturn[flow.type] = flow._sum.amount;
        });

        res.status(200).json([baseFlowReturn, compareFlowReturn]);
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
