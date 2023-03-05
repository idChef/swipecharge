import { Button } from "components/common/Button/Button";
import type { NextPage } from "next";
import { signOut } from "next-auth/react";

const Settings: NextPage = () => {
    return (
        <div>
            <Button onClick={() => signOut({callbackUrl: "/"})}>Log out</Button>
        </div>
    );
};

export default Settings;
