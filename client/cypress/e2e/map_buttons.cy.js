describe("community map page buttons", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/community-map");
  });

  it("navigate to create event page when create event button is clicked", () => {
    cy.get("button").contains("Create Event").click();
    cy.url().should("include", "/create-event");
  });

  it("navigate to create notice page when create notice button is clicked", () => {
    cy.get("button").contains("Create Notice").click();
    cy.url().should("include", "/create-notice");
  });
});
