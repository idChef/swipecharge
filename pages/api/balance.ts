// pages/api/balance.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId, groupId } = req.query;

    if (!userId || !groupId) {
        res.status(400).json({ error: "User ID and Group ID are required" });
        return;
    }

    const groupUsers = await prisma.usersOnGroups.findMany({
        where: { groupId: groupId as string },
        include: { user: true },
    });

    const groupActivities = await prisma.activity.findMany({
        where: { groupId: groupId as string, type: "expense" },
        include: { Bill: true },
    });

    const balances: {
        [key: string]: {
            user: User;
            owes: number;
            owed: number;
        };
    } = {};

    // Initialize the balances object for all group users, excluding the current user
    groupUsers.forEach((groupUser) => {
        if (groupUser.userId !== userId) {
            balances[groupUser.userId] = {
                user: groupUser.user,
                owes: 0,
                owed: 0,
            };
        }
    });

    groupActivities.forEach((activity) => {
        const payerId = activity.userId;
        const billsToPay = activity.Bill.filter(
            (bill) => bill.hasParticipated && !bill.isPaid
        );

        if (payerId === userId) {
            billsToPay.forEach((bill) => {
                if (bill.userId !== userId) {
                    balances[bill.userId].owed += bill.amount || 0;
                }
            });
        } else {
            const currentUserBill = billsToPay.find(
                (bill) => bill.userId === userId
            );
            if (currentUserBill) {
                balances[payerId].owes += currentUserBill.amount || 0;
            }
        }
    });

    res.status(200).json(balances);
}

export default handler;
