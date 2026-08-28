import { NextRequest } from "next/server"

interface _props {
    request: NextRequest;
}

async function getClientIP({ request }: _props) {

    const headers = request.headers;
    const ipAddress = headers.get("cf-connection-ip") || headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    return ipAddress;

}
export default getClientIP