import { Button } from "components/common/Button/Button";
import type { NextPage } from "next";
import { signIn } from "next-auth/react";

const Login: NextPage = () => {
    return (
        <div className="flex h-full flex-col">
            <div className="mt-auto mb-8 flex flex-col gap-8">
                <div>
                    <p className="text-4xl dark:text-white">Manage income</p>
                    <p className="text-4xl dark:text-white">Track expenses</p>
                    <p className="text-4xl dark:text-white">Split bills</p>
                    <p className="text-4xl text-blue-700 dark:text-blue-400">
                        Anywhere.
                    </p>
                </div>
                <Button
                    primary
                    onClick={() => signIn(undefined, { callbackUrl: "/" })}
                >
                    Login
                </Button>
            </div>
        </div>
    );
};

export default Login;
