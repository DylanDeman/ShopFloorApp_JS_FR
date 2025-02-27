describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should display the login form', () => {
    cy.get('[data-cy=loginEmail]').should('be.visible');
    cy.get('[data-cy=loginWachtwoord]').should('be.visible');
    cy.get('[data-cy=loginSubmitButton]').should('be.visible');
  });

  it('should show validation errors when submitting an empty form', () => {
    cy.get('[data-cy=loginEmail]').clear();
    cy.get('[data-cy=loginWachtwoord]').clear();
    cy.get('[data-cy=loginSubmitButton]').click();

    cy.contains('Email is verplicht').should('be.visible');
    cy.contains('Wachtwoord is verplicht').should('be.visible');
  });

  it('should login successfully with valid credentials', () => {
    cy.intercept('POST', '/api/sessions', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' }
    }).as('loginRequest');

    cy.get('[data-cy=loginEmail]').clear().type('robert.devree@hotmail.com');
    cy.get('[data-cy=loginWachtwoord]').clear().type('UUBE4UcWvSZNaIw');
    cy.get('[data-cy=loginSubmitButton]').click();

    cy.wait('@loginRequest');
  });

  it('should show an error message on failed login', () => {
    cy.intercept('POST', '/api/sessions', {
      statusCode: 401,
      body: { message: 'Ongeldige inloggegevens' }
    }).as('loginRequest');

    cy.get('[data-cy=loginEmail]').clear().type('wrong@example.com');
    cy.get('[data-cy=loginWachtwoord]').clear().type('wrongpassword');
    cy.get('[data-cy=loginSubmitButton]').click();

    cy.wait('@loginRequest');
    cy.contains('Ongeldige inloggegevens').should('be.visible');
  });
});
