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
import { ETHxp, fDAI, fDAIxp, fUSDC, fUSDCxp } from "../utils/constants";
import tokens from "../utils/tokens";

type IsMulti = false;
const customStyles: StylesConfig<TokenOption, IsMulti> = {
    menu: (provided) => ({
        ...provided,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 16,
        marginTop: 10
    }),
    menuList: (provided) => ({
        ...provided,
        paddingTop: 0,
        paddingBottom: 0
    }),
    option: (provided) => ({
        ...provided,
        padding: 20,
        borderRadius: 10,
        fontSize: "1.5rem",
        fontWeight: 600,
        marginTop: 8,
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center'
    }),
    control: (provided) => ({
        ...provided,
        padding: 20,
        borderRadius: 16,
        fontSize: "1.5rem",
        fontWeight: 600,
        marginTop: 10,
        borderWidth: 1,
        borderColor: "rgb(229 231 235)"
    }),
};

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
            <img src={props.data.imgUrl} className='w-5 h-5 mr-3'/>
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
            options={tokens}
            styles={customStyles}
            // @ts-ignore
            imgUrl={selectTokenOption.imgUrl}
            placeholder={selectTokenOption.label}
            isSearchable
            isClearable
            isMulti={false}
            instanceId="react-select" // Added this property to resolve this warning: https://stackoverflow.com/questions/61290173/react-select-how-do-i-resolve-warning-prop-id-did-not-match
            className="centered-shadow-sm rounded-2xl"
        />
    );
};

export default TokenDropdown;
