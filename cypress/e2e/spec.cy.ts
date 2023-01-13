describe("E2E Tests", () => {
  it("Visits the root url successfully", () => {
    cy.visit("http://localhost:3000");
  });
});

export {};
