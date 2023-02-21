/* eslint-disable testing-library/await-async-query */
describe("Test User Login", () => {
    before(() => {
        // this line is necessary to make sure we have a clean slate and empty a cached connection by a previous test spec
        cy.disconnectMetamaskWalletFromAllDapps();
    });

    it("Should show connect wallet if not logged in", () => {
        const getNextButton = () => {
            return cy.findByRole("button", {
                name: "welcome-tutorial-next-button",
            });
        };
        const getConnectWalletButton = () => {
            return cy.findByRole("button", {
                name: "connect-wallet",
            });
        };
        const getWrapUnwrapPageButton = () => {
            return cy.findByRole("button", {
                name: "Wrap / Unwrap page link",
            });
        };
        const getWrapInput = () => {
            return cy.findByRole("textbox", {
                name: "Wrap amount input field",
            });
        };

        const getWrapButton = () => {
            return cy.findByRole("button", {
                name: "Wrap button",
            });
        };

        const getSwapPageButton = () => {
            return cy.findByRole("button", {
                name: "Swap page link",
            });
        };

        const getOutboundSwapInput = () => {
            return cy.findByRole("textbox", {
                name: "fDAIxp swap flow-rate input field",
            });
        };

        const getLoadingSpinner = () => {
            return cy.findByTestId("loading-spinner");
        };

        const getConfirmBufferWarningCheckbox = () => {
            return cy.findByRole("button", {
                name: "Confirm buffer warning checkbox",
            });
        };

        const getSwapButton = () => {
            return cy.findByRole("button", {
                name: "Swap button",
            });
        };

        const getMyStreamsPageButton = () => {
            return cy.findByRole("button", {
                name: "My Streams page link",
            });
        };

        // const getTableRowLink = () => {
        //     return cy.findByTestId("table-row-link");
        // };

        // const getDeleteStreamButton = () => {
        //     return cy.findByRole("button", {
        //         name: "Delete stream button",
        //     });
        // };

        cy.visit(`/`);

        // Complete welcome tutorial
        cy.findByText("Welcome to aqueduct!").should("be.visible");

        getNextButton().click();

        cy.findByTestId(
            "welcome-tutorial-section-1. Connect your wallet"
        ).should("exist");
        getNextButton().click();

        cy.findByTestId(
            "welcome-tutorial-section-2. Request some tokens"
        ).should("exist");
        getNextButton().click();

        cy.findByTestId("welcome-tutorial-section-3. Start a swap").should(
            "exist"
        );
        getNextButton().click();

        cy.findByTestId(
            "welcome-tutorial-section-4. Watch your balances"
        ).should("exist");
        getNextButton().click();

        cy.findByTestId("welcome-tutorial-section-Need more help?").should(
            "exist"
        );
        getNextButton().click();

        // Connect wallet
        getConnectWalletButton().click();

        cy.findByText("MetaMask").click();
        cy.acceptMetamaskAccess();

        // Wrap tokens
        getWrapUnwrapPageButton().click();

        getWrapInput().should("exist");
        getWrapInput().click().focused().type("10");
        getWrapButton().click();

        cy.confirmMetamaskPermissionToSpend();
        // TODO: await transactions instead of manually waiting
        // eslint-disable-next-line cypress/no-unnecessary-waiting, ui-testing/no-hard-wait, testing-library/await-async-utils
        cy.wait(25000);
        cy.confirmMetamaskTransaction();
        // eslint-disable-next-line cypress/no-unnecessary-waiting, ui-testing/no-hard-wait, testing-library/await-async-utils
        cy.wait(40000);

        // Start swap
        getSwapPageButton().click();

        getOutboundSwapInput().should("exist");
        getOutboundSwapInput().click().focused().type("10");
        getLoadingSpinner().should("not.exist");
        getConfirmBufferWarningCheckbox().should("exist");
        getConfirmBufferWarningCheckbox().click();
        getSwapButton().should("exist");
        getSwapButton().click();

        cy.confirmMetamaskTransaction({ timeout: 60000 });
        // eslint-disable-next-line cypress/no-unnecessary-waiting, ui-testing/no-hard-wait, testing-library/await-async-utils
        cy.wait(25000);

        // View swap
        getMyStreamsPageButton().click();
        // TODO: finish below
        // getTableRowLink().should("exist");
        // getTableRowLink().click();

        // Cancel swap
        // getDeleteStreamButton().click();
        // cy.confirmMetamaskTransaction();

        // eslint-disable-next-line cypress/no-unnecessary-waiting, ui-testing/no-hard-wait, testing-library/await-async-utils
        // cy.wait(25000);
        // getTableRowLink().should("not.exist");
    });
});

export {};
