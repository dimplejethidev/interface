import { createContext, useContext, Dispatch, SetStateAction } from "react";

interface DarkModeContextInterface {
  isDark: boolean;
  setIsDark: Dispatch<SetStateAction<boolean>>;
  // setIsDark: (isDark: boolean) => void;
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
}) => (
  // TODO: Assess whether we should add useMemo here
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  <DarkModeContext.Provider value={{ isDark, setIsDark }}>
    {children}
  </DarkModeContext.Provider>
);

export default DarkModeProvider;
