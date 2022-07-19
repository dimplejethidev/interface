import Link from "next/link";

const Header = () => {
    return (
        <header className="flex justify-evenly">
            <h1 className="text-3xl font-bold">Aqueduct</h1>
            <ul className="flex justify-between">
                <li>
                    <Link href="/">
                        <a>Swap</a>
                    </Link>
                </li>
                <li>
                    <Link href="/provide-liquidity">
                        <a>Provide Liquidity</a>
                    </Link>
                </li>
            </ul>
        </header>
    );
};

export default Header;
