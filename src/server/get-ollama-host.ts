async function getOllamaHost(): Promise<string> {

    const environment = process.env.NODE_ENV as string;
    const isDockerProduction = Boolean(environment === "production");

    if (isDockerProduction) return process.env.OLLAMA_HOST as string;
    else return "127.0.0.1:11434";

}

export default getOllamaHost;