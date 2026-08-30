import { Trash2Icon } from "lucide-react";
import { Section } from "./components";

async function page() {

    return (
        <div className="flex flex-col gap-4">
            <Section
                label="Auth"
                subsections={[{
                    id: 0,
                    description: "Delete my access token and log me out",
                    icon: <Trash2Icon opacity={.5} size={20} />,
                    label: "Logout",
                    apiEndpoint: "/authentication/logout",
                    destructiveOperation: false,
                    buttonLabel: "Logout",
                }]}
            />
            <Section
                label="Danger Zone"
                subsections={[
                    {
                        id: 1,
                        description: "Reset my Transactions, Categories, Accounts and Reports. This Action will keep: Your User and Avatar",
                        icon: <Trash2Icon opacity={.5} size={20} />,
                        label: "Reset Data",
                        apiEndpoint: "/api/authentication/reset",
                        destructiveOperation: true,
                        buttonLabel: "Reset",
                    },
                    {
                        id: 2,
                        description: "Delete My Data. This will delete everything including your user",
                        icon: <Trash2Icon opacity={.5} size={20} />,
                        label: "Delete User",
                        apiEndpoint: "/api/authentication/delete",
                        destructiveOperation: true,
                        buttonLabel: "Delete",
                    }
                ]} />
        </div>
    );
}

export default page;