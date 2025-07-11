"use client";

import { Box, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";

const AuthProvider = ({ children }: React.PropsWithChildren) => {
    const auth = useAuth();
    const [opened, { close }] = useDisclosure(true);

    useEffect(() => {
        const verify = async () => {
            auth.checkAuth(() => {
                setTimeout(() => {
                    close();
                }, 1000);
            });
        };

        verify();
    }, []);

    return (
        <Box pos="relative">
            <LoadingOverlay
                visible={opened}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
            {children}
        </Box>
    );
};

export default AuthProvider;
