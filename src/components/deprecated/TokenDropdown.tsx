// /////////////////////////////////////////////////////////////////////////////////
// WARNING: THIS FILE HAS BEEN DEPRECATED AS IT IS NO LONGER USED IN THE CODEBASE //
//             REVISIT AND DELETE IF WE NO LONGER REQUIRE THIS LOGIC              //
// /////////////////////////////////////////////////////////////////////////////////

import Image from "next/image";
import Select, {
    components,
    ControlProps,
    OptionProps,
    StylesConfig,
} from "react-select";
import { TokenOption } from "../../types/TokenOption";
import tokens from "../../utils/tokens";

type IsMulti = false;
const customStyles: StylesConfig<TokenOption, IsMulti> = {
    menu: (provided) => ({
        ...provided,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 16,
        marginTop: 10,
    }),
    menuList: (provided) => ({
        ...provided,
        paddingTop: 0,
        paddingBottom: 0,
    }),
    option: (base, state) => ({
        ...base,
        padding: 20,
        borderRadius: 10,
        fontSize: "1.5rem",
        fontWeight: 600,
        marginTop: 8,
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        // TODO: do not use nested ternary statements
        // eslint-disable-next-line no-nested-ternary
        backgroundColor: state.isSelected
            ? "#0460CE20"
            : state.isFocused
            ? "#00000008"
            : "transparent",
        color: "#00000099",
    }),
    control: (base, state) => ({
        ...base,
        padding: 20,
        borderRadius: 16,
        fontSize: "1.5rem",
        fontWeight: 600,
        borderWidth: 1,
        borderColor: "rgb(229 231 235)",
        boxShadow: state.isFocused ? "0 0 0 1px #0460CE" : "none",
        "&:hover": {
            border: "1px solid #0460CE",
        },
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "rgb(100 116 139)",
    }),
};
const customStylesDark: StylesConfig<TokenOption, IsMulti> = {
    menu: (provided) => ({
        ...provided,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 16,
        marginTop: 10,
    }),
    menuList: (provided) => ({
        ...provided,
        paddingTop: 0,
        paddingBottom: 0,
    }),
    option: (base, state) => ({
        ...base,
        padding: 20,
        borderRadius: 10,
        fontSize: "1.5rem",
        fontWeight: 600,
        marginTop: 8,
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        // TODO: do not use nested ternary statements
        // eslint-disable-next-line no-nested-ternary
        backgroundColor: state.isSelected
            ? "#0460CE20"
            : state.isFocused
            ? "#00000008"
            : "transparent",
        color: "#00000099",
    }),
    control: (base, state) => ({
        ...base,
        padding: 20,
        borderRadius: 16,
        fontSize: "1.5rem",
        fontWeight: 600,
        borderWidth: 1,
        borderColor: "rgb(82 82 91)",
        boxShadow: state.isFocused ? "0 0 0 1px #0460CE" : "none",
        "&:hover": {
            border: "1px solid #0460CE",
        },
        backgroundColor: "rgb(24 24 27)",
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "rgb(100 116 139)",
    }),
};

const Control = ({ children, ...props }: ControlProps<TokenOption, false>) => {
    // @ts-ignore - react-select docs suggested ts-ignore here
    const { logo } = props.selectProps;
    return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <components.Control {...props}>
            <Image src={logo} height="20px" width="20px" />
            {children}
        </components.Control>
    );
};

const Option = ({ children, ...props }: OptionProps<TokenOption, false>) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <components.Option {...props}>
        <Image src={props.data.logo} className="mr-3" width="20" height="20" />
        {children}
    </components.Option>
);

interface TokenDropdownProps {
    selectTokenOption: TokenOption;
    setToken: (token: TokenOption) => void;
}

// Used in TokenSelectField.tsx which is also deprecated
const TokenDropdown = ({ selectTokenOption, setToken }: TokenDropdownProps) => {
    const onChange = (option: TokenOption | null) => {
        if (option) {
            setToken(option);
        }
    };

    return (
        <div>
            <div className="flex dark:hidden">
                <Select
                    components={{ Control, Option }}
                    onChange={onChange}
                    options={tokens}
                    styles={customStyles}
                    // @ts-ignore - react-select docs suggested ts-ignore here
                    logo={selectTokenOption.logo}
                    placeholder={selectTokenOption.label}
                    isSearchable
                    isMulti={false}
                    instanceId="react-select" // Added this property to resolve this warning: https://stackoverflow.com/questions/61290173/react-select-how-do-i-resolve-warning-prop-id-did-not-match
                    className="centered-shadow-sm dark:centered-shadow-sm-dark rounded-2xl w-full"
                />
            </div>
            <div className="hidden dark:flex">
                <Select
                    components={{ Control, Option }}
                    onChange={onChange}
                    options={tokens}
                    styles={customStylesDark}
                    // @ts-ignore - react-select docs suggested ts-ignore here
                    logo={selectTokenOption.logo}
                    placeholder={selectTokenOption.label}
                    isSearchable
                    isMulti={false}
                    instanceId="react-select" // Added this property to resolve this warning: https://stackoverflow.com/questions/61290173/react-select-how-do-i-resolve-warning-prop-id-did-not-match
                    className="centered-shadow-sm dark:centered-shadow-sm-dark rounded-2xl w-full"
                />
            </div>
        </div>
    );
};

export default TokenDropdown;
