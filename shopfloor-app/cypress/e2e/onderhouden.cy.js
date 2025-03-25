describe('Onderhoud List Page', () => {

  beforeEach(() => {
    cy.fixture('maintenance.json').then((maintenanceData) => {
      cy.intercept('GET', 'http://localhost:9000/api/onderhouden', { body: maintenanceData }).as('getOnderhouden');
    });

    cy.intercept('POST', 'http://localhost:9000/api/sessions').as('loginRequest');
    cy.intercept('GET', 'http://localhost:9000/api/users/me').as('getUser');

    // Load the fixture data

    cy.fixture('machineDetails.json').then((fixtureData) => {
      cy.intercept('GET', 'http://localhost:9000/api/machines/1', (req) => {
        req.reply(fixtureData.machines[0]);
      }).as('getMachineDetails');
    });

    cy.login('robert.devree@hotmail.com', '123456789');
    
    cy.wait('@loginRequest');
    cy.wait('@getUser');
    
    cy.visit('http://localhost:5173/machines/1/onderhouden');
    cy.wait('@getMachineDetails');
  });

  describe('As TECHNIEKER', () => {
    beforeEach(() => {
      cy.loginAsTechnieker();
      cy.visit('http://localhost:5173/onderhoud');
      cy.wait('@getOnderhouden');
    });

    it('should only show assigned maintenance tasks', () => {
      cy.get('tbody tr').should('have.length.at.least', 1);
      cy.get('tbody tr').each(($row) => {
        cy.wrap($row).find('[data-cy=onderhoud-technieker]').should('contain', 'Test User');
      });
    });

    it('should allow updating maintenance status', () => {
      cy.get('[data-cy=status-select]').eq(0).as('statusSelect');
      cy.get('@statusSelect').should('be.visible');
      cy.get('@statusSelect').select('VOLTOOID');
      cy.get('@statusSelect').should('have.value', 'VOLTOOID');
    });

    it('should allow adding maintenance comments', () => {
      cy.get('[data-cy=add-comment-button]').eq(0).click();
      cy.get('[data-cy=comment-input]').should('be.visible');
      cy.get('[data-cy=comment-input]').type('Test comment');
      cy.get('[data-cy=save-comment-button]').click();
      cy.get('[data-cy=comment-text]').should('contain', 'Test comment');
    });
  });

  describe('As VERANTWOORDELIJKE', () => {
    beforeEach(() => {
      cy.loginAsVerantwoordelijke();
      cy.visit('http://localhost:5173/onderhoud');
      cy.wait('@getOnderhouden');
    });

    it('should show all maintenance tasks for their sites', () => {
      cy.get('tbody tr').should('have.length.at.least', 1);
    });

    it('should allow viewing but not modifying maintenance', () => {
      cy.get('[data-cy=status-select]').should('not.exist');
      cy.get('[data-cy=add-comment-button]').should('not.exist');
      cy.get('[data-cy=maintenance-details]').eq(0).should('be.visible');
    });

    it('should allow scheduling new maintenance', () => {
      cy.get('[data-cy=schedule-maintenance-button]').as('scheduleButton');
      cy.get('@scheduleButton').should('be.visible');
      cy.get('@scheduleButton').click();
      cy.url().should('include', '/onderhoud/new');
    });
  });

  describe('As MANAGER', () => {
    beforeEach(() => {
      cy.loginAsManager();
      cy.visit('http://localhost:5173/onderhoud');
      cy.wait('@getOnderhouden');
    });

    it('should show all maintenance tasks', () => {
      cy.get('tbody tr').should('have.length.at.least', 1);
    });

    it('should show management options', () => {
      cy.get('[data-cy=delete-maintenance-button]').eq(0).should('be.visible');
      cy.get('[data-cy=edit-maintenance-button]').eq(0).should('be.visible');
    });

    it('should allow scheduling maintenance for any site', () => {
      cy.get('[data-cy=schedule-maintenance-button]').as('scheduleButton');
      cy.get('@scheduleButton').click();
      cy.url().should('include', '/onderhoud/new');
      cy.get('[data-cy=site-select]').should('be.visible');
    });
  });

  // Common tests for all roles
  describe('Common Functionality', () => {
    beforeEach(() => {
      cy.loginAsVerantwoordelijke(); // Using any role for common tests
      cy.visit('http://localhost:5173/onderhoud');
      cy.wait('@getOnderhouden');
    });

    it('should filter maintenance based on status', () => {
      cy.get('[data-cy=status_filter]').select('VOLTOOID');
      cy.get('tbody tr').should('have.length.at.least', 1);
      cy.get('tbody tr').eq(0).as('firstRow');
      cy.get('@firstRow').find('[data-cy=status-cell]').should('contain', 'VOLTOOID');
    });

    it('should filter maintenance based on technieker', () => {
      cy.get('[data-cy=onderhoud_technieker_filter]').select('Test User');
      cy.get('tbody tr').should('have.length.at.least', 1);
      cy.get('tbody tr').eq(0).as('firstRow');
      cy.get('@firstRow').find('[data-cy=technieker-cell]').should('contain', 'Test User');
    });

    it('should update pagination and number of results per page', () => {
      cy.get('[data-cy=page_size]').should('have.value', '10');
      cy.get('[data-cy=page_size]').select('5');
      cy.get('tbody tr').should('have.length.lte', 5);
      cy.get('[data-cy=next_page]').should('exist');
      cy.get('[data-cy=previous_page]').should('exist');
    });
  });

  it('should load and display onderhouden from the fixture', () => {
    cy.get('table').should('exist');
    cy.get('tbody tr').should('have.length', 1);

    // Check first row details
    cy.get('tbody tr').eq(0).within(() => {
      cy.get('td').eq(0).should('contain', '95');
      cy.get('td').eq(1).should('contain', '2024-06-21T19:00:11.000Z');
      cy.get('td').eq(2).should('contain', '2025-11-14T13:10:34.000Z');
      cy.get('td').eq(3).should('contain', 'Gerlach Alessia');
      cy.get('td').eq(4).should('contain', 'Degero caritas vomica quidem cogo amplus conscendo.');
      cy.get('td').eq(5).should('contain', 'Itaque coepi unde cubo tergeo tametsi creator aureus. Attollo conicio adimpleo amplitudo agnosco ater. Blandior conitor illo virgo adaugeo ubi tamen vulgaris cernuus iusto.');
      cy.get('td').eq(7).should('contain', 'VOLTOOID');
    });
  });

  it('should allow sorting by columns', () => {
    // Test sorting by ID
    cy.get('th').contains('Nr.').click();
    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(0).should('contain', '95');
    });

    cy.get('th').contains('Nr.').click();
    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(0).should('contain', '95');
    });
  });

  it('should filter onderhouden based on search query', () => {
    cy.get('[data-cy=search]').should('be.visible').clear().type('Gerlach');
    cy.get('tbody tr').should('have.length', 1);
    cy.get('tbody tr td').eq(3).should('contain', 'Gerlach Alessia');

    cy.get('[data-cy=search]').clear().type('Degero');
    cy.get('tbody tr').should('have.length', 1);
    cy.get('tbody tr td').eq(4).should('contain', 'Degero caritas vomica quidem cogo amplus conscendo.');

    cy.get('[data-cy=search]').clear().type('Nonexistent');
    cy.get('tbody tr').should('have.length', 0);
    cy.contains('Er zijn geen onderhouden beschikbaar voor deze machine.').should('be.visible');
  });

  it('should filter onderhouden based on status', () => {
    cy.get('[data-cy=status_filter]').select('VOLTOOID');
    cy.get('tbody tr').should('have.length', 1);
    cy.get('tbody tr td').eq(7).should('contain', 'VOLTOOID');

    cy.get('[data-cy=status_filter]').select('');
    cy.get('tbody tr').should('have.length', 1);
  });

  it('should filter onderhouden based on technieker', () => {
    cy.get('[data-cy=onderhoud_technieker_filter]').select('Gerlach Alessia');
    cy.get('tbody tr').should('have.length', 1);
    cy.get('tbody tr td').eq(3).should('contain', 'Gerlach Alessia');

    cy.get('[data-cy=onderhoud_technieker_filter]').select('');
    cy.get('tbody tr').should('have.length', 1);
  });

  it('should reset all filters when "Filters wissen" is clicked', () => {
    // Apply filters
    cy.get('[data-cy=status_filter]').select('VOLTOOID');
    cy.get('[data-cy=onderhoud_technieker_filter]').select('Gerlach Alessia');

    // Check that filters are applied
    cy.get('tbody tr').should('have.length', 1);

    // Click reset filters
    cy.get('[data-cy=reset_filters]').click();

    // Verify all filters are reset
    cy.get('[data-cy=status_filter]').should('have.value', '');
    cy.get('[data-cy=onderhoud_technieker_filter]').should('have.value', '');
    cy.get('tbody tr').should('have.length', 1);
  });

  it('should have correct unique statuses and techniekers', () => {
    // Verify unique statuses
    cy.get('[data-cy=status_filter] option').should('have.length.at.least', 2);
    cy.get('[data-cy=status_filter]').within(() => {
      cy.contains('VOLTOOID').should('exist');
      cy.contains('Alle statussen').should('exist');
    });

    // Verify unique techniekers
    cy.get('[data-cy=onderhoud_technieker_filter] option').should('have.length.at.least', 1);
    cy.get('[data-cy=onderhoud_technieker_filter]').within(() => {
      cy.contains('Gerlach Alessia').should('exist');
    });
  });

});