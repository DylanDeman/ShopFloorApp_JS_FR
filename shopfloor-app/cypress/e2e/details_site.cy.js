describe('Site Details Page', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:9000/api/sessions').as('loginRequest');
    cy.intercept('GET', 'http://localhost:9000/api/users/me').as('getUser');
    cy.login('robert.devree@hotmail.com', '123456789');

    // Ensure intercept is set up before visiting the page
    cy.intercept('GET', 'http://localhost:9000/api/sites/1', { fixture: 'siteDetails.json' }).as('getSiteDetails');

    cy.visit('http://localhost:5173/sites/1');

    cy.wait('@getSiteDetails', { timeout: 10000 });
  });

  it('should display site details correctly', () => {
    cy.get('[data-cy=site-details]').should('be.visible');
  });

  it('should show machine rows correctly', () => {
    cy.get('[data-cy^=table-row-]').should('have.length.at.least', 1); // Checks if rows exist
  });

  it('should show an error message if site details fail to load', () => {
    cy.intercept('GET', 'http://localhost:9000/api/sites/1', { statusCode: 500 }).as('getSiteDetailsError');
    cy.visit('http://localhost:5173/sites/1');
    cy.wait('@getSiteDetailsError');
    cy.get('[data-cy=error-message]').should('be.visible');
  });
});

describe('Site Grondplan Page', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:9000/api/sessions').as('loginRequest');
    cy.intercept('GET', 'http://localhost:9000/api/users/me').as('getUser');
    cy.login('robert.devree@hotmail.com', '123456789');

    cy.intercept('GET', 'http://localhost:9000/api/sites/1', { fixture: 'siteDetails.json' }).as('getSiteDetails');
    cy.visit('http://localhost:5173/sites/1/grondplan');
    cy.wait('@getSiteDetails', { timeout: 10000 });
  });

  it('should display the map correctly', () => {
    cy.get('[data-cy=map]').should('be.visible');
  });

  it('should show machine details on clicking a machine marker', () => {
    cy.get('[data-cy=machine-marker]').first().click();
    cy.get('[data-cy=machine-details]').should('be.visible');
  });

  it('should show an error if the map fails to load', () => {
    cy.intercept('GET', 'http://localhost:9000/api/sites/1', { statusCode: 500 }).as('getSiteDetailsError');
    cy.visit('http://localhost:5173/sites/1/grondplan');
    cy.wait('@getSiteDetailsError');
    cy.get('[data-cy=error-message]').should('be.visible');
  });
});

describe('Machine Details Page', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:9000/api/sessions').as('loginRequest');
    cy.intercept('GET', 'http://localhost:9000/api/users/me').as('getUser');
    cy.login('robert.devree@hotmail.com', '123456789');

    cy.intercept('GET', 'http://localhost:9000/api/sites/1', { fixture: 'siteDetails.json' }).as('getSiteDetails');
    cy.visit('http://localhost:5173/sites/1/grondplan');
    cy.wait('@getSiteDetails', { timeout: 10000 });
  });

  it('should display machine details correctly', () => {
    cy.visit('http://localhost:5173/machines/1');
    cy.get('[data-cy=machine_details]').should('be.visible');
    cy.get('[data-cy=machine_status]').should('be.visible');
    cy.get('[data-cy=machine_productie_status]').should('be.visible');
    cy.get('[data-cy=machine_details]').should('contain', 'Machine informatie');
    cy.get('[data-cy=machine_status]').should('contain', 'Status: MANUEEL_GESTOPT');
    cy.get('[data-cy=machine_productie_status]').should('contain', 'Productiestatus: FALEND');
  });

  // Negative test cases
  it('should display an error message when machine details fail to load', () => {
    cy.intercept('GET', 'http://localhost:9000/api/machines/1', { statusCode: 500 }).as('getMachineDetailsError');
    cy.visit('http://localhost:5173/machines/1');
    cy.wait('@getMachineDetailsError');
    cy.get('[data-cy=error-message]').should('be.visible');
  });

  it('should display a not found message when machine does not exist', () => {
    cy.intercept('GET', 'http://localhost:9000/api/machines/1', { statusCode: 404 }).as('getMachineNotFound');
    cy.visit('http://localhost:5173/machines/1');
    cy.wait('@getMachineNotFound');
    cy.get('[data-cy=error-message]').should('be.visible');
  });
});

// describe('Machine Start and Stop E2E Tests', () => {
//   beforeEach(() => {
//     // Intercept login request and get user details
//     cy.intercept('POST', 'http://localhost:9000/api/sessions').as('loginRequest');
//     cy.intercept('GET', 'http://localhost:9000/api/users/me').as('getUser');

//     // Login before tests
//     cy.login('robert.devree@hotmail.com', '123456789');

//     // Load the fixture data for site and machines
//     cy.intercept('GET', 'http://localhost:9000/api/sites/1', { fixture: 'siteDetails.json' }).as('getSiteDetails');

//     // Intercept machine details based on the fixture data
//     cy.fixture('siteDetails.json').then((data) => {
//       cy.intercept('GET', 'http://localhost:9000/api/machines/1', {
//         statusCode: 200,
//         body: data.machines[0], // Machine A from fixture
//       }).as('getMachineA');
      
//       cy.intercept('GET', 'http://localhost:9000/api/machines/2', {
//         statusCode: 200,
//         body: data.machines[1], // Machine B from fixture
//       }).as('getMachineB');

//       // Mock machine status update API
//       cy.intercept('PUT', 'http://localhost:9000/api/machines', (req) => {
//         const updatedStatus = req.body.status === 'DRAAIT' ? 'MANUEEL_GESTOPT' : 'DRAAIT';
//         req.body.status = updatedStatus; // Toggle the status based on action
//       }).as('updateMachineStatus');
      
//       // Visit Machine A's detail page
//       cy.visit('http://localhost:5173/machines/1');
//       cy.wait('@getMachineA');
//     });
//   });

//   it('should stop a running machine', () => {
//     // Verify initial machine status is "DRAAIT" (Running)
//     cy.get('[data-cy="machine_details"]').should('contain.text', 'DRAAIT');

//     // Simulate stopping the machine
//     cy.get('[data-cy="start-stop-button"]').contains('STOP').click();
//     cy.wait('@updateMachineStatus');

//     // Mock the updated status to "MANUEEL_GESTOPT"
//     cy.intercept('GET', 'http://localhost:9000/api/machines/1', {
//       statusCode: 200,
//       body: {
//         ...Cypress._.merge({}, {
//           id: 1,
//           status: 'MANUEEL_GESTOPT',
//         }),
//       },
//     }).as('getUpdatedMachine');

//     // Check that the button now shows "START"
//     cy.get('[data-cy="start-stop-button"]').contains('START');
//     cy.get('[data-cy="machine_details"]').should('contain.text', 'MANUEEL_GESTOPT');
//   });

//   it('should start a stopped machine', () => {
//     // Navigate to Machine B's detail page (initial status: "MANUEEL_GESTOPT")
//     cy.visit('http://localhost:5173/machines/2');
//     cy.wait('@getMachineB');

//     // Verify initial machine status is "MANUEEL_GESTOPT"
//     cy.get('[data-cy="machine_details"]').should('contain.text', 'MANUEEL_GESTOPT');

//     // Simulate starting the machine
//     cy.get('[data-cy="start-stop-button"]').contains('START').click();
//     cy.wait('@updateMachineStatus');

//     // Mock the updated status to "DRAAIT"
//     cy.intercept('GET', 'http://localhost:9000/api/machines/2', {
//       statusCode: 200,
//       body: {
//         ...Cypress._.merge({}, {
//           id: 2,
//           status: 'DRAAIT',
//         }),
//       },
//     }).as('getUpdatedMachine');

//     // Check that the button now shows "STOP"
//     cy.get('[data-cy="start-stop-button"]').contains('STOP');
//     cy.get('[data-cy="machine_details"]').should('contain.text', 'DRAAIT');
//   });
// });
