import { TransactionOrderByWithRelationInput } from "@/src/generated/prisma/models";
import { SORTING } from "../components/sorting";

interface _props {
    sorting: SORTING;
}

async function constructSortingByParameter({ sorting }: _props): Promise<TransactionOrderByWithRelationInput> {

    let ordering: TransactionOrderByWithRelationInput;

    switch (sorting) {
        case "value-asc": ordering = { value: "asc" }; break;
        case "value-desc": ordering = { value: "desc" }; break;
        case "created-asc": ordering = { created: "asc" }; break;
        case "created-desc": ordering = { created: "desc" }; break;
        default: ordering = { created: "desc" };
    }

    return ordering;
}

export default constructSortingByParameter;