import { Center } from "@mantine/core";
import { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
    return (
        <div className="w-full h-screen p-5">
            <Center h="100%">{children}</Center>
        </div>
    );
};

export default layout;
