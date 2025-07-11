import { Html5Qrcode } from "html5-qrcode";
import React, { useCallback, useEffect, useState } from "react";
import { alertMessage } from "../utils/helper";

export enum ScanType {
    CAMERA = "camera",
    FILE = "file",
    INPUT = "input",
}

const useScanner = () => {
    const [reader, setReader] = React.useState<Html5Qrcode | null>(null);
    const [scannerType, setScannerType] = useState<ScanType>(ScanType.FILE);
    const [value, setValue] = useState("");

    const cameraScan = async (): Promise<string | null> => {
        if (!reader) {
            console.error("Reader is not initialized");
            return null;
        }

        setScannerType(ScanType.CAMERA);

        return new Promise((resolve, reject) => {
            let resolved = false;

            reader
                .start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                    },
                    async (decodedText) => {
                        if (resolved) return;
                        resolved = true;

                        setValue(decodedText);
                        await reader.stop(); // Stop the camera after first scan
                        resolve(decodedText);
                    },
                    (errorMessage) => {
                        console.warn("Camera scanning error:", errorMessage);
                        // Do not reject here, only log error
                    }
                )
                .catch(async (err) => {
                    if (resolved) return;
                    resolved = true;

                    alertMessage({
                        title: "Failed to start scanning",
                        icon: "error",
                    });

                    try {
                        await reader.stop();
                    } catch (stopErr) {
                        console.error("Error stopping camera:", stopErr);
                    }

                    try {
                        await reader.clear();
                    } catch (clearErr) {
                        console.error("Error clearing reader:", clearErr);
                    }

                    reject(null);
                });
        });
    };

    const fileScan = async (file: File): Promise<string | null> => {
        if (!reader) {
            console.error("Reader is not initialized");
            return null;
        }

        setScannerType(ScanType.FILE);

        if (!file) {
            alertMessage({
                title: "Please select a file to scan",
                icon: "error",
            });
            return null;
        }

        try {
            const barcode = await reader.scanFile(file, true);
            setValue(barcode);
            return barcode;
        } catch (err: any) {
            alertMessage({
                title: "Sorry, no barcode found",
                icon: "error",
            });

            try {
                await reader.clear();
            } catch (clearErr) {
                console.error("Error clearing reader:", clearErr);
            }

            return null;
        }
    };

    const clear = async () => {
        if (!reader) {
            console.log("Reader is not initialized");
            return;
        }

        if (scannerType === ScanType.CAMERA) {
            try {
                await reader.stop();
                console.log("Camera scan stopped");
            } catch (err) {
                console.error("Error stopping camera scan:", err);
            }
        }

        try {
            await reader.clear();
            console.log("Reader cleared");
        } catch (err) {
            console.error("Error clearing reader:", err);
        }

        setScannerType(ScanType.FILE);
        setValue("");
    };

    const initialize = useCallback(() => {
        const newReader = new Html5Qrcode("reader");
        setReader(newReader);

        return () => {
            newReader.clear();
        };
    }, []);

    useEffect(() => {
        const cleanup = initialize();
        return () => {
            cleanup();
        };
    }, []);

    return {
        cameraScan,
        fileScan,
        clear,
        value,
        scannerType,
        setScannerType,
        setValue,
    };
};

export default useScanner;
