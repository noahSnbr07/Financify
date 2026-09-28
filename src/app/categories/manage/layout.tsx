import Screen from "@/src/global/components/server/screen";

interface _props {
    children: React.ReactNode;
}

async function layout({ children }: _props) {


    return (
        <Screen label="Manage Categories">
            {children}
        </Screen>
    );
}

export default layout;