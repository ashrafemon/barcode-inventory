import { Group, Pagination } from "@mantine/core";

type IProps = {
    page?: number;
    offset?: number;
    from?: number;
    to?: number;
    total?: number;
    totalPage?: number;
    handler?: (field: string, value: number) => void;
};

const AppPaginate = ({
    page = 1,
    // offset = 10,
    // from = 0,
    // to = 0,
    // total = 0,
    totalPage = 0,
    handler = () => {},
}: IProps) => {
    return (
        <Group justify="center" py={10}>
            <Pagination
                value={page}
                total={totalPage}
                size="sm"
                radius="sm"
                onChange={(value) => handler("page", value)}
                classNames={{
                    control: "!text-sm !font-semibold pagination-control",
                }}
            />
        </Group>
    );
};

export default AppPaginate;
