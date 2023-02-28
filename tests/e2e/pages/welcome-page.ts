import Page from "./page";

export default class WelcomePage extends Page {
    static getNextButton = () => {
        return cy.findByRole("button", {
            name: "welcome-tutorial-next-button",
        });
    };
}
