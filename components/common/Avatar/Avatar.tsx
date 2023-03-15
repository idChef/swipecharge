import Image from "next/image";
import { FunctionComponent } from "react";

type AvatarProps = {
    imgSrc: string;
    imgAlt?: string;
};

export const Avatar: FunctionComponent<AvatarProps> = ({ imgSrc, imgAlt }) => {
    return (
        <div
            className={`relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-white dark:ring-neutral-900`}
        >
            <Image src={imgSrc} alt={imgAlt || ""} fill />
        </div>
    );
};
