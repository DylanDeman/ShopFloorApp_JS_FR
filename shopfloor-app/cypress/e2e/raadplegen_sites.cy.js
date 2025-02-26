describe('Sites Page', () => {
  beforeEach(() => {
    cy.login('robert.devree@hotmail.com', 'UUBE4UcWvSZNaIw');

    // Consistent API endpoint path
    cy.intercept(
      'GET',
      'http://localhost:9000/api/sites',
      { fixture: 'sites.json' }
    )

    cy.visit('http://localhost:5173/sites');
  });

  it('should load and display sites from the fixture', () => {
    cy.get('[data-cy=site]').should('have.length', 3);

    cy.get('[data-cy=site_naam]').eq(0).should('contain', 'Site A');
    cy.get('[data-cy=site_verantwoordelijke]').eq(0).should('contain', 'Jan Janssen');
    cy.get('[data-cy=site_aantalMachines]').eq(0).should('contain', '5');
  });

  it('should show a loading indicator for a very slow response', () => {
    cy.intercept('GET', 'http://localhost:9000/api/sites', (req) => {
      req.reply((res) => {
        res.delay(2000);
        res.send({ fixture: 'sites.json' });
      });
    }).as('slowResponse');

    cy.visit('http://localhost:5173/sites');
    
    // Check loader appears
    cy.get('[data-cy=loader]').should('be.visible');
    
    // Wait for response to complete
    cy.wait('@slowResponse');
    
    // Then check loader disappears - use should('not.be.visible') instead of should('not.exist')
    cy.get('[data-cy=loader]').should('not.be.visible');
  });

  it('should apply filters correctly', () => {
    // Reset to original state before each filter test
    cy.get('[data-cy=sites_filter_locatie]').select('Brussel');
    cy.get('[data-cy=site]').should('have.length', 2); // Site A & C
    
    // Clear previous filter and test inactief independently
    cy.get('[data-cy=sites_filter_locatie]').select(''); // Assuming there's a blank/all option
    cy.get('[data-cy=sites_filter_inactief]').click();
    cy.get('[data-cy=site]').should('have.length', 1); // Only Site B remains
    
    // Reset again and test onderhoudsniveau filter
    cy.get('[data-cy=sites_filter_inactief]').click(); // Toggle off
    cy.get('[data-cy=sites_filter_onderhoudsniveau]').clear().type('50');
    cy.get('[data-cy=sites_filter_onderhoudsniveau]').blur(); // More reliable than trigger('change')
    cy.get('[data-cy=site]').should('have.length', 2); // Site A & B
  });
  
  it('should handle API errors gracefully', () => {
    cy.intercept('GET', 'http://localhost:9000/api/sites', {
      statusCode: 500,
      body: { error: 'Server error' }
    }).as('serverError');
    
    cy.visit('http://localhost:5173/sites');
    cy.wait('@serverError');
    
    // Assert error message is displayed
    cy.get('[data-cy=error-message]').should('be.visible');
  });
});