import { Screen } from "@/src/global/components";

interface _props {
    children: React.ReactNode;
}

async function layout({ children }: _props) {


    return (
        <Screen label="AI Chat">
            {children}
        </Screen>
    );
}

export default layout;