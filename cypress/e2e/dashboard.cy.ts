/// <reference path="../cypress.d.ts" />

describe('Dashboard', () => {
  beforeEach(() => {
    // Login before each test
    cy.login()
  })

  it('displays dashboard elements', () => {
    cy.get('.dashboard-header').should('contain', 'Dashboard')
    cy.get('.stat-card').should('have.length', 4)
    cy.get('.recent-activity-table').should('be.visible')
    cy.get('.quick-actions-grid').should('be.visible')
  })

  it('has working navigation', () => {
    // Test navigation to users page
    cy.get('.sidebar').contains('Users').click()
    cy.url().should('include', '/dashboard/users')
    cy.get('h1').should('contain', 'User Management')
    
    // Test navigation to documents page
    cy.get('.sidebar').contains('Documents').click()
    cy.url().should('include', '/dashboard/documents')
    cy.get('h1').should('contain', 'Document Management')
    
    // Test navigation to tasks page
    cy.get('.sidebar').contains('Tasks').click()
    cy.url().should('include', '/dashboard/tasks')
    cy.get('h1').should('contain', 'Task Board')
    
    // Test navigation to settings page
    cy.get('.sidebar').contains('Settings').click()
    cy.url().should('include', '/dashboard/settings')
    cy.get('h1').should('contain', 'Settings')
  })

  it('displays user statistics', () => {
    cy.get('.stat-card').eq(0).should('contain', 'Total Users')
    cy.get('.stat-card').eq(1).should('contain', 'Documents')
    cy.get('.stat-card').eq(2).should('contain', 'Active Tasks')
    cy.get('.stat-card').eq(3).should('contain', 'Completed Tasks')
  })
})