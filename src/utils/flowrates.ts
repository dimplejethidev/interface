import { GenericDropdownOption } from "../types/GenericDropdownOption";

const flowrates: GenericDropdownOption[] = [
    { label: "/sec", value: 1 },
    { label: "/min", value: 60 },
    { label: "/hour", value: 3600 },
    { label: "/day", value: 3600 * 24 },
    { label: "/week", value: 3600 * 24 * 7 },
    { label: "/month", value: 3600 * 24 * 30 },
    { label: "/year", value: 3600 * 24 * 365 },
];

export default flowrates;
