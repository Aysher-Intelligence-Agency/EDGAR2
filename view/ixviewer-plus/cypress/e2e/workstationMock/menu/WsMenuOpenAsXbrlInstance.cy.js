import { selectors } from "../../../utils/selectors.mjs"

/*
    To trigger isWorkstation as true in js code pass '&ws=true' to loadByAccessionNum or loadFiling
    Non workstation links are tested in cypress/e2e/menu
*/

describe(`Workstation - Menu open as xbrl instance`, () => {
    it(`Private filings should have private ht2.xml instance link`, () => {
        cy.loadByAccessionNum('000080786323000002', '&ws=true&redline=true');
        cy.get('button[data-test="menu-dropdown-link"]').click();

        cy.get('a[data-test="form-information-instance"]')
            .invoke('attr', 'href')
            .should('contain', 'ht2.xml');
    })
   
    it(`Public filings should have public ht1.xml instance link`, () => {
        cy.loadByAccessionNum('000080786323000002', '&ws=true&redline=false');
        cy.get('button[data-test="menu-dropdown-link"]').click();

        cy.get('a[data-test="form-information-instance"]')
            .invoke('attr', 'href')
            .should('contain', 'ht1.xml');
    })

    it(`Public filings should have public ht1.xml instance link when no redline param`, () => {
        cy.loadByAccessionNum('000080786323000002', '&ws=true');
        cy.get('button[data-test="menu-dropdown-link"]').click();

        cy.get('a[data-test="form-information-instance"]')
            .invoke('attr', 'href')
            .should('contain', 'ht1.xml');
    })
})