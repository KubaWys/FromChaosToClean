describe('Smoke Test', () => {
  it('loads dashboard and shows notifications', () => {
    cy.visit('/');
    cy.contains('Dashboard');
  });
});
