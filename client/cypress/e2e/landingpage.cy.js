describe("landing page", () => {
  it("loads", () => {
    cy.visit("http://localhost:3000");
    cy.get(".MuiButton-containedPrimary").contains("Sign Up");
    cy.get(".MuiButton-outlined").contains("Login");
  });

  it("goes to sign up page", () => {
    cy.visit("http://localhost:3000");
    cy.get(".MuiButton-containedPrimary")
      .click()
      .url()
      .should("include", "/signup");
  });

  it("goes to sign in page", () => {
    cy.visit("http://localhost:3000");
    cy.get(".MuiButton-outlined").click().url().should("include", "/signin");
  });
});
