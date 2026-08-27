import Chat from "./components/chat";

async function page() {


    return (
        <Chat initialized={new Date()} />
    );
}

export default page;