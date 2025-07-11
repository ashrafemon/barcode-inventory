import {
    ActionIcon,
    Box,
    Button,
    Group,
    LoadingOverlay,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useRef } from "react";
import useScanner, { ScanType } from "../../hooks/useScanner";
import { alertMessage } from "../../utils/helper";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

const CodeScanner = ({
    handler = () => {},
    loading = false,
}: {
    loading?: boolean;
    handler?: (val: string, cb: () => void) => void;
}) => {
    const scanner = useScanner();
    const [opened, { open, close }] = useDisclosure();
    const inputRef = useRef<HTMLInputElement>(null);

    const fileHandler = async () => {
        await scanner.clear();
        inputRef.current?.click();
    };

    const captureHandler = async () => {
        try {
            const result = await scanner.cameraScan();
            if (result) {
                open();
                handler(result, () => {
                    close();
                    scanner.clear();
                });
            }
        } catch (err) {
            console.error("Camera scan failed", err);
        }
    };

    const fileChangeHandler = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            console.error("No files selected");
            alertMessage({
                title: "Please select a file to scan.",
                icon: "info",
            });
            return;
        }

        const file = files[0];
        if (!file) {
            console.error("No file selected");
            alertMessage({
                title: "Please select a file to scan.",
                icon: "info",
            });
            return;
        }

        try {
            const result = await scanner.fileScan(file);
            if (result) {
                open();
                handler(result, () => {
                    close();
                    scanner.clear();
                });
            }
        } catch (err) {
            console.error("File scan failed", err);
        } finally {
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    const inputHandler = async () => {
        await scanner.clear();
        scanner.setScannerType(ScanType.INPUT);
    };

    const manualHandler = () => {
        if (scanner.value) {
            open();
            handler(scanner.value, () => {
                close();
                scanner.clear();
            });
        }
    };

    const clearHandler = async () => {
        await scanner.clear();
        inputRef.current && (inputRef.current.value = "");
        close();
    };

    return (
        <Box pos="relative">
            <LoadingOverlay
                visible={opened}
                zIndex={1000}
                overlayProps={{ blur: 2, radius: "sm" }}
            />

            <Stack gap="xs">
                <Text fw={600} ta="center">
                    Scan Product Barcode
                </Text>

                {scanner.scannerType === ScanType.INPUT && (
                    <TextInput
                        autoFocus
                        value={scanner.value}
                        onChange={(e) => scanner.setValue(e.target.value)}
                        rightSection={
                            <ActionIcon
                                onClick={manualHandler}
                                loading={loading}
                                disabled={scanner.value.length < 6}
                            >
                                <Icon
                                    icon="streamline:upload-circle-remix"
                                    width="20"
                                />
                            </ActionIcon>
                        }
                    />
                )}

                <Box
                    pos="relative"
                    id="reader"
                    className={`rounded-lg bg-gray-400 ${scanner.scannerType === ScanType.INPUT ? "hidden" : ""}`}
                    mih={200}
                ></Box>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={fileChangeHandler}
                    style={{ display: "none" }}
                />
                <Button onClick={fileHandler} radius="md" loading={loading}>
                    Browse to Barcode Scan
                </Button>
                <Button onClick={captureHandler} radius="md" loading={loading}>
                    Start Camera to Scan
                </Button>
                <Button onClick={inputHandler} radius="md" loading={loading}>
                    Scan with Manual Input
                </Button>

                {scanner.value && (
                    <Button
                        color="red"
                        onClick={clearHandler}
                        radius="md"
                        loading={loading}
                    >
                        Clear
                    </Button>
                )}
            </Stack>
        </Box>
    );
};

export default CodeScanner;
