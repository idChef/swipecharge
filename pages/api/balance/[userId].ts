// pages/api/user-balance.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId, targetUserId, groupId } = req.query;

    if (!userId || !targetUserId || !groupId) {
        res.status(400).json({ error: "User ID, Target User ID, and Group ID are required" });
        return;
    }

    const groupActivities = await prisma.activity.findMany({
        where: { groupId: groupId as string, type: "expense" },
        include: { Bill: true },
    });

    const groupSettlements = await prisma.settlement.findMany({
        where: { groupId: groupId as string },
    });

    let netBalance = 0;

    groupActivities.forEach((activity) => {
        const payerId = activity.userId;
        const billsToPay = activity.Bill.filter(
            (bill) => bill.hasParticipated && !bill.isPaid
        );

        if (payerId === userId) {
            const targetUserBill = billsToPay.find(
                (bill) => bill.userId === targetUserId
            );
            if (targetUserBill) {
                netBalance += targetUserBill.amount || 0;
            }
        } else if (payerId === targetUserId) {
            const currentUserBill = billsToPay.find(
                (bill) => bill.userId === userId
            );
            if (currentUserBill) {
                netBalance -= currentUserBill.amount || 0;
            }
        }
    });

    groupSettlements.forEach((settlement) => {
        if (settlement.payerId === userId && settlement.payeeId === targetUserId) {
            netBalance += settlement.amount || 0;
        } else if (settlement.payerId === targetUserId && settlement.payeeId === userId) {
            netBalance -= settlement.amount || 0;
        }
    });

    res.status(200).json({ amountOwed: netBalance });
}

export default handler;
