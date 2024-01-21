describe("feed page spec", () => {
  it("loads feed page", () => {
    cy.visit("http://localhost:3000/feed");
    cy.contains("Feed");
  });

  it("share new post", () => {
    cy.get(".MuiInputBase-root").type(
      "This is a test post created by Cypress Testing"
    );
    cy.get(".MuiGrid-grid-xs-1 > .MuiButtonBase-root")
      .contains("Share")
      .click();

    cy.get(".MuiList-root").contains(
      "This is a test post created by Cypress Testing"
    );
  });

  it("opent he add a new comment modal", () => {
    cy.get(
      ":nth-child(1) > .MuiListItemText-root > .MuiListItemText-secondary > :nth-child(6)"
    ).click();
    cy.get(".MuiDialogTitle-root > .MuiTypography-root").contains(
      "Add a comment!"
    );

    cy.get("#name").type("This is a test comment added by cypress testing");
    cy.get(".MuiDialogActions-root > :nth-child(2)").click();
    cy.get(".MuiList-root").contains(
      "This is a test comment added by cypress testing"
    );
  });
});
