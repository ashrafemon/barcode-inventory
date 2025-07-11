import { Modal, ModalProps } from "@mantine/core";
import { ReactNode } from "react";

type IProps = {
    close: () => void;
    children: ReactNode;
} & Omit<ModalProps, "onClose">;

const AppDialog = ({ close = () => {}, children, ...props }: IProps) => {
    return (
        <Modal
            centered
            withCloseButton
            onClose={close}
            // size="lg"
            radius="md"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 4,
            }}
            {...props}
        >
            {children}
        </Modal>
    );
};

export default AppDialog;
