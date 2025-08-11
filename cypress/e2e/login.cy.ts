describe('Login Flow', () => {
  it('logs in with valid credentials', () => {
    cy.visit('/')
    cy.get('input[name="email"], input[type="email"]').type('alice.smith@generalhospital.com')
    cy.get('input[name="password"], input[type="password"]').type('password123')
    cy.get('button[type="submit"], button').contains(/login/i).click()
    cy.url().should('eq', Cypress.config('baseUrl') + '/hospital/inventory')
    cy.contains('h1, h2', /inventory management/i)
  })
})
