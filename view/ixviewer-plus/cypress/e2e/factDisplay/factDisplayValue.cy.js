import { selectors } from "../../utils/selectors"

describe(`Fact Display`, () => {
    it('should not have comma when dei:EntityCentralIndexKey', () => {
        cy.loadByAccessionNum('000001469323000155');
        cy.get(selectors.factCountClock).should('not.exist')
        cy.get(selectors.factsHeader).click()
        cy.get(selectors.sidebarPaginationNext).click()
        cy.get(selectors.sidebarPaginationNext).click()
        cy.get('a[data-id="fact-identifier-0"]').click()
        cy.get('#fact-modal-carousel-page-1 > tbody > tr:nth-child(2) > td > div')
            .should('have.text', '0000014693') // not 14,693
    })
    
    it('should not have comma when date or year', () => {
        cy.loadByAccessionNum('000101376223000425-2');
        cy.get(selectors.factCountClock, {timeout: 30000}).should('not.exist')
        cy.get('[id="fact-identifier-1"]').click()
        cy.get(selectors.factValueInModal)
            .should('have.text', '2023') // not 2,023
    })

    it('should not have comma when zip code', () => {
        cy.loadByAccessionNum('000121390021056659')
        cy.get(selectors.factCountClock).should('not.exist')
        cy.get(selectors.factsHeader).click()
        cy.get('a[data-id="fact-identifier-16"]').click()
        cy.get(selectors.factValueInModal)
            .should('have.text', '76124') // not 76,124
    })

    // TODO: Also, need tests to make sure values are getting commas added when they should.

    it('12-month period should show correct (Not off-by-one)', () => {
        cy.loadByAccessionNum('000168441724800397')
        cy.get(selectors.factSidebarToggleBtn).click()
        cy.get(selectors.sidebarFactPeriod(24)).should('include.text', '12 months')
    })

    it('Text block facts should be displayed on one line, not two', () => {
        cy.viewport(1920, 1080)
        cy.loadByAccessionNum('000089418923007993')
        // Fact 17 and 21 should be shown on the same line, but there was a bug that would split them onto two lines.
        // This test will check if they're at the same vertical location on the screen (Y-axis)
        cy.get('[id="fact-identifier-17"]').click().should('be.visible').then(($el) => {
            let firstFact = $el[0].getBoundingClientRect()
            cy.get('[id="fact-identifier-21"]').then($el => {
                let secFact = $el[0].getBoundingClientRect();
                // The '.y' part here looks at the Y coordinate of the fact
                expect(firstFact.y).to.equal(secFact.y);
            })
        })
    })

    it('should not truncate trailing zero on hundreths fact in modal and sidebar', () => {
        cy.loadByAccessionNum('000141057824002008')
        cy.get(selectors.factCountClock).should('not.exist')
        cy.get('#fact-identifier-315').click() // hundreths fact
        cy.get(selectors.factValueInModal).should('have.text', '0.70') // not 0.7
        cy.get(selectors.factModalJump).click();
        cy.get('a.sidebar-fact[selected-fact="true"] [data-cy="factVal"]').should('have.text', '0.70') // not 0.7
    })

    it('should have valid factValue on main screen and side bar', () => {
        // orig html: http://http://md-ud-edgxbrl01:8082/Archives/edgar/data/no-cik/filing-fee-decimal/EXFILINGFEES.htm

        cy.loadByAccessionNum('filing-fee-decimal')
        //should not round a high-precision amount (preserve 999,999,999,999.9999999)
        cy.get('#fact-identifier-40').click() // 999,999,999,999.9999999 fact
        cy.get(selectors.factValueInModal).should('have.text', '999,999,999,999.9999999') // not rounded 1,000,000,000,000.0000000
        cy.get(selectors.factModalJump).click();
        cy.get('a.sidebar-fact[selected-fact="true"] [data-cy="factVal"]').should('have.text', '999,999,999,999.9999999') // not rounded 

        // Decimal is 3 factValue is 54,615.00  
        cy.get('#fact-identifier-37').click() // 54,615.00  
        cy.get(selectors.factValueInModal).should('have.text', '54,615.000') // 54,615.000
        cy.get(selectors.factModalJump).click();
        cy.get('a.sidebar-fact[selected-fact="true"] [data-cy="factVal"]').should('have.text', '54,615.000')

          // Decimal 2 factValue=99.9045
        cy.get('#fact-identifier-41').click() // 99.9045 
        cy.get(selectors.factValueInModal).should('have.text', '99.90') // 99.90
        cy.get(selectors.factModalJump).click();
        cy.get('a.sidebar-fact[selected-fact="true"] [data-cy="factVal"]').should('have.text', '99.90') //99.90

        //Decimal is 'abs' factValue=16,262.99
        cy.get('#fact-identifier-43').click() // 16,262.99
        cy.get(selectors.factValueInModal).should('have.text', '16,262.99') // 16,262.99
        cy.get(selectors.factModalJump).click();
        cy.get('a.sidebar-fact[selected-fact="true"] [data-cy="factVal"]').should('have.text', '16,262.99') //16,262.99

         //Decimal is '0' factValue=242678436.99
         cy.get('#fact-identifier-20').click() 
         cy.get(selectors.factValueInModal).should('have.text', '242,678,437') 	
         cy.get(selectors.factModalJump).click();
         cy.get('a.sidebar-fact[selected-fact="true"] [data-cy="factVal"]').should('have.text', '242,678,437') 

           //Decimal is '0' factValue=242678436.00
        cy.get('#fact-identifier-22').click() 
        cy.get(selectors.factValueInModal).should('have.text', '242,678,436') 	
        cy.get(selectors.factModalJump).click();
        cy.get('a.sidebar-fact[selected-fact="true"] [data-cy="factVal"]').should('have.text', '242,678,436') 

         //Decimal is '1' factValue=33513.89
         cy.get('#fact-identifier-21').click() 
         cy.get(selectors.factValueInModal).should('have.text', '33,513.9') 	
         cy.get(selectors.factModalJump).click();
         cy.get('a.sidebar-fact[selected-fact="true"] [data-cy="factVal"]').should('have.text', '33,513.9') 

        cy.loadByAccessionNum('000143774923034166')
        cy.get('#fact-identifier-79').click() // 3,391,341 neg sign and commas fact no decimal
        cy.get(selectors.factValueInModal).should('have.text', '-3,391,341') // not rounded 3,391,341 kept neg sign and commas
        cy.get(selectors.factModalJump).click();
        cy.get('a.sidebar-fact[selected-fact="true"] [data-cy="factVal"]').should('have.text', '-3,391,341') // not rounded 3,391,341 kept neg sign and commas

    })
})