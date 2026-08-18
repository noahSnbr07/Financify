interface APIResponse<DataType> {
    status: number;
    success: boolean;
    message: string;
    data: DataType;
}

export default APIResponse;