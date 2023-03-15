// pages/api/netOwedByTargetUser.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId, groupId, targetUserId } = req.query;

    if (!userId || !groupId || !targetUserId) {
        res.status(400).json({
            error: "User ID, Group ID, and Target User ID are required",
        });
        return;
    }

    const groupActivities = await prisma.activity.findMany({
        where: { groupId: groupId as string, type: "expense" },
        include: { Bill: true },
    });

    let amountOwedByTarget = 0;
    let amountOwedToTarget = 0;

    groupActivities.forEach((activity) => {
        if (activity.userId === userId) {
            const targetUserBill = activity.Bill.find(
                (bill) =>
                    bill.userId === targetUserId &&
                    bill.hasParticipated &&
                    !bill.isPaid
            );
            if (targetUserBill) {
                amountOwedByTarget += targetUserBill.amount || 0;
            }
        } else if (activity.userId === targetUserId) {
            const currentUserBill = activity.Bill.find(
                (bill) =>
                    bill.userId === userId &&
                    bill.hasParticipated &&
                    !bill.isPaid
            );
            if (currentUserBill) {
                amountOwedToTarget += currentUserBill.amount || 0;
            }
        }
    });

    const amountOwed = amountOwedByTarget - amountOwedToTarget;

    res.status(200).json({ amountOwed });
}

export default handler;
