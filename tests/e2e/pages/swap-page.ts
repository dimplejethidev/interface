import Page from "./page";

export default class SwapPage extends Page {
    static getOutboundSwapInput = () => {
        return cy.findByRole("textbox", {
            name: "fDAIxp swap flow-rate input field",
        });
    };

    static getConfirmBufferWarningCheckbox = () => {
        return cy.findByRole("button", {
            name: "Confirm buffer warning checkbox",
        });
    };

    static getSwapButton = () => {
        return cy.findByRole("button", {
            name: "Swap button",
        });
    };
}
