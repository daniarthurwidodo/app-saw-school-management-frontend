/// <reference path="../cypress.d.ts" />

describe('Documents Management', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/dashboard/documents')
  })

  it('displays documents table', () => {
    cy.get('h1').should('contain', 'Document Management')
    cy.get('.filter-card').should('be.visible')
    cy.get('table').should('be.visible')
    cy.get('tbody tr').should('have.length.greaterThan', 0)
  })

  it('allows searching documents', () => {
    cy.get('.task-search-input').type('Handbook')
    cy.get('tbody tr').should('have.length.greaterThan', 0)
    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).should('contain', 'Handbook')
    })
  })

  it('allows filtering by category', () => {
    cy.get('select').eq(0).select('Academic')
    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).find('td').eq(1).should('contain', 'Academic')
    })
  })

  it('allows filtering by type', () => {
    cy.get('select').eq(1).select('PDF')
    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).find('td').eq(2).should('contain', 'PDF')
    })
  })

  it('allows filtering by status', () => {
    cy.get('select').eq(2).select('published')
    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).find('td').eq(6).should('contain', 'published')
    })
  })

  it('supports pagination', () => {
    cy.get('.pagination').should('be.visible')
    cy.get('.page-link').contains('2').click()
    cy.url().should('include', 'page=2')
  })
})