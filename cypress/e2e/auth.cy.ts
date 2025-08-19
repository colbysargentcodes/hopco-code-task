describe('Auth', () => {
  it('logs in with valid credentials', () => {
    cy.login('alice.smith@generalhospital.com', 'password123')

    cy.url().should('eq', Cypress.config('baseUrl') + '/hospital/inventory')
    cy.contains('h1', /inventory management/i)
  })

  it('returns to login page after sign out', () => {
    cy.login('alice.smith@generalhospital.com', 'password123')

    cy.get('header button').find('i.mdi-account-circle').click()
    cy.contains('.v-list-item', /sign out/i).click()

    cy.url().should('eq', Cypress.config('baseUrl') + '/auth/login')
    cy.contains('h3', /login/i)
  })
})
