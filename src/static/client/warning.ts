export interface WarningProps {
    id: number;
    href: string;
    body: string;
    label: string;
}

const warnings: { NO_CATEGORIES: WarningProps; NO_ACCOUNTS: WarningProps; } = {
    NO_CATEGORIES: {
        id: 0,
        href: "/categories/new",
        body: "In order to create a Transaction you must first create a category.",
        label: "Create Category",
    },
    NO_ACCOUNTS: {
        id: 1,
        href: "/accounts/new",
        body: "In order to create a Transaction you must first create an account.",
        label: "Create Account",
    }

}

export default warnings;