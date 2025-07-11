import {
    ControlledBoard,
    KanbanBoard,
    moveCard,
} from "@caldwell619/react-kanban";
import { Box, Card, Grid, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { CategoryDto, CategoryProductKanbanCard } from "../dto/categories";
import { useFetchCategoriesQuery } from "../stores/actions/categories";
import {
    useCreateProductMutation,
    useUpdateProductMutation,
} from "../stores/actions/products";
import { alertMessage } from "../utils/helper";
import CodeScanner from "./UI/CodeScanner";
import LoadSkeleton from "./UI/LoadSkeleton";

const CategoryBoard = () => {
    const [create, result] = useCreateProductMutation();
    const [updateDoc] = useUpdateProductMutation();
    const {
        isLoading,
        isError,
        error,
        data: categories,
        refetch,
    } = useFetchCategoriesQuery(
        `get_all=1&relations[]=products:id,name,barcode`
    );
    const [board, setBoard] = useState<KanbanBoard<CategoryProductKanbanCard>>({
        columns: [],
    });

    const getOrFetchProduct = async (
        barcode: string,
        cb: () => void = () => {}
    ) => {
        await create({ barcode, store_type: "FETCH" })
            .unwrap()
            .then((res) => {
                alertMessage({
                    title: "Product fetched successfully.",
                    icon: "success",
                    timer: 3000,
                });
                refetch();
            })
            .catch((err) => {
                alertMessage({ title: err.message, icon: "error" });
            });
        cb();
    };

    const updateHandler = async (id: string, body: { category_id: string }) => {
        await updateDoc({ id, ...body })
            .unwrap()
            .then((res) => {
                console.log({ res });
                // alertMessage({
                //     title: "Product updated successfully.",
                //     icon: "success",
                // });
            })
            .catch((err) => {
                alertMessage({ title: err.message, icon: "error" });
            });
    };

    useEffect(() => {
        if (categories) {
            const columns = categories.map((category: CategoryDto) => {
                const products = category.products || [];
                return {
                    id: category.id,
                    title: category.name,
                    cards: products || [],
                };
            });
            setBoard({ columns });
        }
    }, [categories]);

    if (isLoading || isError) {
        return (
            <LoadSkeleton
                isLoading={isLoading}
                isError={isError}
                error={error}
            />
        );
    }

    return (
        <Box>
            <Box
                mb="md"
                pb="sm"
                className="border-b border-dotted border-gray-200"
            >
                <Title order={3}>Kanban Board</Title>
            </Box>
            <Grid>
                <Grid.Col span={{ lg: 2, sm: 5, xs: 12 }}>
                    <CodeScanner
                        handler={(code, cb) => getOrFetchProduct(code, cb)}
                        loading={result.isLoading}
                    />
                </Grid.Col>

                <Grid.Col span={{ lg: 10, sm: 7, xs: 12 }}>
                    <ControlledBoard
                        allowAddCard={false}
                        renderColumnHeader={({ title }) => (
                            <Box
                                pb="sm"
                                mb="sm"
                                className="border-b border-dotted border-gray-200"
                            >
                                <Text fw={600}>{title}</Text>
                            </Box>
                        )}
                        renderCard={({ name, barcode }) => (
                            <Card
                                withBorder
                                shadow="sm"
                                p="xs"
                                miw={150}
                                maw={200}
                                mb="xs"
                            >
                                <Text size="sm">
                                    <span className="font-semibold">Name:</span>{" "}
                                    {name}
                                </Text>
                                <Text size="sm">
                                    <span className="font-semibold">
                                        Barcode:
                                    </span>{" "}
                                    {barcode}
                                </Text>
                            </Card>
                        )}
                        onCardDragEnd={(card, source, destination) => {
                            setBoard((currentBoard) =>
                                moveCard(currentBoard, source, destination)
                            );

                            const productId = card.id;
                            const { toColumnId: category_id } = destination as {
                                toColumnId: string;
                            };
                            updateHandler(productId, { category_id });
                        }}
                    >
                        {board}
                    </ControlledBoard>
                </Grid.Col>
            </Grid>
        </Box>
    );
};

export default CategoryBoard;
