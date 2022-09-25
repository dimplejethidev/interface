import { NextPage } from "next";

const Landing: NextPage = () => {
    return (
        <div>
            <div className="flex flex-col w-full h-screen bg-blue-500" />
            <div className="flex flex-col w-full h-screen bg-red-500" />
        </div>
    )
}

export default Landing;