describe('SiteToevoegen Page Tests', () => {
  beforeEach(() => {

    cy.intercept('POST', 'http://localhost:9000/api/sessions').as('loginRequest');
    cy.intercept('GET', 'http://localhost:9000/api/users/me').as('getUser');

    cy.login('robert.devree@hotmail.com', '123456789');
    cy.wait('@loginRequest');  // Ensure login is completed
  
    cy.fixture('users_and_machines.json').then((data) => {
      cy.intercept('GET', 'http://localhost:9000/api/users', { body: data.users }).as('getUsers');
      cy.intercept('GET', 'http://localhost:9000/api/machines', { body: data.machines }).as('getMachines');
      cy.intercept('GET', 'http://localhost:9000/api/sites', { statusCode: 201 }).as('getSites');
    });
 
    cy.intercept('POST', 'http://localhost:9000/api/sites', { statusCode: 201 }).as('createSite');

    cy.visit('http://localhost:5173/sites/');

    cy.wait(['@getUsers', '@getSites']);
  });

  it('should load the page and display the form', () => {
    cy.contains('Nieuwe site toevoegen').should('be.visible');
    cy.get('[data-cy="site-name"]').should('exist');
    cy.get('[data-cy="verantwoordelijke-select"]').should('exist');
    cy.get('[data-cy="status-select"]').should('exist');
  });

  it('should select a verantwoordelijke and fill in the form', () => {
    cy.get('[data-cy="site-name"]').type('Test Site');
    cy.get('[data-cy="verantwoordelijke-select"]').select('1');
    cy.get('[data-cy="status-select"]').select('INACTIEF');
  });

  it('should submit the form successfully', () => {
    cy.get('[data-cy="site-name"]').type('Test Site');
    cy.get('[data-cy="verantwoordelijke-select"]').select('1');
    cy.get('[data-cy="submit-button"]').click();
    cy.wait('@createSite');
    cy.contains('Site succesvol toegevoegd!').should('be.visible');
  });

  it('should show an error message on failed submission', () => {
    cy.intercept('POST', 'http://localhost:9000/api/sites', { statusCode: 400 }).as('createSiteFail');
    cy.get('[data-cy="site-name"]').type('Test Site');
    cy.get('[data-cy="verantwoordelijke-select"]').select('1');
    cy.get('[data-cy="submit-button"]').click();
    cy.wait('@createSiteFail');
    cy.contains('Er is een fout opgetreden').should('be.visible');
  });

  it('should show an error message when fetching users fails', () => {
    cy.intercept('GET', 'http://localhost:9000/api/users', { statusCode: 500 }).as('getUsersFail');
    cy.visit('http://localhost:5173/sites/create');
    cy.wait('@getUsersFail');
    cy.contains('Oops, something went wrong').should('be.visible');
  });

  it('should show an error message when fetching machines fails', () => {
    cy.intercept('GET', 'http://localhost:9000/api/machines', { statusCode: 500 }).as('getMachinesFail');
    cy.visit('http://localhost:5173/sites/create');
    cy.wait('@getMachinesFail');
    cy.contains('Oops, something went wrong').should('be.visible');
  });
});

describe('SiteEdit Page Tests', () => {
  beforeEach(() => {

    cy.intercept('POST', 'http://localhost:9000/api/sessions').as('loginRequest');
    cy.intercept('GET', 'http://localhost:9000/api/users/me').as('getUser');
 
    cy.login('robert.devree@hotmail.com', '123456789');
    cy.wait('@loginRequest'); 

    cy.fixture('users_and_machines.json').then((data) => {

      cy.intercept('GET', 'http://localhost:9000/api/users', { body: data.users }).as('getUsers');
      //  cy.intercept('GET', 'http://localhost:9000/api/machines', { body: data.machines }).as('getMachines');
      cy.intercept('GET', 'http://localhost:9000/api/sites/1', { body: data.sites.items[0] }).as('getSite');

      cy.intercept('PUT', 'http://localhost:9000/api/sites/*', { statusCode: 200 }).as('updateSite');

      cy.visit('http://localhost:5173/sites/1/edit');

      cy.wait(['@getUsers', '@getSite']);
    });
  });

  it('should load the page with the existing site data', () => {
    cy.get('[data-cy="site-name"]').should('have.value', 'Test Site'); 
    cy.get('[data-cy="verantwoordelijke-select"]').should('have.value', '1'); 
    cy.get('[data-cy="status-select"]').should('have.value', 'ACTIEF'); 
  });

  it('should allow editing the site details', () => {

    cy.get('[data-cy="site-name"]').clear().type('Updated Test Site');
    cy.get('[data-cy="verantwoordelijke-select"]').select('2'); 
    cy.get('[data-cy="status-select"]').select('INACTIEF'); 

    cy.get('[data-cy="site-name"]').should('have.value', 'Updated Test Site');
    cy.get('[data-cy="verantwoordelijke-select"]').should('have.value', '2');
    cy.get('[data-cy="status-select"]').should('have.value', 'INACTIEF');
  });

  it('should submit the edited site successfully', () => {

    cy.get('[data-cy="site-name"]').clear().type('Updated Test Site');
    cy.get('[data-cy="verantwoordelijke-select"]').select('2');

    cy.get('[data-cy="submit-button"]').click();

    cy.contains('Site succesvol bijgewerkt!').should('be.visible');

    cy.wait('@updateSite');
 
  });

  it('should show an error message when the update fails', () => {

    cy.intercept('PUT', 'http://localhost:9000/api/sites/*', { statusCode: 400 }).as('updateSiteFail');

    cy.get('[data-cy="site-name"]').clear().type('Updated Test Site');
    cy.get('[data-cy="verantwoordelijke-select"]').select('2');
    cy.get('[data-cy="submit-button"]').click();

    cy.wait('@updateSiteFail');
 
    cy.contains('Er is een fout opgetreden bij het bijwerken van de site').should('be.visible');
  });
});