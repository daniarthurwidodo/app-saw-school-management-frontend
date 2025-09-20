/// <reference path="../cypress.d.ts" />

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays login form', () => {
    cy.get('h1').should('contain', 'Login')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('requires email and password', () => {
    cy.get('button[type="submit"]').click()
    cy.get('.alert').should('contain', 'Please fill in all fields')
  })

  it('allows user to login with valid credentials', () => {
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
    cy.get('.dashboard-header').should('contain', 'Dashboard')
  })

  it('shows error for invalid credentials', () => {
    cy.get('input[type="email"]').type('wrong@example.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.get('.alert').should('contain', 'Invalid credentials')
  })
})