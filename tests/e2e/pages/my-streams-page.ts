import Page from "./page";

export default class MyStreamsPage extends Page {
    static getDeleteStreamButton = () => {
        return cy.findByRole("button", {
            name: "Delete stream button",
        });
    };
}
