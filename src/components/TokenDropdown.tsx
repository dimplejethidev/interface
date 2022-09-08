import Select, {
    components,
    ControlProps,
    OptionProps,
    StylesConfig,
    ActionMeta
} from "react-select";
import Token from "../types/Token";
import ethLogo from "./../../public/eth-logo.png";
import daiLogo from "./../../public/dai-logo.png";
import usdcLogo from "./../../public/usdc-logo.png";
import { TokenOption } from "../types/TokenOption";

type IsMulti = false;
const customStyles: StylesConfig<TokenOption, IsMulti> = {
    menu: (provided) => ({
        ...provided,
        borderRadius: 15,
        marginTop: 0,
    }),
    menuList: (provided) => ({
        ...provided,
        paddingTop: 0,
        paddingBottom: 0,
    }),
    option: (provided) => ({
        ...provided,
        padding: 20,
        borderRadius: 15,
        fontSize: "1.5rem",
        fontWeight: 600,
    }),
    control: (provided) => ({
        ...provided,
        padding: 20,
        borderRadius: 15,
        fontSize: "1.5rem",
        fontWeight: 600,
        marginTop: 10,
    }),
};

const options: TokenOption[] = [
    {
        label: "ETHxp",
        value: Token.ETHxp,
        imgUrl: ethLogo.src,
    },
    {
        label: "fDAIxp",
        value: Token.fDAIxp,
        imgUrl: daiLogo.src,
    },
    {
        label: "fUSDCxp",
        value: Token.fUSDCxp,
        imgUrl: usdcLogo.src,
    },
];

const Control = ({ children, ...props }: ControlProps<TokenOption, false>) => {
    // @ts-ignore
    const { imgUrl } = props.selectProps
    return (
        <components.Control {...props}>
            <img src={imgUrl} height="20px" width="20px" />
            {children}
        </components.Control>
    );
};

const Option = ({ children, ...props }: OptionProps<TokenOption, false>) => {
    return (
        <components.Option {...props}>
            <img src={props.data.imgUrl} height="20px" width="20px" />
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
            setToken(option)
        }
    };

    return (
        <Select
            components={{ Control, Option }}
            onChange={onChange}
            options={options}
            styles={customStyles}
            // @ts-ignore
            imgUrl={selectTokenOption.imgUrl}
            placeholder={selectTokenOption.label}
            isSearchable
            isClearable
            isMulti={false}
            instanceId="react-select" // Added this property to resolve this warning: https://stackoverflow.com/questions/61290173/react-select-how-do-i-resolve-warning-prop-id-did-not-match
        />
    );
};

export default TokenDropdown;
