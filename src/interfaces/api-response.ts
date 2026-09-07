interface APIResponse {
    status: number;
    success: boolean;
    message: string;
}

interface APIResponseWithData<DataType> extends APIResponse {
    data: DataType;
}

export {
    type APIResponse,
    type APIResponseWithData,
}