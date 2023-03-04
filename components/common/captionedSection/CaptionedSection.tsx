import { FunctionComponent, ReactNode } from "react";

interface CaptionedSectionProps {
    caption: string;
    children: ReactNode;
    captionChildren?: ReactNode;
}

export const CaptionedSection: FunctionComponent<CaptionedSectionProps> = ({
    caption,
    children,
    captionChildren,
}) => {
    return (
        <div>
            <div className="flex items-center mb-4">
                <h2 className="uppercase font-bold text-neutral-400 text-sm tracking-wider dark:text-gray-100">
                    {caption}
                </h2>
                {captionChildren}
            </div>
            {children}
        </div>
    );
};
