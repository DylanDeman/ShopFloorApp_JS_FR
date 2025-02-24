// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email, password) => {
  cy.visit('http://localhost:5173');
  cy.get('[data-cy=loginEmail]').clear();
  if (email) cy.get('[data-cy=loginEmail]').type(email);

  cy.get('[data-cy=loginWachtwoord]').clear();
  if (password) cy.get('[data-cy=loginWachtwoord]').type(password);

  cy.get('[data-cy=loginSubmitButton]').click();
  cy.get('body').click(0, 0);
});
