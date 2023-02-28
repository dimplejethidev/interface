/* eslint-disable testing-library/await-async-query */
import MyStreamsPage from "../pages/my-streams-page";
import Page from "../pages/page";
import SwapPage from "../pages/swap-page";
import WelcomePage from "../pages/welcome-page";
import WrapPage from "../pages/wrap-page";

describe("Completes welcome page slides", () => {
    before(() => {
        // this line is necessary to make sure we have a clean slate and empty a cached connection by a previous test spec
        cy.disconnectMetamaskWalletFromAllDapps();
    });

    it("should complete tutorial", () => {
        cy.visit(`/`);

        cy.findByText("Welcome to aqueduct!").should("be.visible");

        WelcomePage.getNextButton().click();

        cy.findByTestId(
            "welcome-tutorial-section-1. Connect your wallet"
        ).should("exist");
        WelcomePage.getNextButton().click();

        cy.findByTestId(
            "welcome-tutorial-section-2. Request some tokens"
        ).should("exist");
        WelcomePage.getNextButton().click();

        cy.findByTestId("welcome-tutorial-section-3. Start a swap").should(
            "exist"
        );
        WelcomePage.getNextButton().click();

        cy.findByTestId(
            "welcome-tutorial-section-4. Watch your balances"
        ).should("exist");
        WelcomePage.getNextButton().click();

        cy.findByTestId("welcome-tutorial-section-Need more help?").should(
            "exist"
        );
        WelcomePage.getNextButton().click();

        Page.getConnectWalletButton().should("be.visible");
    });
});

describe("Test E2E Swap", () => {
    before(() => {
        // this line is necessary to make sure we have a clean slate and empty a cached connection by a previous test spec
        cy.disconnectMetamaskWalletFromAllDapps();
    });

    beforeEach(() => {
        // Prvents welcome message being shown between tests
        window.localStorage.setItem("hide-welcome-message", "true");
    });

    // eslint-disable-next-line ui-testing/missing-assertion-in-test
    it("should connect wallet", () => {
        Page.getConnectWalletButton().click();

        cy.findByText("MetaMask").click();
        cy.acceptMetamaskAccess();
    });

    it("should wrap tokens", () => {
        WrapPage.getWrapUnwrapPageButton().click();

        WrapPage.getWrapInput().should("exist");
        WrapPage.getWrapInput().click().focused().type("10");
        WrapPage.getWrapButton().click();

        cy.confirmMetamaskPermissionToSpend();
        cy.findByText("Token spend approved", { timeout: 60000 }).should(
            "exist"
        );

        cy.confirmMetamaskTransaction();
        cy.findByText("Wrapped 10.0 fDAI", {
            timeout: 60000,
        }).should("exist");
    });

    it("should swap tokens", () => {
        SwapPage.getSwapPageButton().click();

        SwapPage.getOutboundSwapInput().should("exist");
        SwapPage.getOutboundSwapInput().click().focused().type("10");
        SwapPage.getLoadingSpinner().should("not.exist");
        SwapPage.getConfirmBufferWarningCheckbox().should("exist");
        SwapPage.getConfirmBufferWarningCheckbox().click();
        SwapPage.getSwapButton().should("exist");
        SwapPage.getSwapButton().click();

        cy.confirmMetamaskTransaction({ timeout: 60000 });
        cy.findByText("Swap started", {
            timeout: 60000,
        }).should("exist");
    });

    it("view swao", () => {
        Page.getMyStreamsPageButton().click();

        cy.findByText("fDAIxp").should("exist");
        cy.findByText("/").should("exist");
        cy.findByText("fUSDCxp").should("exist");
        cy.findByText("fUSDCxp").click();
    });

    it("cancel swao", () => {
        MyStreamsPage.getDeleteStreamButton().click();

        cy.confirmMetamaskTransaction();
        cy.findByText("Deleted stream", {
            timeout: 60000,
        }).should("exist");
    });
});
