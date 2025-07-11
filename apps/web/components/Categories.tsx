import { Icon } from "@iconify-icon/react";
import {
    ActionIcon,
    Box,
    Card,
    Flex,
    Grid,
    Group,
    Stack,
    Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { CategoryDto } from "../dto/categories";
import {
    useDeleteCategoryMutation,
    useFetchCategoriesQuery,
} from "../stores/actions/categories";
import { alertMessage, promptMessage } from "../utils/helper";
import CategoryForm from "./CategoryForm";
import AppDialog from "./UI/AppDialog";
import LoadSkeleton from "./UI/LoadSkeleton";

const Categories = () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [opened, { open, close }] = useDisclosure();

    const { isFetching, isError, isSuccess, error, data } =
        useFetchCategoriesQuery(`get_all=1`);

    const [deleteDoc, result] = useDeleteCategoryMutation();

    const deleteHandler = async (id: string | null) => {
        promptMessage(async () => {
            await deleteDoc(id)
                .unwrap()
                .then((res) =>
                    alertMessage({
                        title: res.message,
                        icon: "success",
                        timer: 2000,
                    })
                )
                .catch((err) =>
                    alertMessage({
                        title: err.message,
                        icon: "error",
                        timer: 2000,
                    })
                );
        });
    };

    const closeHandler = () => {
        if (selectedId) {
            setSelectedId(null);
        }
        close();
    };

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
        <>
            <AppDialog
                opened={opened}
                close={closeHandler}
                title={`${selectedId ? "Update" : "Create"} Category`}
            >
                <CategoryForm payload={selectedId} closer={closeHandler} />
            </AppDialog>

            <Stack>
                <Group align="center" gap="xs">
                    <Text size="lg" fw={600}>
                        Category
                    </Text>
                    <ActionIcon variant="outline" onClick={open}>
                        <Icon icon="fluent:add-12-filled" width="20" />
                    </ActionIcon>
                </Group>

                <Grid>
                    {isSuccess && !data?.length ? (
                        <Grid.Col span={12}>
                            <Text>No categories found..</Text>
                        </Grid.Col>
                    ) : (
                        data?.map((item: CategoryDto, i: number) => (
                            <Grid.Col
                                key={i}
                                span={{ lg: 2, md: 4, sm: 6, xs: 12 }}
                            >
                                <Box pos="relative" pt="sm">
                                    <Flex
                                        pos="absolute"
                                        top={0}
                                        right={0}
                                        className="z-10"
                                        gap={2}
                                    >
                                        <ActionIcon
                                            color="orange"
                                            onClick={() => {
                                                setSelectedId(item.id);
                                                open();
                                            }}
                                            loading={result.isLoading}
                                        >
                                            <Icon
                                                icon="lucide:edit"
                                                width="20"
                                            />
                                        </ActionIcon>
                                        <ActionIcon
                                            color="red"
                                            onClick={() =>
                                                deleteHandler(item.id)
                                            }
                                            loading={result.isLoading}
                                        >
                                            <Icon
                                                icon="ic:baseline-delete"
                                                width="20"
                                            />
                                        </ActionIcon>
                                    </Flex>

                                    <Card withBorder radius="md">
                                        <Text size="sm" fw={600} ta="center">
                                            {item.name ?? ""}
                                        </Text>
                                    </Card>
                                </Box>
                            </Grid.Col>
                        ))
                    )}
                </Grid>
            </Stack>
        </>
    );
};

export default Categories;
