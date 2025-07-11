import {
    Box,
    Button,
    Group,
    LoadingOverlay,
    Stack,
    TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ApiErrorResponseInterface,
    ApiOkResponseInterface,
    ApiValidateErrorDataType,
    ResponseType,
} from "../dto/base";
import { CategoryFormDto } from "../dto/categories";
import {
    useCreateCategoryMutation,
    useFetchCategoryQuery,
    useUpdateCategoryMutation,
} from "../stores/actions/categories";
import { alertMessage, validateError } from "../utils/helper";
import LoadSkeleton from "./UI/LoadSkeleton";

const CategoryForm = ({
    payload = null,
    closer = () => {},
}: {
    payload?: string | null;
    closer?: () => void;
}) => {
    const [opened, { open, close }] = useDisclosure();
    const [createDoc, resultCreateDoc] = useCreateCategoryMutation();
    const [updateDoc, resultUpdateDoc] = useUpdateCategoryMutation();

    const { data, isFetching, isError, error } = useFetchCategoryQuery(
        payload,
        { skip: !payload, refetchOnMountOrArgChange: true }
    );

    const {
        handleSubmit,
        control,
        setValue,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
        },
    });

    const successCallbackHandler = (res: ApiOkResponseInterface) => {
        if (res.status === ResponseType.SUCCESS) {
            alertMessage({ title: res.message, icon: "success", timer: 3000 });
            closer();
        }
        setTimeout(() => close(), 1000);
    };

    const errorCallbackHandler = (err: ApiErrorResponseInterface) => {
        if (err.status === ResponseType.VALIDATE_ERROR) {
            const errors = validateError(err.data as ApiValidateErrorDataType);
            Object.keys(errors).forEach((fieldName) =>
                setError(fieldName as keyof CategoryFormDto, {
                    type: "manual",
                    message: errors[fieldName],
                })
            );
        } else {
            alertMessage({ title: err.message, icon: "error", timer: 3000 });
        }
        close();
    };

    const onSubmit = async (data: CategoryFormDto) => {
        open();

        const fn = payload ? updateDoc : createDoc;
        const formData = { ...data, ...(payload && { id: payload }) };
        fn(formData)
            .unwrap()
            .then((res) => successCallbackHandler(res))
            .catch((err) => errorCallbackHandler(err));
    };

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            Object.keys(data).forEach((key) => {
                if (data[key] !== null) {
                    setValue(key as keyof CategoryFormDto, data[key]);
                }
            });
        }
    }, [data]);

    if (isFetching || isError) {
        return (
            <LoadSkeleton
                isLoading={isFetching}
                isError={isError}
                error={error}
            />
        );
    }

    return (
        <Box pos="relative">
            <LoadingOverlay
                visible={opened}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack>
                    <Controller
                        control={control}
                        name="name"
                        rules={{ required: "Name is required" }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                withAsterisk
                                label="Name"
                                placeholder="Ex. In Stock"
                                size="md"
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={errors.name?.message}
                            />
                        )}
                    />

                    <Group gap="xs">
                        <Button
                            type="submit"
                            loading={
                                resultCreateDoc.isLoading ||
                                resultUpdateDoc.isLoading
                            }
                        >
                            Save
                        </Button>
                        <Button
                            color="red"
                            loading={
                                resultCreateDoc.isLoading ||
                                resultUpdateDoc.isLoading
                            }
                            onClick={closer}
                        >
                            Cancel
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Box>
    );
};

export default CategoryForm;
