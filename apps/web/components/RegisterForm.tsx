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
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { SITE_URL } from "../constants/urls";
import { RegisterDto } from "../dto/auth";
import {
    ApiErrorResponseInterface,
    ApiOkResponseInterface,
    ApiValidateErrorDataType,
    ResponseType,
} from "../dto/base";
import { useCreateRegisterMutation } from "../stores/actions/auth";
import { alertMessage, validateError } from "../utils/helper";

const RegisterForm = () => {
    const router = useRouter();
    const [opened, { open, close }] = useDisclosure();
    const [create, result] = useCreateRegisterMutation();

    const {
        handleSubmit,
        setError,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const successCallbackHandler = (res: ApiOkResponseInterface) => {
        if (res.status === ResponseType.SUCCESS) {
            alertMessage({ title: res.message, icon: "success", timer: 3000 });
            router.replace(SITE_URL.auth.login);
        }
        setTimeout(() => close(), 1000);
    };

    const errorCallbackHandler = (err: ApiErrorResponseInterface) => {
        if (err.status === ResponseType.VALIDATE_ERROR) {
            const errors = validateError(err.data as ApiValidateErrorDataType);
            Object.keys(errors).forEach((fieldName) =>
                setError(fieldName as keyof RegisterDto, {
                    type: "manual",
                    message: errors[fieldName],
                })
            );
        } else {
            alertMessage({ title: err.message, icon: "error", timer: 3000 });
        }
        close();
    };

    const onSubmit = async (data: RegisterDto) => {
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
                    Create your account
                </Text>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack gap="xs">
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: "Name field is required" }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    withAsterisk
                                    label="Name"
                                    placeholder="Ex. John Doe"
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    error={errors.name?.message}
                                />
                            )}
                        />

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
                            Register
                        </Button>

                        <Text fw={500} fz={14} c="secondary" ta="center">
                            Already have an account?{" "}
                            <Anchor
                                component={Link}
                                href={SITE_URL.auth.login}
                                className="!text-sm !font-medium"
                            >
                                Login
                            </Anchor>
                        </Text>
                    </Stack>
                </form>
            </Card>
        </Box>
    );
};

export default RegisterForm;
