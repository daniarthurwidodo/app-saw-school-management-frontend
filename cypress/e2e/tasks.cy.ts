/// <reference path="../cypress.d.ts" />

describe('Tasks Management', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/dashboard/tasks')
  })

  it('displays kanban board', () => {
    cy.get('h1').should('contain', 'Task Board')
    cy.get('.filter-card').should('be.visible')
    cy.get('.kanban-board').should('be.visible')
    cy.get('.kanban-column').should('have.length', 3)
  })

  it('allows searching tasks', () => {
    cy.get('.task-search-input').type('Registration')
    cy.get('.task-card').should('have.length.greaterThan', 0)
  })

  it('allows filtering by priority', () => {
    cy.get('select').eq(0).select('high')
    // Check that only high priority tasks are displayed
  })

  it('allows filtering by assignee', () => {
    cy.get('select').eq(1).select('1') // John Smith
    // Check that only tasks assigned to John Smith are displayed
  })

  it('supports drag and drop tasks between columns', () => {
    cy.get('.task-card').first().as('draggedTask')
    cy.get('.kanban-column').eq(1).as('targetColumn')
    
    // Get initial task status
    cy.get('@draggedTask').invoke('attr', 'data-task-id').then((taskId) => {
      // Drag task to target column
      cy.get('@draggedTask').dragTo('@targetColumn')
      
      // Verify task moved to new column
      cy.get('@targetColumn').find(`[data-task-id="${taskId}"]`).should('exist')
    })
  })

  it('displays task details in modal when clicked', () => {
    cy.get('.task-card').first().click()
    cy.get('.modal').should('be.visible')
    cy.get('.modal-title').should('be.visible')
  })
})