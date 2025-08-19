describe('Inventory Management', () => {
  beforeEach(() => {
    cy.login('alice.smith@generalhospital.com', 'password123')
  })

  it('adds a new inventory item', () => {
    cy.contains('button', /add item/i).click()
    cy.get('input[name="product-name"]').focus()
    cy.get('input[name="product-name"]').type('AA E2E Test Item')
    cy.get('input[name="manufacturer"]').focus()
    cy.get('input[name="manufacturer"]').type('E2E Manufacturer')
    cy.get('input[name="category"]').focus()
    cy.get('input[name="category"]').type('E2E Category')
    cy.get('input[name="quantity"]').focus()
    cy.get('input[name="quantity"]').type('42')
    cy.get('input[name="expiry-date"]').focus()
    cy.get('input[name="expiry-date"]').type('31/12/2030')
    cy.get('input[name="unit-price"]').focus()
    cy.get('input[name="unit-price"]').type('99.99')
    cy.get('button[type="submit"], button').contains(/save/i).click()

    cy.contains('td', 'AA E2E Test Item').should('exist')
  })

  it('edits an inventory item', () => {
    cy.get('tbody tr')
      .first()
      .then(($row) => {
        const oldName = $row.find('td').first().text().trim()
        cy.wrap($row).find('[data-testid="edit-item-button"]').click()

        cy.get('input[name="product-name"]').clear()
        cy.get('input[name="product-name"]').type('AA E2E Test Item Edited')
        cy.get('button[type="submit"], button').contains(/save/i).click()

        cy.contains('td', 'AA E2E Test Item Edited').should('exist')
        cy.contains('td', oldName).should('not.exist')
      })
  })

  it('deletes an inventory item', () => {
    cy.get('tbody tr')
      .first()
      .then(($row) => {
        const oldName = $row.find('td').first().text().trim()
        cy.wrap($row).find('[data-testid="delete-item-button"]').click()
        cy.get('[data-testid="delete-item-dialog"]').within(() => {
          cy.contains('button', /delete/i).click()
        })

        cy.contains('td', oldName).should('not.exist')
      })
  })
})
