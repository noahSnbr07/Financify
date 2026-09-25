
export type Method = "GET" | "POST" | "DELETE";

interface _props {
    method: Method;
}

export default function getColorForHTTPMethod({ method }: _props): string {

    let color: string;

    switch (method) {
        case ("GET"): color = "#5fbf2f"; break;
        case ("POST"): color = "#bfb32f"; break;
        case ("DELETE"): color = "#bf2f2f"; break;
        default: color = "#2f2fbf"; break;

    }

    return color;

}