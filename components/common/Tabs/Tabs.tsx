import { FunctionComponent, useState } from "react";
import { Tab } from "./types";

type TabsProps = {
    tabs: Tab[];
};

export const Tabs: FunctionComponent<TabsProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState<string>(tabs[0].name);

    const activeTabComponent = tabs.find((tab) => tab.name === activeTab);

    return (
        <>
            <div className="border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <ul className="-mb-px flex flex-wrap">
                    {tabs.map((tab) => {
                        const isActive = tab.name === activeTab;

                        return (
                            <li
                                key={tab.name}
                                className="mr-2"
                                onClick={() => setActiveTab(tab.name)}
                            >
                                <a
                                    href="#"
                                    className={`inline-block rounded-t-lg border-b-2 border-transparent p-4   ${
                                        isActive
                                            ? "text-blue-600 dark:border-blue-500 dark:text-blue-500"
                                            : "hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                                    }`}
                                >
                                    {tab.name}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
            {activeTabComponent && activeTabComponent.component}
        </>
    );
};
