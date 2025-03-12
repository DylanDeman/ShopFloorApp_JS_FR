describe('SiteToevoegen Page Tests', () => {
  beforeEach(() => {
    // Intercepting login and user request
    cy.intercept('POST', 'http://localhost:9000/api/sessions').as('loginRequest');
    cy.intercept('GET', 'http://localhost:9000/api/users/me').as('getUser');
    
    // Log in first
    cy.login('robert.devree@hotmail.com', '123456789');
    cy.wait('@loginRequest');  // Ensure login is completed
    
    // Set up intercept for users and machines from the combined fixture
    cy.fixture('users_and_machines.json').then((data) => {
      cy.intercept('GET', 'http://localhost:9000/api/users', { body: data.users }).as('getUsers');
      cy.intercept('GET', 'http://localhost:9000/api/machines', { body: data.machines }).as('getMachines');
    });

    // Intercept for creating the site
    cy.intercept('POST', 'http://localhost:9000/api/sites', { statusCode: 201 }).as('createSite');
    
    // Visit the page
    cy.visit('http://localhost:5173/sites/create');
    
    // Wait for the necessary requests before proceeding with tests
    cy.wait(['@getUsers', '@getMachines']);
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

  it('should move machines between lists', () => {
    cy.get('[data-cy="available-machines"]').select(['1', '2']);
    cy.get('[data-cy="move-to-selected"]').click();
    cy.get('[data-cy="selected-machines"]').children().should('have.length', 2);
    cy.get('[data-cy="selected-machines"]').select(['1']);
    cy.get('[data-cy="move-to-available"]').click();
    cy.get('[data-cy="selected-machines"]').children().should('have.length', 1);
  });

  it('should submit the form successfully', () => {
    cy.get('[data-cy="site-name"]').type('Test Site');
    cy.get('[data-cy="verantwoordelijke-select"]').select('1');
    cy.get('[data-cy="available-machines"]').select(['1', '2']);
    cy.get('[data-cy="move-to-selected"]').click();
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

// describe('SiteEdit Page Tests', () => {
//   let fixtureData;

//   beforeEach(() => {
//     // Intercept login and user request
//     cy.intercept('POST', 'http://localhost:9000/api/sessions').as('loginRequest');
//     cy.intercept('GET', 'http://localhost:9000/api/users/me').as('getUser');
    
//     // Log in first
//     cy.login('robert.devree@hotmail.com', '123456789');
//     cy.wait('@loginRequest'); // Ensure login is completed

//     // Load the fixture data before running tests
//     cy.fixture('editSite.json').then((data) => {
//       fixtureData = data;
//     });

//     // Intercept API calls using the pre-loaded fixture data
//     cy.intercept('GET', 'http://localhost:9000/api/users', {
//       statusCode: 200,
//       body: fixtureData.gebruikers.items,
//     }).as('getUsers');

//     cy.intercept('GET', 'http://localhost:9000/api/machines', {
//       statusCode: 200,
//       body: fixtureData.machines.items,
//     }).as('getMachines');

//     // cy.intercept('GET', 'http://localhost:9000/api/sites', {
//     //   statusCode: 200,
//     //   body: fixtureData.sites.items,
//     // }).as('getSites');

//     cy.intercept('PUT', 'http://localhost:9000/api/sites', {
//       statusCode: 200,
//     }).as('updateSite');

//     // Visit the edit page for a specific site
//     cy.visit('http://localhost:5173/sites/1/edit');

//     // Wait for the necessary requests before proceeding with tests
//     cy.wait(['@getUsers', '@getMachines']);
//   });

//   it('should load the page with the existing site data', () => {
//     // Verify that the form is populated with the existing site data
//     cy.get('[data-cy="site-name"]').should('have.value', 'Test Site'); // Ensure that site name is pre-filled
//     cy.get('[data-cy="verantwoordelijke-select"]').should('have.value', '1'); // Responsible person should be pre-selected
//     cy.get('[data-cy="status-select"]').should('have.value', 'INACTIEF'); // Status should be pre-selected
//   });

//   it('should allow editing the site details', () => {
//     // Edit the site name and responsible person
//     cy.get('[data-cy="site-name"]').clear().type('Updated Test Site');
//     cy.get('[data-cy="verantwoordelijke-select"]').select('2'); // Change responsible person
//     cy.get('[data-cy="status-select"]').select('ACTIEF'); // Change status

//     // Verify the changes
//     cy.get('[data-cy="site-name"]').should('have.value', 'Updated Test Site');
//     cy.get('[data-cy="verantwoordelijke-select"]').should('have.value', '2');
//     cy.get('[data-cy="status-select"]').should('have.value', 'ACTIEF');
//   });

//   it('should allow editing machine assignments', () => {
//     // Move machines to the selected list
//     cy.get('[data-cy="available-machines"]').select(['1', '2']);
//     cy.get('[data-cy="move-to-selected"]').click();
    
//     // Ensure two machines are in the selected list
//     cy.get('[data-cy="selected-machines"]').children().should('have.length', 2);

//     // Move one machine back to available
//     cy.get('[data-cy="selected-machines"]').select(['1']);
//     cy.get('[data-cy="move-to-available"]').click();
    
//     // Ensure one machine remains selected
//     cy.get('[data-cy="selected-machines"]').children().should('have.length', 1);
//   });

//   it('should submit the edited site successfully', () => {
//     // Edit the site details
//     cy.get('[data-cy="site-name"]').clear().type('Updated Test Site');
//     cy.get('[data-cy="verantwoordelijke-select"]').select('2');
//     cy.get('[data-cy="available-machines"]').select(['1', '2']);
//     cy.get('[data-cy="move-to-selected"]').click();

//     // Submit the form
//     cy.get('[data-cy="submit-button"]').click();

//     // Wait for the update request
//     cy.wait('@updateSite');

//     // Verify that the site update was successful
//     cy.contains('Site succesvol geüpdatet!').should('be.visible');
//   });

//   it('should show an error message when the update fails', () => {
//     // Simulate a failed update
//     cy.intercept('PUT', 'http://localhost:9000/api/sites/*', { statusCode: 400 }).as('updateSiteFail');
    
//     // Attempt to update the site
//     cy.get('[data-cy="site-name"]').clear().type('Updated Test Site');
//     cy.get('[data-cy="verantwoordelijke-select"]').select('2');
//     cy.get('[data-cy="submit-button"]').click();

//     // Wait for the failed request
//     cy.wait('@updateSiteFail');

//     // Verify that the error message is displayed
//     cy.contains('Er is een fout opgetreden bij het bijwerken van de site').should('be.visible');
//   });

//   it('should show an error if required fields are missing during update', () => {
//     cy.get('[data-cy="site-name"]').clear(); // Clear site name field
//     cy.get('[data-cy="submit-button"]').click(); // Attempt to submit

//     // Verify error message
//     cy.contains('Alle velden zijn verplicht!').should('be.visible');
//   });
//});
