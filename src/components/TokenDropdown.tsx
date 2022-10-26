import Select, {
    components,
    ControlProps,
    OptionProps,
    StylesConfig,
    ActionMeta,
} from "react-select";
import { TokenOption } from "../types/TokenOption";
import tokens from "../utils/tokens";

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
    option: (provided) => ({
        ...provided,
        padding: 20,
        borderRadius: 10,
        fontSize: "1.5rem",
        fontWeight: 600,
        marginTop: 8,
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
    }),
    control: (base, state) => ({
        ...base,
        padding: 20,
        borderRadius: 16,
        fontSize: "1.5rem",
        fontWeight: 600,
        borderWidth: 1,
        borderColor: "rgb(229 231 235)",
        boxShadow: state.isFocused ? '0 0 0 1px #0460CE' : 'none',
        '&:hover': {
            border: '1px solid #0460CE',
        },
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "rgb(100 116 139)"
    })
};

const Control = ({ children, ...props }: ControlProps<TokenOption, false>) => {
    // @ts-ignore - react-select docs suggested ts-ignore here
    const { logo } = props.selectProps;
    return (
        <components.Control {...props}>
            <img src={logo} height="20px" width="20px" />
            {children}
        </components.Control>
    );
};

const Option = ({ children, ...props }: OptionProps<TokenOption, false>) => {
    return (
        <components.Option {...props}>
            <img src={props.data.logo} className="w-5 h-5 mr-3" />
            {children}
        </components.Option>
    );
};

interface TokenDropdownProps {
    selectTokenOption: TokenOption;
    setToken: (token: TokenOption) => void;
}

const TokenDropdown = ({ selectTokenOption, setToken }: TokenDropdownProps) => {
    const onChange = (
        option: TokenOption | null,
        actionMeta: ActionMeta<TokenOption>
    ) => {
        if (option) {
            setToken(option);
        }
    };

    return (
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
            className="centered-shadow-sm rounded-2xl"
        />
    );
};

export default TokenDropdown;
