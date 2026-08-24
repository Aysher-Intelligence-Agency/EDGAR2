import { selectors } from "../../../utils/selectors.mjs"

/*
    To trigger isWorkstation as true in js code pass '&ws=true' to loadByAccessionNum or loadFiling
    Non workstation links are tested in cypress/e2e/menu
*/

describe(`Workstation - Menu Open Html`, () => {
    it(`Private filings should have private ix2.htm link`, () => {
        cy.loadByAccessionNum('000080786323000002', '&ws=true&redline=true');
        cy.get('button[data-test="menu-dropdown-link"]').click();

        cy.get('a[data-test="form-information-html"]', {timeout: 2000})
            .invoke('attr', 'href')
            .should('contain', 'ix2.htm');
    })
   
    it(`Public filings should have public ix1.htm html link`, () => {
        cy.loadByAccessionNum('000080786323000002', '&ws=true&redline=false');
        cy.get('button[data-test="menu-dropdown-link"]').click();

        cy.get('a[data-test="form-information-html"]', {timeout: 2000})
            .invoke('attr', 'href')
            .should('contain', 'ix1.htm');
    })

    it(`Public filings should have public ix1.htm instance link when no redline param`, () => {
        cy.loadByAccessionNum('000080786323000002', '&ws=true');
        cy.get('button[data-test="menu-dropdown-link"]').click();

        cy.get('a[data-test="form-information-html"]', {timeout: 2000})
            .invoke('attr', 'href')
            .should('contain', 'ix1.htm');
    })
})