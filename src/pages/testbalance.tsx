import type { NextPage } from "next";
import { useState } from "react";
import AnimatedBalance from "../components/AnimatedBalance";

const TestBalance: NextPage = () => {

    const [num, setNum] = useState(100);

    return (
        <div className="flex space-x-16 h-screen w-screen items-center justify-center">
            <AnimatedBalance value={num.toString()} isIncreasing={false} />
            <button onClick={() => {
                setNum(n => n - 1)
                //const min = 100;
                //const max = 0;
                //setNum((Math.random() * (max - min + 1)) + min);
            }}>
                change
            </button>
        </div>
    );
};//<AnimatedBalance value={num} />

export default TestBalance;