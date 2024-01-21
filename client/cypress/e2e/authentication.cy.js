describe("sign in page", () => {
  it("loads", () => {
    cy.visit("http://localhost:3000/signin");
    cy.get(".MuiTypography-root").contains("Sign In");
  });

  it("goes to forgot password", () => {
    cy.get("a").click();
    cy.url().should("include", "/reset");
  });
});

describe("sign up page", () => {
  it("loads", () => {
    cy.visit("http://localhost:3000/signup");
    cy.get(".MuiTypography-root").contains("Sign Up");
  });
});
