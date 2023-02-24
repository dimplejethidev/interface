import { ExplicitAny } from "./src/types/ExplicitAny";

declare global {
    interface Window {
        ethereum: ExplicitAny;
    }
}

export default global;
