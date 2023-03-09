import { Activity, Bill, Group, User, UsersOnGroups } from "@prisma/client";

export type GroupWithExpenseAndUsers = Group & {
    Activity: Activity[];
    users: (UsersOnGroups & {
        user: User;
    })[];
};

export type ActivityWithBill = Activity & {
    Bill: Bill[];
    user: User;
    currentUserBill?: Bill;
};

export type GroupWithActivityAndBill = Group & {
    Activity: ActivityWithBill[];
};
