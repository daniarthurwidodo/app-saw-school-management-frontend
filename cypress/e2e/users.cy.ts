/// <reference path="../cypress.d.ts" />

describe('Users Management', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/dashboard/users')
  })

  it('displays users table', () => {
    cy.get('h1').should('contain', 'User Management')
    cy.get('.filter-card').should('be.visible')
    cy.get('table').should('be.visible')
    cy.get('tbody tr').should('have.length.greaterThan', 0)
  })

  it('allows searching users', () => {
    cy.get('.task-search-input').type('John')
    cy.get('tbody tr').should('have.length.greaterThan', 0)
    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).should('contain', 'John')
    })
  })

  it('allows filtering by role', () => {
    cy.get('select').eq(0).select('student')
    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).find('td').eq(1).should('contain', 'Student')
    })
  })

  it('allows filtering by status', () => {
    cy.get('select').eq(1).select('active')
    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).find('td').eq(4).should('contain', 'Active')
    })
  })

  it('supports pagination', () => {
    cy.get('.pagination').should('be.visible')
    cy.get('.page-link').contains('2').click()
    cy.url().should('include', 'page=2')
  })
})