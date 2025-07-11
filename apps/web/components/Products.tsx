import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { ActionIcon, Box, Card, Flex, Grid, Stack, Text } from "@mantine/core";
import { ProductDto } from "../dto/products";
import {
    useDeleteProductMutation,
    useFetchProductsQuery,
} from "../stores/actions/products";
import { alertMessage, promptMessage } from "../utils/helper";
import LoadSkeleton from "./UI/LoadSkeleton";

const Products = () => {
    const { isFetching, isError, isSuccess, error, data } =
        useFetchProductsQuery(`get_all=1&relations[]=category:id,name`);

    const [deleteDoc, result] = useDeleteProductMutation();

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
        <Stack>
            <Text size="lg" fw={600}>
                Products
            </Text>
            <Grid>
                {isSuccess && !data?.length ? (
                    <Grid.Col span={12}>
                        <Text>No products found..</Text>
                    </Grid.Col>
                ) : (
                    data?.map((item: ProductDto, i: number) => (
                        <Grid.Col key={i} span={{ lg: 3, md: 4, sm: 6 }}>
                            <Box pos="relative" pt="sm">
                                <Flex
                                    pos="absolute"
                                    top={0}
                                    right={0}
                                    className="z-10"
                                    gap={2}
                                >
                                    <ActionIcon
                                        color="red"
                                        onClick={() => deleteHandler(item.id)}
                                        loading={result.isLoading}
                                    >
                                        <Icon
                                            icon="ic:baseline-delete"
                                            width="20"
                                        />
                                    </ActionIcon>
                                </Flex>
                            </Box>
                            <Card withBorder radius="md" p="xs">
                                <Stack gap="xs">
                                    <Text size="sm" lineClamp={1}>
                                        <span className="font-semibold">
                                            Name:
                                        </span>{" "}
                                        {item.name}
                                    </Text>
                                    <Text size="sm" lineClamp={1}>
                                        <span className="font-semibold">
                                            Barcode:
                                        </span>{" "}
                                        {item.barcode}
                                    </Text>
                                    <Text size="sm" lineClamp={1}>
                                        <span className="font-semibold">
                                            Category:
                                        </span>{" "}
                                        {item.category?.name ?? "N/A"}
                                    </Text>
                                </Stack>
                            </Card>
                        </Grid.Col>
                    ))
                )}
            </Grid>
        </Stack>
    );
};

export default Products;
