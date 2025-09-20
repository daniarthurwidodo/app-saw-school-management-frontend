/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in a user
     * @example cy.login()
     * @example cy.login('user@example.com', 'password123')
     */
    login(email?: string, password?: string): Chainable<void>

    /**
     * Custom command to log out a user
     * @example cy.logout()
     */
    logout(): Chainable<void>

    /**
     * Custom command to drag an element to a target
     * @example cy.get('.draggable').dragTo('.droppable')
     */
    dragTo(targetSelector: string): Chainable<Element>
  }
}