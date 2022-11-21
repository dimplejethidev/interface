import { useState, createContext, useContext, Dispatch, SetStateAction, useEffect } from "react";

interface DarkModeContextInterface {
    isDark: boolean;
    setIsDark: Dispatch<SetStateAction<boolean>>;
    //setIsDark: (isDark: boolean) => void;
}
  
const DarkModeContext = createContext<DarkModeContextInterface | null>(null);

export function useDarkMode() {
    return useContext(DarkModeContext)
}

const DarkModeProvider = ({ isDark, setIsDark, children }: { isDark: boolean, setIsDark: Dispatch<SetStateAction<boolean>>, children: JSX.Element }) => {
/*
    const [isDark, setIsDark] = useState<boolean>(false);

    useEffect(() => {
        console.log(isDark)
    }, [isDark])
*/
    return (
        <DarkModeContext.Provider value={{ isDark: isDark, setIsDark: setIsDark }}>
            {children}
        </DarkModeContext.Provider>
    )
}

export default DarkModeProvider;