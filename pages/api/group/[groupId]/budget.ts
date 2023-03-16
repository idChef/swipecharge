import type { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        method,
        query: { groupId },
    } = req;

    if (typeof groupId !== "string") {
        res.status(400).json({ error: "groupId is not a string" });
        return;
    }

    switch (method) {
        case "GET":
            const budgets = await client.budget.findMany({
                where: {
                    groupId: groupId,
                },
            });

            res.status(200).json(budgets);

            break;
        case "POST":
            const createdBudget = await client.budget.create({
                data: {
                    ...req.body,
                    yearAndMonth: new Date(req.body.yearAndMonth),
                    restrictions: {
                        create: req.body.restrictions,
                    },
                },
            });
            res.status(201).json(createdBudget);
            break;
        case "PUT":
            const id = req.body.id;
            const updatedBudget = await client.budget.update({
                where: { id },
                data: {
                    ...req.body,
                    yearAndMonth: new Date(req.body.yearAndMonth),
                    restrictions: {
                        set: req.body.restrictions,
                    },
                },
            });
            res.status(200).json(updatedBudget);
            break;
        case "DELETE":
            const deletedBudget = await client.budget.delete({
                where: { id: req.body.id },
            });
            res.status(200).json(deletedBudget);
            break;
        default:
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
