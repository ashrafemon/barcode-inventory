import { Skeleton, Stack, Text } from "@mantine/core";
import { useMemo } from "react";
import { RtkResponseErrorType } from "../../dto/base";

const LoadSkeleton = ({
    isLoading = true,
    isError = false,
    error,
}: {
    isLoading: boolean;
    isError?: boolean;
    error?: RtkResponseErrorType | undefined;
}) => {
    const statusCode = useMemo(() => {
        if (error && "status" in error) {
            return error.status;
        }

        if (error && "data" in error) {
            const { statusCode } = error.data as { statusCode: number };
            return statusCode;
        }

        return 400;
    }, [error]);

    const status = useMemo(() => {
        if (error && "originalStatus" in error) {
            return error.originalStatus;
        }

        if (error && "data" in error) {
            const { status } = error.data as { status: string };
            return status;
        }

        return "ERROR";
    }, [error]);

    const message = useMemo(() => {
        if (error && "error" in error) {
            return error.error;
        }

        if (error && "data" in error) {
            const { message } = error.data as { message: string };
            return message;
        }

        return "An unknown error occurred";
    }, [error]);

    if (isError) {
        return (
            <Stack
                align="center"
                justify="center"
                className="p-3 w-full"
                role="alert"
                gap="xs"
            >
                <Text className="!text-6xl font-semibold" c="red">
                    {statusCode}
                </Text>
                <Text className="!text-lg" c="red">
                    {status}
                </Text>
                <Text className="!text-lg" c="red">
                    {message}
                </Text>
            </Stack>
        );
    }

    if (isLoading) {
        return (
            <Stack gap="xs">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} height={15} radius="lg" />
                ))}
            </Stack>
        );
    }

    return null;
};

export default LoadSkeleton;
