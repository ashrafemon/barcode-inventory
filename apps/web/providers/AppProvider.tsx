"use client";

import { LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PropsWithChildren, Suspense } from "react";
import AuthProvider from "./AuthProvider";
import StoreProvider from "./StoreProvider";
import UIProvider from "./UIProvider";

const BaseProvider = ({ children }: PropsWithChildren) => {
    const [opened] = useDisclosure();

    return (
        <Suspense
            fallback={
                <LoadingOverlay
                    visible={opened}
                    zIndex={1000}
                    overlayProps={{ radius: "sm", blur: 2 }}
                />
            }
        >
            <StoreProvider>
                <AuthProvider>{children}</AuthProvider>
            </StoreProvider>
        </Suspense>
    );
};

const AppProvider = ({ children }: PropsWithChildren) => {
    return (
        <UIProvider>
            <BaseProvider>{children}</BaseProvider>
        </UIProvider>
    );
};

export default AppProvider;
