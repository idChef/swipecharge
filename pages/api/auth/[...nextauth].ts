import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import prisma from "prisma/prismaclient";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID || "",
            clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
        }),
    ],
};
export default NextAuth(authOptions);
