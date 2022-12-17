interface PriceImpactWarningProps {
    priceImpact: number;
}

const PriceImpactWarning = ({
    priceImpact
}: PriceImpactWarningProps) => (
    <div className="flex text-sm font-medium px-6 py-3 rounded-2xl border-[1px] border-red-300/60 dark:border-red-500/30 text-red-800/90 dark:text-red-400/90 ">
        <p>
            Price impact warning
        </p>
        <div className="flex grow" />
        <p>
            {`- ${priceImpact > 0.9999 ? 99.99 : (priceImpact * 100).toFixed(2)}%`}
        </p>
    </div>
);

export default PriceImpactWarning;
