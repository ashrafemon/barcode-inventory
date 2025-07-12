import { PropsWithChildren } from "react";
import PanelLayout from "../../components/Layouts/Panel";

const layout = ({ children }: PropsWithChildren) => {
    return <PanelLayout>{children}</PanelLayout>;
};

export default layout;
