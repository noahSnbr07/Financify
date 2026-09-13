export interface WarningProps {
    id: number;
    href: string;
    body: string;
    label: string;
}

const warnings: Record<string, WarningProps> = {
    NO_CATEGORIES: {
        id: 0,
        href: "/categories/new",
        body: "You must first create a category.",
        label: "Create Category",
    },
    NO_ACCOUNTS: {
        id: 1,
        href: "/accounts/new",
        body: "You must first create an account.",
        label: "Create Account",
    },
    DELETES_TRANSACTIONS_AND_SUBSCRIPTIONS: {
        id: 2,
        href: "/",
        body: "Deleting this Account will also delete all Transactions and Subscriptions linked to this account",
        label: "Forceful Deletion",
    }

}

export default warnings;