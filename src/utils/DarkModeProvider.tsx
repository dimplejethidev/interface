import {
    createContext,
    useContext,
    Dispatch,
    SetStateAction,
    useMemo,
} from "react";

interface DarkModeContextInterface {
    isDark: boolean;
    setIsDark: Dispatch<SetStateAction<boolean>>;
}

const DarkModeContext = createContext<DarkModeContextInterface | null>(null);

export function useDarkMode() {
    return useContext(DarkModeContext);
}

const DarkModeProvider = ({
    isDark,
    setIsDark,
    children,
}: {
    isDark: boolean;
    setIsDark: Dispatch<SetStateAction<boolean>>;
    children: JSX.Element;
}) => {
    const DarkModeContextProviderProps = useMemo(
        () => ({
            isDark,
            setIsDark,
        }),
        [isDark, setIsDark]
    );

    return (
        <DarkModeContext.Provider value={DarkModeContextProviderProps}>
            {children}
        </DarkModeContext.Provider>
    );
};

export default DarkModeProvider;
