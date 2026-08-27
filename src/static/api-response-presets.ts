import { APIResponse } from "../interfaces"

type APIResponsePresetProps = {
    OK({ message }: { message: string }): APIResponse,
    CREATED: ({ message }: { message: string }) => APIResponse,
    UNAUTHORIZED(): APIResponse
    BAD_REQUEST: ({ message }: { message: string; }) => APIResponse,
    INTERNAL_SERVER_ERROR: ({ error }: { error: string }) => APIResponse,
    NOT_FOUND: ({ message }: { message: string; }) => APIResponse,
}

const apiResponsePresets: APIResponsePresetProps = {
    OK({ message }) {
        return {
            id: 0,
            status: 200,
            success: true,
            message,
        }
    },
    CREATED({ message }) {
        return {
            id: 1,
            status: 201,
            success: true,
            message: message,
        }
    },
    UNAUTHORIZED() {
        return {
            id: 2,
            status: 401,
            success: false,
            message: "Authorization failed.",
        }
    },
    BAD_REQUEST({ message }) {
        return {
            id: 3,
            status: 400,
            success: false,
            message,
        }
    },
    INTERNAL_SERVER_ERROR({ error }) {
        return {
            id: 4,
            status: 500,
            success: false,
            message: error,
        }
    },
    NOT_FOUND({ message }) {
        return {
            id: 4,
            status: 404,
            success: false,
            message: message,
        }
    },
}


export default apiResponsePresets;