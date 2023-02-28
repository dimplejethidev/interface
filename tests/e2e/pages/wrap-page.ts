import Page from "./page";

export default class WrapPage extends Page {
    static getWrapInput = () => {
        return cy.findByRole("textbox", {
            name: "Wrap amount input field",
        });
    };

    static getWrapButton = () => {
        return cy.findByRole("button", {
            name: "Wrap button",
        });
    };
}
