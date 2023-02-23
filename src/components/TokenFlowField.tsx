/* eslint-disable react/require-default-props */
import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect } from "react";
import { useStore } from "../store";
import { GenericDropdownOption } from "../types/GenericDropdownOption";
import { TokenOption } from "../types/TokenOption";
import tokens from "../utils/tokens";
import Select from "./Select";

interface TokenFlowFieldProps {
    displayedValue: string;
    setDisplayedValue: (number: string) => void;
    setFormattedValue: (number: string) => void;
    dropdownItems?: GenericDropdownOption[];
    dropdownValue?: GenericDropdownOption;
    setDropdownValue?: (value: GenericDropdownOption) => void;
    isEther: boolean;
    isDiscreteAmount?: boolean;
    shouldReformat?: boolean;
    currentBalance: BigNumber;
    token: TokenOption;
    setToken: (token: TokenOption) => void;
    isNonSuperToken?: boolean;
    fieldLabel: string;
}

const TokenFlowField = ({
    displayedValue,
    setDisplayedValue,
    setFormattedValue,
    dropdownItems,
    dropdownValue,
    setDropdownValue,
    isEther,
    isDiscreteAmount,
    shouldReformat,
    currentBalance,
    token,
    setToken,
    isNonSuperToken,
    fieldLabel,
}: TokenFlowFieldProps) => {
    const store = useStore();

    const setFormattedNumberCallback = useCallback(
        async (newValue: string) => {
            function setFormattedNumber() {
                if (newValue === "") {
                    setFormattedValue("");
                    return;
                }

                if (
                    newValue.match("^[0-9]*[.]?[0-9]*$") != null &&
                    newValue !== "."
                ) {
                    let formattedValue = isEther
                        ? ethers.utils.parseUnits(newValue, "ether")
                        : BigNumber.from(newValue);

                    if (!isDiscreteAmount) {
                        formattedValue = formattedValue.div(
                            store.flowrateUnit.value
                        );
                    }

                    setFormattedValue(formattedValue.toString());
                }
            }

            setFormattedNumber();
        },
        [isDiscreteAmount, isEther, setFormattedValue, store.flowrateUnit.value]
    );

    useEffect(() => {
        if (shouldReformat) {
            setFormattedNumberCallback(displayedValue);
        }
    }, [displayedValue, setFormattedNumberCallback, shouldReformat]);

    return (
        <div>
            <div
                className={
                    "hover:border-aqueductBlue focus-within:textbox-outline dark:focus-within:textbox-outline flex flex-col grow border-[1px] border-gray-200 dark:border-gray-700 dark:hover:border-aqueductBlue centered-shadow-sm dark:centered-shadow-sm-dark rounded-2xl " +
                    " px-3 py-3"
                }
            >
                <div className="flex items-end space-x-2">
                    <input
                        className="px-2 pb-2 text-3xl font-semibold monospace-font tracking-widest flex w-full h-min outline-none dark:bg-transparent dark:text-white/90"
                        type="text"
                        pattern="^[0-9]*[.,]?[0-9]*$"
                        placeholder="0"
                        value={displayedValue}
                        onChange={(e) => {
                            // set displayed value
                            if (
                                e.target.value.match("^[0-9]*[.]?[0-9]*$") !=
                                null
                            ) {
                                setDisplayedValue(e.target.value);
                            }

                            // set formatted number
                            setFormattedNumberCallback(e.target.value);
                        }}
                        aria-label={`${fieldLabel} input field`}
                    />
                    {dropdownItems && dropdownValue && setDropdownValue && (
                        <Select
                            options={dropdownItems}
                            dropdownValue={dropdownValue}
                            setDropdownValue={setDropdownValue}
                        />
                    )}
                    <Select
                        options={tokens}
                        dropdownValue={token}
                        setDropdownValue={setToken}
                        isNonSuperToken={isNonSuperToken}
                    />
                </div>
                <div className="flex justify-end2 pt-3 pb-2 px-2 text-xs space-x-2">
                    <p>Balance:</p>
                    <p className="monospace-font tracking-wider">
                        {parseFloat(
                            ethers.utils.formatEther(currentBalance)
                        ) === 0
                            ? "0.0"
                            : parseFloat(
                                  ethers.utils.formatEther(currentBalance)
                              ).toFixed(5)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TokenFlowField;
