import { faker } from "@faker-js/faker";
import client from "./prismaclient";

export const CATEGORIES = [
    {
        id: "food",
        name: "Food",
        icon: "fluent:food-pizza-20-filled",
    },
    {
        id: "housing",
        name: "Housing",
        icon: "fa6-solid:house-chimney",
    },
    {
        id: "transportation",
        name: "Transportation",
        icon: "material-symbols:directions-car",
    },
    {
        id: "entertainment",
        name: "Entertainment",
        icon: "ion:game-controller",
    },
    { id: "shopping", name: "Shopping", icon: "mdi:cart" },
    {
        id: "healthcare",
        name: "Healthcare",
        icon: "mdi:heart",
    },
    { id: "other", name: "Other", icon: "mdi:help" },
];

async function main() {
    const users = [];
    const groups = [];
    const activities = [];

    // Create 10 random users
    for (let i = 0; i < 10; i++) {
        const user = await client.user.create({
            data: {
                name: faker.name.findName(),
                email: faker.internet.email(),
                image: faker.image.avatar(),
            },
        });
        users.push(user);
    }

    // Create 5 random groups
    for (let i = 0; i < 5; i++) {
        const group = await client.group.create({
            data: {
                name: faker.company.companyName(),
                inviteLink: faker.datatype.uuid(),
            },
        });
        groups.push(group);
    }

    // Create Activities
    for (let i = 0; i < 50; i++) {
        const userIndex = faker.datatype.number({ min: 0, max: 9 });
        const groupIndex = faker.datatype.number({ min: 0, max: 4 });
        const categoryIndex = faker.datatype.number({ min: 0, max: 4 });
        const isSplit = faker.datatype.boolean();

        const activity = await client.activity.create({
            data: {
                title: faker.commerce.product(),
                amount: faker.datatype.number({
                    min: 1,
                    max: 1000,
                    precision: 0.01,
                }),
                type: faker.helpers.arrayElement(["income", "expense"]),
                date: faker.date.past(),
                userId: users[userIndex].id,
                groupId: groups[groupIndex].id,
                categoryId: CATEGORIES[categoryIndex].id,
                isSplit: isSplit,
                isRepeating: faker.datatype.boolean(),
            },
        });

        if (isSplit) {
            const numberOfBills = faker.datatype.number({ min: 2, max: 5 });
            const totalAmount = activity.amount;
            let remainingAmount = totalAmount;
            const billUsers: number[] = [];

            for (let j = 0; j < numberOfBills - 1; j++) {
                let billUserIndex = faker.datatype.number({ min: 0, max: 9 });
                while (billUsers.includes(billUserIndex)) {
                    billUserIndex = faker.datatype.number({ min: 0, max: 9 });
                }
                billUsers.push(billUserIndex);

                const billAmount = faker.datatype.number({
                    min: 1,
                    max: remainingAmount - 1,
                    precision: 0.01,
                });
                remainingAmount -= billAmount;

                await client.bill.create({
                    data: {
                        amount: billAmount,
                        isPaid: faker.datatype.boolean(),
                        hasParticipated: faker.datatype.boolean(),
                        activityId: activity.id,
                        userId: users[billUserIndex].id,
                    },
                });
            }

            let lastBillUserIndex = faker.datatype.number({ min: 0, max: 9 });
            while (billUsers.includes(lastBillUserIndex)) {
                lastBillUserIndex = faker.datatype.number({ min: 0, max: 9 });
            }

            await client.bill.create({
                data: {
                    amount: remainingAmount,
                    isPaid: faker.datatype.boolean(),
                    hasParticipated: faker.datatype.boolean(),
                    activityId: activity.id,
                    userId: users[lastBillUserIndex].id,
                },
            });
        }
    }

    // Add users to groups randomly

    // Create UsersOnGroups
    for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
        for (let userIndex = 0; userIndex < users.length; userIndex++) {
            await client.usersOnGroups.create({
                data: {
                    userId: users[userIndex].id,
                    groupId: groups[groupIndex].id,
                },
            });
        }
    }

    // Create 30 random settlements
    const settlements = [];

    for (let i = 0; i < 30; i++) {
        settlements.push({
            payerId: faker.helpers.arrayElement(users).id,
            payeeId: faker.helpers.arrayElement(users).id,
            amount: parseFloat(faker.finance.amount(1, 200, 2)),
            groupId: faker.helpers.arrayElement(groups).id,
        });
    }

    await client.settlement.createMany({ data: settlements });

    console.log("Created users:", users.length);
    console.log("Created groups:", groups.length);
    console.log("Created activities:", activities.length);
    console.log("Created settlements:", settlements.length);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await client.$disconnect();
    });
