/// <reference path="../cypress.d.ts" />

describe('Settings Page', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/dashboard/settings')
  })

  it('displays settings sections', () => {
    cy.get('h1').should('contain', 'Settings')
    cy.get('.settings-section').should('have.length', 5)
  })

  it('has working action buttons', () => {
    cy.get('.settings-section').first().find('button').click()
    // Since these are just UI elements, we can't test actual functionality
    // but we can verify the buttons are clickable
  })

  it('maintains consistent layout', () => {
    cy.get('.settings-section').each(($section) => {
      cy.wrap($section).find('h5').should('be.visible')
      cy.wrap($section).find('p').should('be.visible')
      cy.wrap($section).find('button').should('be.visible')
    })
  })
})