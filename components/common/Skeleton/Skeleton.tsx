import { FunctionComponent } from "react";

type SkeletonProps = {
    className: string;
};

export const Skeleton: FunctionComponent<SkeletonProps> = ({ className }) => {
    return <div className={`${className} bg-neutral-600 animate-pulse rounded-md`} />;
};
