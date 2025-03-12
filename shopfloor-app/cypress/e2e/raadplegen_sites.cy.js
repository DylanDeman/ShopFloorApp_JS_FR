describe('Sites Page', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:9000/api/sessions').as('loginRequest');
    cy.intercept('GET', 'http://localhost:9000/api/users/me').as('getUser');
    
    cy.fixture('sites.json').then((sitesData) => {
      cy.intercept('GET', 'http://localhost:9000/api/sites', { body: sitesData }).as('getSites');
    });

    cy.login('robert.devree@hotmail.com', '123456789');
    
    cy.wait('@loginRequest');
    cy.wait('@getUser');
    cy.visit('http://localhost:5173/sites');
    cy.wait('@getSites');
  });

  it('should load and display sites from the fixture', () => {
    cy.get('table').should('exist');
    cy.get('tbody tr').should('have.length', 3);

    cy.get('tbody tr').eq(0).within(() => {
      cy.get('td').eq(1).should('contain', '1'); // ID
      cy.get('td').eq(2).should('contain', 'Site A'); // Naam
      cy.get('td').eq(3).should('contain', 'Jan Janssen'); // Verantwoordelijke
      cy.get('td').eq(4).should('contain', '2'); // Aantal Machines
    });
    cy.get('tbody tr').eq(1).within(() => {
      cy.get('td').eq(1).should('contain', '2'); // ID
      cy.get('td').eq(2).should('contain', 'Site B'); // Naam
      cy.get('td').eq(3).should('contain', 'Piet Peeters'); // Verantwoordelijke
      cy.get('td').eq(4).should('contain', '1'); // Aantal Machines
    });
    cy.get('tbody tr').eq(2).within(() => {
      cy.get('td').eq(1).should('contain', '3'); // ID
      cy.get('td').eq(2).should('contain', 'Site C'); // Naam
      cy.get('td').eq(3).should('contain', 'Marie Dubois'); // Verantwoordelijke
      cy.get('td').eq(4).should('contain', '1'); // Aantal Machines
    });
  });

  it('should show "Er zijn geen sites beschikbaar." when no sites exist', () => {
    cy.intercept('GET', 'http://localhost:9000/api/sites', { body: { items: [] } }).as('emptySites');

    cy.visit('http://localhost:5173/sites');
    cy.wait('@emptySites');

    cy.get('table').should('not.exist');
    cy.contains('Er zijn geen sites beschikbaar.').should('be.visible');
  });

  it('should allow sorting by Aantal Machines', () => {
    cy.get('th').contains('Aantal machines').click();
    cy.wait(500); // Ensure sorting happens

    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(4).should('contain', '1'); // Lowest count first
    });

    cy.get('th').contains('Aantal machines').click();
    cy.wait(500); // Ensure sorting happens

    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(4).should('contain', '2'); // Highest count first
    });
  });

  // it('should show a loading indicator for a very slow response', () => {
  //   cy.intercept('GET', 'http://localhost:9000/api/sites', (req) => {
  //     req.on('response', (res) => {
  //       res.setDelay(2000);
  //     });
  //   }).as('slowGetSites');

  //   cy.visit('http://localhost:5173/sites');

  //   cy.get('[data-cy=loader]').should('be.visible');
  //   cy.wait('@slowGetSites');
  //   cy.get('[data-cy=loader]').should('not.exist');
  // });

  it('should filter sites based on search query', () => {
    cy.get('[data-cy=sites_search]').should('be.visible').clear().type('Site A');
    cy.get('tbody tr').should('have.length', 1);
    cy.get('tbody tr td').eq(2).should('contain', 'Site A');

    cy.get('[data-cy=sites_search]').clear().type('Jan Janssen');
    cy.get('tbody tr').should('have.length', 1);
    cy.get('tbody tr td').eq(3).should('contain', 'Jan Janssen');

    cy.get('[data-cy=sites_search]').clear().type('Nonexistent Site');
    cy.get('tbody tr').should('have.length', 0);
    cy.contains('Er zijn geen sites beschikbaar.').should('be.visible');
  });
});
