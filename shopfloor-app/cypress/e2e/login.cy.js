describe('Login Page', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should display the login form', () => {
    cy.get('[data-cy=loginEmail]').should('be.visible');
    cy.get('[data-cy=loginWachtwoord]').should('be.visible');
    cy.get('[data-cy=loginSubmitButton]').should('be.visible');
  });

  it('should show validation errors when submitting empty form', () => {
    cy.login();
    cy.contains('Email is verplicht').should('be.visible');
    cy.contains('Wachtwoord is verplicht').should('be.visible');
  });

  it('should login successfully with valid credentials', () => {
    cy.intercept('POST', 'api/sessions', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' }
    }).as('loginRequest');

    cy.login('robert.devree@hotmail.com', 'UUBE4UcWvSZNaIw');
    cy.wait('@loginRequest');
    cy.url().should('eq',  'http://localhost:5173/home');
  });

  it('should show an error message on failed login', () => {
    cy.intercept('POST', 'api/sessions', {
      statusCode: 401,
      body: { message: 'Ongeldige inloggegevens' }
    }).as('loginRequest');

    cy.login('wrong@example.com', 'wrongpassword');
    cy.wait('@loginRequest');
    cy.contains('Ongeldige inloggegevens').should('be.visible');
  });
});
