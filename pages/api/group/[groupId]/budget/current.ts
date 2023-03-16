import type { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        method,
        query: { groupId, currentMonth },
    } = req;

    if (typeof groupId !== "string") {
        res.status(400).json({ error: "groupId is not a string" });
        return;
    }

    switch (method) {
        case "GET":
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonthNumber = currentDate.getMonth();
            const startOfMonth = new Date(currentYear, currentMonthNumber, 1);
            const endOfMonth = new Date(currentYear, currentMonthNumber + 1, 0);

            const whereCondition =
                currentMonth === "true"
                    ? {
                          groupId: groupId,
                          yearAndMonth: {
                              gte: startOfMonth,
                              lte: endOfMonth,
                          },
                      }
                    : {
                          groupId: groupId,
                      };

            const budgets = await client.budget.findMany({
                where: whereCondition,
                include: {
                    restrictions: true,
                    user: true,
                },
            });

            res.status(200).json(budgets);

            break;

        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
