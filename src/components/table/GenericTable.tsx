import Link from "next/link";
import WidgetContainer from "../widgets/WidgetContainer";

interface TableRowProps {
    columnProps: string[];
    columnComponents: ((...args: any) => JSX.Element)[];
    link: string;
    data: any[];
}

const TableRow = ({ columnProps, columnComponents, link, data }: TableRowProps) => {
    return (
        <Link href={link}>
            <div className="flex p-4 rounded-xl border-[1px] border-gray-200 cursor-pointer hover:centered-shadow transition-all duration-300">
                {
                    data.map((d, i) => {
                        return (
                            <div 
                                className={columnProps[i]} 
                                key={'row-' + i}
                            >
                                {columnComponents[i](d)}
                            </div>
                        )
                    })
                }
            </div>
        </Link>
    )
}

interface GenericTableProps {
    title: string;
    labels: string[];
    columnProps: string[];
    columnComponents: ((...args: any) => JSX.Element)[];
    rowLinks: string[] | undefined;
    data: any[][] | undefined;
    isLoading: boolean;
}

const GenericTable = ({ title, labels, columnProps, columnComponents, rowLinks, data, isLoading }: GenericTableProps) => {
    return (
        <WidgetContainer
            title={title}
            isUnbounded={true}
        >
            <div className="flex px-4">
                {
                    labels.map((label, i) => {
                        return (
                            <div 
                                className={columnProps[i]} 
                                key={label}
                            >
                                {label}
                            </div>
                        )
                    })
                }
            </div>
            {
                isLoading
                    ?
                    <div className="flex flex-col space-y-4">
                        {
                            [0,1,2].map((i) => {
                                return (
                                    <div 
                                        className='w-full p-4 text-transparent bg-gray-200 rounded-2xl animate-pulse'
                                        key={'loading-' + i}
                                    >
                                        {'-'}
                                    </div>
                                )
                            })
                        }
                    </div>
                    :
                    <div className="flex flex-col space-y-4">
                        {
                            data && data.map((d, i) => {
                                return (
                                    <TableRow
                                        columnProps={columnProps}
                                        columnComponents={columnComponents}
                                        link={rowLinks ? rowLinks[i] : ''}
                                        data={d}
                                        key={'column-' + i}
                                    />
                                )
                            })
                        }
                    </div>
            }
        </WidgetContainer>
    )
}

export default GenericTable;