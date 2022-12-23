import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiChevronDown } from "react-icons/hi";
import Image from "next/image";
import { GenericDropdownOption } from "../types/GenericDropdownOption";
import { TokenOption } from "../types/TokenOption";

interface SelectProps {
    options: GenericDropdownOption[] | TokenOption[];
    dropdownValue: GenericDropdownOption | TokenOption;
    setDropdownValue:
    | ((value: GenericDropdownOption) => void)
    | ((token: TokenOption) => void);
    // eslint-disable-next-line react/require-default-props
    isNonSuperToken?: boolean;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const Select = ({
    options,
    dropdownValue,
    setDropdownValue,
    isNonSuperToken,
}: SelectProps) => (
    <Listbox value={dropdownValue} onChange={setDropdownValue}>
        {({ open }) => (
            <div className="relative flex-shrink-0 focus-within:textbox-outline rounded-lg">
                <Listbox.Button className="flex relative w-full shadow-sm rounded-lg border border-gray-200 bg-white dark:bg-transparent dark:border-zinc-600 dark:text-gray-400 py-4 pl-4 pr-2 space-x-2 hover:border-aqueductBlue dark:hover:border-aqueductBlue text-sm">
                    {dropdownValue.logo && (
                        <Image
                            src={dropdownValue.logo}
                            width="20"
                            height="20"
                        />
                    )}
                    <span className="flex items-center ">
                        <span className="block truncate">
                            {dropdownValue.label}
                        </span>
                    </span>
                    <HiChevronDown
                        className="h-5 w-5 text-gray-400 flex flex-shrink-0"
                        aria-hidden="true"
                    />
                </Listbox.Button>
                <Transition
                    show={open}
                    as={Fragment}
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                    <Listbox.Options className="absolute z-50 mt-2 flex flex-col flex-shrink-0 overflow-auto rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm dark:bg-white/10 dark:backdrop-blur-lg dark:border-red-500">
                        {options.map((option) => (
                            <Listbox.Option
                                key={option.value}
                                className={({ active }) =>
                                    classNames(
                                        active
                                            ? "text-aqueductBlue bg-aqueductBlue/10 "
                                            : " text-gray-900 dark:text-zinc-400",
                                        "relative cursor-pointer select-none py-3 pl-2 pr-10"
                                    )
                                }
                                value={option}
                            >
                                {({ selected }) => (
                                    <div className="flex items-center ml-3 space-x-3">
                                        {option.logo && (
                                            <div className="w-5 h-5">
                                                <Image
                                                    src={option.logo}
                                                    width={20}
                                                    height={20}
                                                />
                                            </div>
                                        )}
                                        <span
                                            className={classNames(
                                                selected
                                                    ? "font-semibold"
                                                    : "font-normal"
                                            )}
                                        >
                                            {isNonSuperToken &&
                                                "underlyingToken" in option &&
                                                option.underlyingToken
                                                ? option.underlyingToken.label
                                                : option.label}
                                        </span>
                                    </div>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        )}
    </Listbox>
);

export default Select;
