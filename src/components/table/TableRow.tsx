import { IconContext } from "react-icons";
import { CgArrowsExpandRight } from "react-icons/cg";
import Link from "next/link";

interface TableRowProps {
    columnProps: string[];
    columnComponents: ((...args: any) => JSX.Element)[];
    link: string;
    data: any[];
}

const TableRow = ({
    columnProps,
    columnComponents,
    link,
    data,
}: TableRowProps) => (
    <Link href={link}>
        <div className="relative flex p-4 items-center rounded-xl dark:text-white border-[1px] border-gray-200 dark:border-gray-700 cursor-pointer hover:centered-shadow dark:hover:centered-shadow-md-dark transition-all duration-300">
            {data.map((d, i) => (
                // TODO: don't use index as key
                // eslint-disable-next-line react/no-array-index-key
                <div className={columnProps[i]} key={`row-${i}`}>
                    {columnComponents[i](d)}
                </div>
            ))}
            <div className="absolute right-4 hidden xs:ml-12 xs:flex">
                {/* TODO: useMemo hook */}
                {/* eslint-disable-next-line react/jsx-no-constructed-context-values */}
                <IconContext.Provider value={{ color: "#64748b" }}>
                    <CgArrowsExpandRight />
                </IconContext.Provider>
            </div>
        </div>
    </Link>
);

export default TableRow;
