import {
    Card,
    Grid,
    Skeleton,
    Table,
    TableScrollContainer,
    Text,
} from "@mantine/core";
import React from "react";
import LoadSkeleton from "./LoadSkeleton";

type IProps = {
    title?: string | React.ReactNode;
    actions?: React.ReactNode;
    breadcrumbs?: React.ReactNode;
    headers?: { field: string; align: string; w: number }[];
    rows?: React.ReactNode;
    paginate?: React.ReactNode;
    found?: boolean;
    isLoading?: boolean;
    isError?: boolean;
    error?: unknown;
};

const AppTable = ({
    title,
    actions,
    headers = [],
    rows,
    paginate,
    found = false,
    isLoading = false,
    isError = false,
    error,
}: IProps) => {
    return (
        <Card radius="lg" p="sm" shadow="sm">
            <Grid mb="lg" align="center">
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    {typeof title === "string" ? (
                        <Text fz={16} fw={600}>
                            {title}
                        </Text>
                    ) : (
                        title
                    )}
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 8 }}>{actions}</Grid.Col>
            </Grid>

            <TableScrollContainer minWidth={500}>
                <Table withRowBorders withTableBorder striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            {headers?.map((item, i) => (
                                <Table.Td
                                    miw={item?.w}
                                    align={
                                        item?.align as
                                            | "center"
                                            | "left"
                                            | "right"
                                            | "justify"
                                            | "char"
                                            | undefined
                                    }
                                    key={i}
                                    fw={600}
                                >
                                    {item?.field}
                                </Table.Td>
                            ))}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {isLoading ? (
                            Array(10)
                                .fill(0)
                                .map((_, i) => (
                                    <Table.Tr key={i}>
                                        <Table.Td colSpan={headers.length}>
                                            <Skeleton height={30} />
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                        ) : error ? (
                            <Table.Tr>
                                <Table.Td colSpan={headers.length}>
                                    <LoadSkeleton
                                        isLoading={isLoading}
                                        isError={isError}
                                        error={error}
                                    />
                                </Table.Td>
                            </Table.Tr>
                        ) : found ? (
                            rows
                        ) : (
                            <Table.Tr>
                                <Table.Td colSpan={headers.length}>
                                    <Text c="dimmed" pt="xs" ta="center">
                                        No data available at the moment.
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </TableScrollContainer>
            {paginate}
        </Card>
    );
};

export default AppTable;
