import { Activity, Bill, Group, User, UsersOnGroups } from "@prisma/client";

export type GroupWithExpenseAndUsers = Group & {
    Activity: Activity[];
    users: (UsersOnGroups & {
        user: User;
    })[];
};

export type ActivityWithBillAndGroup = Activity & {
    Bill: Bill[];
    group: Group;
};

export type ActivityWithBill = Activity & {
    Bill: Bill[];
    user: User;
    currentUserBill?: Bill;
};

export type GroupWithUsers = Group & {
    users: (UsersOnGroups & {
        user: User;
    })[];
};

export type GroupWithActivityAndBill = Group & {
    Activity: ActivityWithBill[];
};
