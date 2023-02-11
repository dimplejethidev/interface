/* eslint-disable */

describe("Test User Login", () => {
    before(() => {
        // this line is necessary to make sure we have a clean slate and empty a cached connection by a previous test spec
        cy.disconnectMetamaskWalletFromAllDapps();
    });

    it("Should show connect wallet if not logged in", () => {
        cy.visit(`/`);
        cy.findByText("Welcome to aqueduct!").should("be.visible");

        const nextButton = cy.findByRole("button", {
            name: "welcome-tutorial-next-button",
        });
        nextButton.click();

        cy.findByTestId(
            "welcome-tutorial-section-1. Connect your wallet"
        ).should("exist");
        nextButton.click();

        cy.findByTestId(
            "welcome-tutorial-section-2. Request some tokens"
        ).should("exist");
        nextButton.click();

        cy.findByTestId("welcome-tutorial-section-3. Start a swap").should(
            "exist"
        );
        nextButton.click();

        cy.findByTestId(
            "welcome-tutorial-section-4. Watch your balances"
        ).should("exist");
        nextButton.click();

        cy.findByTestId("welcome-tutorial-section-Need more help?").should(
            "exist"
        );
        nextButton.click();

        const connectWalletButton = cy.findByRole("button", {
            name: "connect-wallet",
        });
        connectWalletButton.click();

        cy.findByText("MetaMask").click();
        cy.acceptMetamaskAccess();
    });
});

export {};
