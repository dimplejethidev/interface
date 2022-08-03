import type { NextPage } from "next";
import "tailwindcss/tailwind.css";

import Header from "../components/Header";
import CreateStreamWidget from "../components/widgets/CreateStreamWidget";

const Home: NextPage = () => {
    return (
        <div>
            <Header />
            <main className="flex flex-col items-center h-full text-white">
                <CreateStreamWidget />
            </main>
        </div>
    );
};

export default Home;
