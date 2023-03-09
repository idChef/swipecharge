import { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { activityId, userId } = req.body;

    if (typeof userId !== "string") {
        return res.status(400).json({ error: "Invalid userId." });
    }

    if (typeof activityId !== "string") {
        return res.status(400).json({ error: "Invalid activityId." });
    }

    try {
        const activity = await client.activity.findUnique({
            where: {
                id: activityId,
            },
            include: {
                Bill: true,
            },
        });

        if (!activity) {
            return res.status(400).json({ error: "No activity of this id." });
        }

        const peopleParticipatingInBill = activity?.Bill.filter(
            (bill) => bill.hasParticipated
        );

        const peopleInActivityBill =
            peopleParticipatingInBill.length === 0
                ? 1
                : peopleParticipatingInBill.length + 1;

        const amountPerPerson = activity.amount / peopleInActivityBill;

        await client.bill.create({
            data: {
                activity: {
                    connect: {
                        id: activityId,
                    },
                },
                user: {
                    connect: {
                        id: userId,
                    },
                },
                hasParticipated: true,
                amount: amountPerPerson,
            },
        });

        await client.bill.updateMany({
            where: {
                activityId,
                hasParticipated: true,
            },
            data: {
                amount: amountPerPerson,
            },
        });

        return res.status(200).json({ message: "Bill accepted." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to fetch activities." });
    }
}
