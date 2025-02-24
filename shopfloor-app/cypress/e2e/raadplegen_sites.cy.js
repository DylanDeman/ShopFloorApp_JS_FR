describe('Sites Page', () => {
  beforeEach(() => {
    cy.login('robert.devree@hotmail.com', 'UUBE4UcWvSZNaIw');

    // Load fixture and intercept without using alias
    cy.fixture('sites.json').then((sitesData) => {
      cy.intercept('GET', '/api/sites', sitesData);
    });

    cy.visit('http://localhost:5173/sites');
  });

  it('should load and display sites from the fixture', () => {
    cy.get('[data-cy=site]').should('have.length', 3);

    cy.get('[data-cy=site_naam]').eq(0).should('contain', 'Site A');
    cy.get('[data-cy=site_verantwoordelijke]').eq(0).should('contain', 'Jan Janssen');
    cy.get('[data-cy=site_aantalMachines]').eq(0).should('contain', '5');
  });

  it('should show a loading indicator for a very slow response', () => {
    cy.fixture('sites.json').then((sitesData) => {
      cy.intercept('GET', '/api/sites', (req) => {
        req.reply((res) => {
          res.delay(2000); // Simulate slow response
          res.send(sitesData);
        });
      });
    });

    cy.visit('http://localhost:5173/sites');

    cy.get('[data-cy=loader]').should('be.visible');
    cy.get('[data-cy=loader]').should('not.exist');
  });

  it('should apply filters correctly', () => {
    cy.get('[data-cy=sites_filter_locatie]').select('Brussel');
    cy.get('[data-cy=site]').should('have.length', 2); // Site A & C

    cy.get('[data-cy=sites_filter_inactief]').click();
    cy.get('[data-cy=site]').should('have.length', 1); // Only Site B remains

    cy.get('[data-cy=sites_filter_onderhoudsniveau]').clear().type('50').trigger('change');
    cy.get('[data-cy=site]').should('have.length', 2); // Only Site A & B
  });
});
//TODO:Fixen van de testen