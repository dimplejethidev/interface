export default class Page {
    static getConnectWalletButton() {
        return cy.findByRole("button", {
            name: "connect-wallet",
        });
    }

    static getWrapUnwrapPageButton() {
        return cy.findByRole("button", {
            name: "Wrap / Unwrap page link",
        });
    }

    static getSwapPageButton() {
        return cy.findByRole("button", {
            name: "Swap page link",
        });
    }

    static getLoadingSpinner() {
        return cy.findByTestId("loading-spinner");
    }

    static getMyStreamsPageButton() {
        return cy.findByRole("button", {
            name: "My Streams page link",
        });
    }
}
