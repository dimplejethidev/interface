import type { NextPage } from "next";
import Sidebar from "../components/Sidebar";
import WidgetContainer from "../components/widgets/WidgetContainer";

const ProvideLiquidity: NextPage = () => {
    return (
        <div className="flex items-center">
            <Sidebar />
            <main className="flex flex-col w-4/5 justify-evenly">
                <section className="flex flex-col items-center w-full">
                    <WidgetContainer title="Coming soon...">
                    </WidgetContainer>
                </section>
            </main>
        </div>
    );
};

export default ProvideLiquidity;
