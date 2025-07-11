"use client";

import { MantineProvider } from "@mantine/core";
import { PropsWithChildren } from "react";

const UIProvider = ({ children }: PropsWithChildren) => {
    return <MantineProvider theme={{}}>{children}</MantineProvider>;
};

export default UIProvider;
