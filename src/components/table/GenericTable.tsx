import WidgetContainer from "../widgets/WidgetContainer";
import TableRow from "./TableRow";

interface GenericTableProps {
    title: string;
    labels: string[];
    columnProps: string[];
    columnComponents: ((...args: any) => JSX.Element)[];
    rowLinks: string[] | undefined;
    data: any[][] | undefined;
    isLoading: boolean;
}

const GenericTable = ({
    title,
    labels,
    columnProps,
    columnComponents,
    rowLinks,
    data,
    isLoading,
}: GenericTableProps) => (
    <WidgetContainer title={title} isUnbounded>
        <div className="flex px-4">
            {labels.map((label, i) => (
                <div className={columnProps[i]} key={label}>
                    {label}
                </div>
            ))}
        </div>
        {isLoading && (
            <div className="flex flex-col space-y-4">
                {[0, 1, 2].map((i) => (
                    <div
                        className="w-full p-4 text-transparent bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"
                        key={`loading-${i}`}
                    >
                        -
                    </div>
                ))}
            </div>
        )}

        {data && data.length > 0 ? (
            <div className="flex flex-col space-y-4">
                {data.map((d, i) => (
                    <TableRow
                        columnProps={columnProps}
                        columnComponents={columnComponents}
                        link={rowLinks ? rowLinks[i] : ""}
                        data={d}
                        // TODO: don't use index as key
                        // eslint-disable-next-line react/no-array-index-key
                        key={`column-${i}`}
                    />
                ))}
            </div>
        ) : (
            <p className="ml-4">You currently don&apos;t have any streams</p>
        )}
    </WidgetContainer>
);

export default GenericTable;
