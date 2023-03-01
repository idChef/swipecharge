import Head from "next/head";
import { Inter } from "@next/font/google";
import LoginButton from "../components/auth/LoginButton";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import type { Group } from "@prisma/client";
import { Header } from "components/common/header/Header";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const { data: session } = useSession();

    const { data: groups } = useSWR<Group[]>(
        session?.user?.id && `/api/groups/${session?.user?.id}`
    );

    return (
        <>
            <Head>
                <title>SwipeCharge</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header heading="Dashboard" showBack={false} />
            <LoginButton />
        </>
    );
}
