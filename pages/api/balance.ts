// pages/api/balance.ts
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@prisma/client";
import client from "prisma/prismaclient";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId, groupId } = req.query;

    if (!userId || !groupId) {
        res.status(400).json({ error: "User ID and Group ID are required" });
        return;
    }

    const groupUsers = await client.usersOnGroups.findMany({
        where: { groupId: groupId as string },
        include: { user: true },
    });

    const groupActivities = await client.activity.findMany({
        where: { groupId: groupId as string, type: "expense" },
        include: { Bill: true },
    });

    const groupSettlements = await client.settlement.findMany({
        where: { groupId: groupId as string },
    });

    const userBalances: {
        user: User;
        netBalance: number;
    }[] = [];

    // Initialize the userBalances array for all group users, excluding the current user
    groupUsers.forEach((groupUser) => {
        if (groupUser.userId !== userId) {
            userBalances.push({
                user: groupUser.user,
                netBalance: 0,
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
                        balance.netBalance += bill.amount || 0;
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
                    balance.netBalance -= currentUserBill.amount || 0;
                }
            }
        }
    });

    groupSettlements.forEach((settlement) => {
        if (settlement.payerId === userId) {
            const balance = userBalances.find(
                (balance) => balance.user.id === settlement.payeeId
            );
            if (balance) {
                balance.netBalance += settlement.amount || 0;
            }
        } else if (settlement.payeeId === userId) {
            const balance = userBalances.find(
                (balance) => balance.user.id === settlement.payerId
            );
            if (balance) {
                balance.netBalance -= settlement.amount || 0;
            }
        }
    });

    const filteredUserBalances = userBalances.filter(
        (balance) => balance.netBalance !== 0
    );

    res.status(200).json(filteredUserBalances);
}

export default handler;
