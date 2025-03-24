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
      cy.get('td').eq(1).should('contain', '1'); 
      cy.get('td').eq(2).should('contain', 'Site A'); 
      cy.get('td').eq(3).should('contain', 'Jan Janssen'); 
      cy.get('td').eq(5).should('contain', '2'); 
    });
    cy.get('tbody tr').eq(1).within(() => {
      cy.get('td').eq(1).should('contain', '2'); 
      cy.get('td').eq(2).should('contain', 'Site B'); 
      cy.get('td').eq(3).should('contain', 'Piet Peeters'); 
      cy.get('td').eq(5).should('contain', '1'); 
    });
    cy.get('tbody tr').eq(2).within(() => {
      cy.get('td').eq(1).should('contain', '3'); 
      cy.get('td').eq(2).should('contain', 'Site C'); 
      cy.get('td').eq(3).should('contain', 'Marie Dubois'); 
      cy.get('td').eq(5).should('contain', '1'); 
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

    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(5).should('contain', '1'); 
    });

    cy.get('th').contains('Aantal machines').click(); 

    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(5).should('contain', '2'); 
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
    cy.get('[data-cy=search]').should('be.visible').clear().type('Site A');
    cy.get('tbody tr').should('have.length', 1);
    cy.get('tbody tr td').eq(2).should('contain', 'Site A');

    cy.get('[data-cy=search]').clear().type('Jan Janssen');
    cy.get('tbody tr').should('have.length', 1);
    cy.get('tbody tr td').eq(3).should('contain', 'Jan Janssen');

    cy.get('[data-cy=search]').clear().type('Nonexistent Site');
    cy.get('tbody tr').should('have.length', 0);
    cy.contains('Er zijn geen sites beschikbaar.').should('be.visible');
  });

  it('should filter sites based on status', () => {
    cy.get('[data-cy=status_filter]').select('ACTIEF');
    cy.get('tbody tr').should('have.length', 2);

    cy.get('[data-cy=status_filter]').select('Alle statussen');
    cy.get('tbody tr').should('have.length', 3);

    cy.get('[data-cy=status_filter]').select('INACTIEF');
    cy.get('tbody tr').should('have.length', 1);
  },
  );

  it('should filter sites based on verantwoordelijke', () => {
    cy.get('[data-cy=verantwoordelijke_filter]').select('Jan Janssen');
    cy.get('tbody tr').should('have.length', 1);

    cy.get('[data-cy=verantwoordelijke_filter]').select('Piet Peeters');
    cy.get('tbody tr').should('have.length', 1);

    cy.get('[data-cy=verantwoordelijke_filter]').select('Marie Dubois');
    cy.get('tbody tr').should('have.length', 1);

    cy.get('[data-cy=verantwoordelijke_filter]').select('Alle verantwoordelijken');
    cy.get('tbody tr').should('have.length', 3);
    
  });
  
  it('should filter sites based on aantal machines', () => {
    cy.get('[data-cy=machines_filter_min]').clear().type('1');
    cy.get('tbody tr').should('have.length', 3);

    cy.get('[data-cy=machines_filter_min]').clear().type('2');
    cy.get('tbody tr').should('have.length', 1);

    cy.get('[data-cy=machines_filter_min]').clear().type('3');
    cy.get('tbody tr').should('have.length', 0);

    cy.get('[data-cy=machines_filter_min]').clear();

    cy.get('[data-cy=machines_filter_max]').clear().type('1');
    cy.get('tbody tr').should('have.length', 2);
    cy.get('[data-cy=machines_filter_max]').clear().type('2');
    cy.get('tbody tr').should('have.length', 3);
    cy.get('[data-cy=machines_filter_max]').clear().type('3');
    cy.get('tbody tr').should('have.length', 3);
  },
  );

  it('should update pagination and number of results per page', () => {
  // Default should be 10 per page
    cy.get('[data-cy=page_size]').should('have.value', '10');

    // Change page size to 5
    cy.get('[data-cy=page_size]').select('5');
    cy.get('tbody tr').should('have.length.lte', 5);

    // Navigate through pages if more than 5 machines
    cy.get('[data-cy=next_page]').should('exist');
    cy.get('[data-cy=previous_page]').should('exist');
  });
});