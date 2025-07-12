"use client";

import {
    Anchor,
    Box,
    Button,
    Card,
    LoadingOverlay,
    PasswordInput,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { SITE_URL } from "../constants/urls";
import { LoginDto } from "../dto/auth";
import {
    ApiErrorResponseInterface,
    ApiOkResponseInterface,
    ApiValidateErrorDataType,
    ResponseType,
} from "../dto/base";
import useAuth from "../hooks/useAuth";
import { useCreateLoginMutation } from "../stores/actions/auth";
import { alertMessage, validateError } from "../utils/helper";

const LoginForm = () => {
    const auth = useAuth();
    const [opened, { open, close }] = useDisclosure();
    const [create, result] = useCreateLoginMutation();

    const {
        handleSubmit,
        setError,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const successCallbackHandler = (res: ApiOkResponseInterface) => {
        if (res.status === ResponseType.SUCCESS) {
            alertMessage({ title: res.message, icon: "success", timer: 3000 });
            const { token } = res.data as { token: string };
            auth.authenticate(token);
        }
        setTimeout(() => close(), 1000);
    };

    const errorCallbackHandler = (err: ApiErrorResponseInterface) => {
        if (err.status === ResponseType.VALIDATE_ERROR) {
            const errors = validateError(err.data as ApiValidateErrorDataType);
            Object.keys(errors).forEach((fieldName) =>
                setError(fieldName as keyof LoginDto, {
                    type: "manual",
                    message: errors[fieldName],
                })
            );
        } else {
            alertMessage({ title: err.message, icon: "error", timer: 3000 });
        }
        close();
    };

    const onSubmit = async (data: LoginDto) => {
        open();
        await create(data)
            .unwrap()
            .then((res) => successCallbackHandler(res))
            .catch((err) => errorCallbackHandler(err));
    };

    return (
        <Box miw={{ lg: 500, base: 400 }} maw={500} pos="relative">
            <LoadingOverlay
                visible={opened}
                zIndex={1000}
                overlayProps={{ blur: 2, radius: "sm" }}
            />

            <Card withBorder radius="lg" shadow="sm" p="lg">
                <Text size="xl" fw={600} ta="center" mb="md">
                    Account Login
                </Text>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack gap="xs">
                        <Controller
                            name="email"
                            control={control}
                            rules={{ required: "Email field is required" }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    withAsterisk
                                    label="Email"
                                    placeholder="Ex. john@gmail.com"
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    error={errors.email?.message}
                                />
                            )}
                        />

                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: "Email field is required" }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <PasswordInput
                                    withAsterisk
                                    label="Password"
                                    placeholder="Ex. *******"
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    error={errors.password?.message}
                                />
                            )}
                        />

                        <Button
                            type="submit"
                            radius="lg"
                            loading={result.isLoading}
                        >
                            Login
                        </Button>

                        <Text fw={500} fz={14} c="secondary" ta="center">
                            Don&apos;t have an account?{" "}
                            <Anchor
                                component={Link}
                                href={SITE_URL.auth.register}
                                className="!text-sm !font-medium"
                            >
                                Register
                            </Anchor>
                        </Text>
                    </Stack>
                </form>
            </Card>
        </Box>
    );
};

export default LoginForm;
