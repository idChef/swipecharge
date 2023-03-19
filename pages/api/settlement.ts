import { NextApiRequest, NextApiResponse } from "next";
import client from "prisma/prismaclient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;

    switch (method) {
        case "POST":
            const { payerId, payeeId, amount, groupId } = req.body;

            try {
                const newSettlement = await client.settlement.create({
                    data: {
                        payerId,
                        payeeId,
                        amount,
                        groupId,
                    },
                });

                res.status(201).json(newSettlement);
            } catch (error) {
                res.status(500).json({ message: error });
                console.log(error)
            }
            break;

        case "GET":
            const { groupId: queryGroupId } = req.query;
            try {
                const settlements = await client.settlement.findMany({
                    where: { groupId: queryGroupId as string },
                    include: {
                        payer: true,
                        payee: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });
                res.status(200).json(settlements);
            } catch (error) {
                res.status(500).json({ message: error });
            }
            break;

        case "PUT":
            const { id, updateData } = req.body;

            try {
                const updatedSettlement = await client.settlement.update({
                    where: { id },
                    data: updateData,
                });

                res.status(200).json(updatedSettlement);
            } catch (error) {
                res.status(500).json({ message: error });
            }
            break;

        case "DELETE":
            const { settlementId } = req.body;

            try {
                await client.settlement.delete({ where: { id: settlementId } });
                res.status(204).end();
            } catch (error) {
                res.status(500).json({ message: error });
            }
            break;

        default:
            res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default handler;
