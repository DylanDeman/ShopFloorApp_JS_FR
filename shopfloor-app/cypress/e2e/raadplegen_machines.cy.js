describe('Machines Page', () => {

  describe('As TECHNIEKER', () => {
    beforeEach(() => {
      cy.fixture('machines.json').then((machinesData) => {
        cy.intercept('GET', 'http://localhost:9000/api/machines', { body: machinesData }).as('getMachines');
      });
      cy.loginAsTechnieker();
      cy.visit('http://localhost:5173/machines');
      cy.wait('@getMachines');
    });

    it('should only show assigned machines', () => {
      cy.get('tbody tr').should('have.length.at.least', 1);
      cy.get('tbody tr').each(($row) => {
        cy.wrap($row).find('[data-cy=machine-technieker]').should('contain', 'Test User');
      });
    });

    it('should show start/stop controls for assigned machines', () => {
      cy.get('[data-cy=machine-controls]').eq(0).should('be.visible');
    });

    it('should not show management options', () => {
      cy.get('[data-cy=add-machine-button]').should('not.exist');
      cy.get('[data-cy=edit-machine-button]').should('not.exist');
      cy.get('[data-cy=delete-machine-button]').should('not.exist');
    });
  });

  describe('As VERANTWOORDELIJKE', () => {
    beforeEach(() => {
      cy.loginAsVerantwoordelijke();
      cy.visit('http://localhost:5173/machines');
      cy.wait('@getMachines');
    });

    it('should show all machines in their sites', () => {
      cy.get('tbody tr').should('have.length.at.least', 1);
    });

    it('should show machine details but no controls', () => {
      cy.get('[data-cy=machine-details]').eq(0).should('be.visible');
      cy.get('[data-cy=machine-controls]').should('not.exist');
    });

    it('should allow viewing maintenance history', () => {
      cy.get('[data-cy=view-maintenance-button]').eq(0).as('maintenanceButton');
      cy.get('@maintenanceButton').should('be.visible');
      cy.get('@maintenanceButton').click();
      cy.url().should('include', '/onderhoud');
    });
  });

  describe('As MANAGER', () => {
    beforeEach(() => {
      cy.loginAsManager();
      cy.visit('http://localhost:5173/machines');
      cy.wait('@getMachines');
    });

    it('should show all machines', () => {
      cy.get('tbody tr').should('have.length.at.least', 1);
    });

    it('should show management options', () => {
      cy.get('[data-cy=add-machine-button]').should('be.visible');
      cy.get('[data-cy=edit-machine-button]').eq(0).should('be.visible');
      cy.get('[data-cy=delete-machine-button]').eq(0).should('be.visible');
    });

    it('should allow adding new machines', () => {
      cy.get('[data-cy=add-machine-button]').click();
      cy.url().should('include', '/machines/new');
    });
  });

  // Common tests for all roles
  describe('Common Functionality', () => {
    beforeEach(() => {
      cy.loginAsVerantwoordelijke(); // Using any role for common tests
      cy.visit('http://localhost:5173/machines');
      cy.wait('@getMachines');
    });

    it('should filter machines based on status', () => {
      cy.get('[data-cy=status_filter]').select('DRAAIT');
      cy.get('tbody tr').should('have.length.at.least', 1);
      cy.get('tbody tr').eq(0).as('firstRow');
      cy.get('@firstRow').should('contain', 'DRAAIT');
    });

    it('should filter machines based on productie status', () => {
      cy.get('[data-cy=productie_status_filter]').select('GEZOND');
      cy.get('tbody tr').should('have.length.at.least', 1);
      cy.get('tbody tr').eq(0).as('firstRow');
      cy.get('@firstRow').should('contain', 'GEZOND');
    });

    it('should update pagination and number of results per page', () => {
      cy.get('[data-cy=page_size]').should('have.value', '10');
      cy.get('[data-cy=page_size]').select('5');
      cy.get('tbody tr').should('have.length.lte', 5);
      cy.get('[data-cy=next_page]').should('exist');
      cy.get('[data-cy=previous_page]').should('exist');
    });
    it('should load and display machines from the fixture', () => {
      cy.get('table').should('exist');
      cy.get('tbody tr').should('have.length', 3);
  
      cy.get('tbody tr').eq(0).within(() => {
        cy.get('td').eq(0).should('contain', '1'); 
        cy.get('td').eq(1).should('contain', 'Alysson Road'); 
        cy.get('td').eq(2).should('contain', 'DRAAIT'); 
        cy.get('td').eq(3).should('contain', 'GEZOND'); 
        cy.get('td').eq(4).should('contain', 'Cormier Jodie'); 
        cy.get('td').eq(5).should('contain', '1'); 
      });
  
      cy.get('tbody tr').eq(1).within(() => {
        cy.get('td').eq(0).should('contain', '2'); 
        cy.get('td').eq(1).should('contain', 'Wehner Lights'); 
        cy.get('td').eq(2).should('contain', 'MANUEEL GESTOPT'); 
        cy.get('td').eq(3).should('contain', 'FALEND'); 
        cy.get('td').eq(4).should('contain', 'Jast Kyla'); 
        cy.get('td').eq(5).should('contain', '2'); 
      });
  
      cy.get('tbody tr').eq(2).within(() => {
        cy.get('td').eq(0).should('contain', '3'); 
        cy.get('td').eq(1).should('contain', 'Shanahan Pass'); 
        cy.get('td').eq(2).should('contain', 'IN ONDERHOUD'); 
        cy.get('td').eq(3).should('contain', 'GEZOND'); 
        cy.get('td').eq(4).should('contain', 'Kessler Haven'); 
        cy.get('td').eq(5).should('contain', '1'); 
      });
    });
  
    it('should show "Er zijn geen machines beschikbaar." when no machines exist', () => {
      cy.intercept('GET', 'http://localhost:9000/api/machines', { 
        body: { 
          items: [],
          total: 0, 
        }, 
      }).as('emptyMachines');
  
      cy.visit('http://localhost:5173/machines');
      cy.wait('@emptyMachines');
  
      cy.get('table').should('not.exist');
      cy.contains('Er zijn geen machines beschikbaar.').should('be.visible');
    });
  
    it('should allow sorting by columns', () => {
      // Test sorting by ID
      cy.get('th').contains('Nr.').click();
      cy.get('tbody tr').first().within(() => {
        cy.get('td').eq(0).should('contain', '3');
      });
  
      cy.get('th').contains('Nr.').click();
      cy.get('tbody tr').first().within(() => {
        cy.get('td').eq(0).should('contain', '1');
      });
      // Test sorting by Onderhoudsbeurten
      cy.get('th').contains('Aantal Onderhoudsbeurten').click();
      cy.get('tbody tr').first().within(() => {
        cy.get('td').eq(5).should('contain', '1');
      });
  
      cy.get('th').contains('Aantal Onderhoudsbeurten').click();
      cy.get('tbody tr').first().within(() => {
        cy.get('td').eq(5).should('contain', '2');
      });
  
    });
  
    it('should filter machines based on search query', () => {
      cy.get('[data-cy=search]').should('be.visible').clear().type('Road');
      cy.get('tbody tr').should('have.length', 1);
      cy.get('tbody tr td').eq(1).should('contain', 'Alysson Road');
  
      cy.get('[data-cy=search]').clear().type('Cormier');
      cy.get('tbody tr').should('have.length', 1);
      cy.get('tbody tr td').eq(4).should('contain', 'Cormier Jodie');
  
      cy.get('[data-cy=search]').clear().type('Nonexistent Machine');
      cy.get('tbody tr').should('have.length', 0);
      cy.contains('Er zijn geen machines beschikbaar.').should('be.visible');
    });
  
    it('should filter machines based on locatie', () => {
      cy.get('[data-cy=locatie_filter]').select('Alysson Road');
      cy.get('tbody tr').should('have.length', 1);
      cy.get('tbody tr td').eq(1).should('contain', 'Alysson Road');
  
      cy.get('[data-cy=locatie_filter]').select('Alle locaties');
      cy.get('tbody tr').should('have.length', 3);
    });
  
    it('should filter machines based on technieker', () => {
      cy.get('[data-cy=technieker_filter]').select('Cormier Jodie');
      cy.get('tbody tr').should('have.length', 1);
      cy.get('tbody tr td').eq(4).should('contain', 'Cormier Jodie');
  
      cy.get('[data-cy=technieker_filter]').select('Alle techniekers');
      cy.get('tbody tr').should('have.length', 3);
    });
  
    it('should reset all filters when "Filters wissen" is clicked', () => {
      // Apply some filters
      cy.get('[data-cy=locatie_filter]').select('Alysson Road');
      cy.get('[data-cy=status_filter]').select('DRAAIT');
      cy.get('[data-cy=productie_status_filter]').select('GEZOND');
      cy.get('[data-cy=technieker_filter]').select('Cormier Jodie');
  
      // Check that filters are applied
      cy.get('tbody tr').should('have.length', 1);
  
      // Click reset filters
      cy.get('[data-cy=reset_filters]').click();
  
      // Verify all filters are reset
      cy.get('[data-cy=locatie_filter]').should('have.value', '');
      cy.get('[data-cy=status_filter]').should('have.value', '');
      cy.get('[data-cy=productie_status_filter]').should('have.value', '');
      cy.get('[data-cy=technieker_filter]').should('have.value', '');
      cy.get('[data-cy=search]').should('have.value', '');
      cy.get('tbody tr').should('have.length', 3);
    });
  });
});