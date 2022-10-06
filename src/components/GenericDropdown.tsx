import Select, {
    components,
    ControlProps,
    OptionProps,
    StylesConfig,
    ActionMeta,
} from "react-select";
import { GenericDropdownOption } from "../types/GenericDropdownOption";

type IsMulti = false;
export const customStyles: StylesConfig<GenericDropdownOption, IsMulti> = {
    menu: (provided) => ({
        ...provided,
        paddingLeft: 8,
        borderRadius: 16
    }),
    menuList: (provided) => ({
        ...provided,
        paddingTop: 0,
        paddingRight: 8,
        paddingBottom: 0,
    }),
    option: (provided) => ({
        ...provided,
        padding: 20,
        borderRadius: 10,
        fontSize: "0.85rem",
        fontWeight: 600,
        marginTop: 8,
        marginBottom: 8,
        display: "flex",
        alignItems: "center"
    }),
    control: (base, state) => ({
        ...base,
        width: '8.5rem',
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
        height: '100%',
        fontSize: "0.85rem",
        borderWidth: 1,
        borderColor: "rgb(229 231 235)",
        boxShadow: state.isFocused ? '0 0 0 1px #0460CE' : 'none',
        '&:hover': {
            border: '1px solid #0460CE',
        },
        fontWeight: 600,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "rgb(100 116 139)"
    })
};

const Control = ({ children, ...props }: ControlProps<GenericDropdownOption, false>) => {
    // @ts-ignore - react-select docs suggested ts-ignore here
    const { logo } = props.selectProps;
    return (
        <components.Control {...props}>
            {children}
        </components.Control>
    );
};

const Option = ({ children, ...props }: OptionProps<GenericDropdownOption, false>) => {
    return (
        <components.Option {...props}>
            {children}
        </components.Option>
    );
};

interface GenericDropdownProps {
    options: GenericDropdownOption[];
    dropdownValue: GenericDropdownOption;
    setDropdownValue: (value: GenericDropdownOption) => void;
}

const TokenDropdown = ({ options, dropdownValue, setDropdownValue }: GenericDropdownProps) => {
    const onChange = (
        option: GenericDropdownOption | null,
        actionMeta: ActionMeta<GenericDropdownOption>
    ) => {
        if (option) {
            setDropdownValue(option);
        }
    };

    return (
        <Select
            components={{ Control, Option }}
            onChange={onChange}
            options={options}
            styles={customStyles}
            // @ts-ignore - react-select docs suggested ts-ignore here
            //placeholder={selectTokenOption.label}
            //isSearchable
            value={dropdownValue}
            isMulti={false}
            isSearchable={false}
            instanceId="react-select" // Added this property to resolve this warning: https://stackoverflow.com/questions/61290173/react-select-how-do-i-resolve-warning-prop-id-did-not-match
            className="flex border-gray-200 border-l-[1px] outline-red-500 text-slate-500 poppins-font"
        />
    );
};

export default TokenDropdown;
