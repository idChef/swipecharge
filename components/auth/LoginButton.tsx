import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
    const { data: session } = useSession();
    if (session && session.user) {
        return (
            <>
                Signed in as {session.user.name} <br />
                <button
                    className="border rounded px-4 py-2"
                    onClick={() => signOut()}
                >
                    Sign out
                </button>
            </>
        );
    }
    return (
        <>
            Not signed in <br />
            <button
                className="border rounded px-4 py-2"
                onClick={() => signIn()}
            >
                Sign in
            </button>
        </>
    );
}
