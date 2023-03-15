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

    const userBalances: {
        user: User;
        owes: number;
        owed: number;
    }[] = [];

    // Initialize the userBalances array for all group users, excluding the current user
    groupUsers.forEach((groupUser) => {
        if (groupUser.userId !== userId) {
            userBalances.push({
                user: groupUser.user,
                owes: 0,
                owed: 0,
            });
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
                    const balance = userBalances.find(
                        (balance) => balance.user.id === bill.userId
                    );
                    if (balance) {
                        balance.owed += bill.amount || 0;
                    }
                }
            });
        } else {
            const currentUserBill = billsToPay.find(
                (bill) => bill.userId === userId
            );
            if (currentUserBill) {
                const balance = userBalances.find(
                    (balance) => balance.user.id === payerId
                );
                if (balance) {
                    balance.owes += currentUserBill.amount || 0;
                }
            }
        }
    });

    const filteredUserBalances = userBalances.filter(
        (balance) => balance.owes > 0 || balance.owed > 0
    );

    res.status(200).json(filteredUserBalances);
}

export default handler;
