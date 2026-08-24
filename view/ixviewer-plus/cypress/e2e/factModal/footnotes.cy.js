import { selectors } from "../../utils/selectors"

describe('Fact Footnotes', () => {
    it('Ibm footnote 856 should show text', () => {
        /*
        instanceFootnotes["link:footnote"]: 
        {
            "_attributes": {
                "id": "fn-1",
                "xlink:label": "fn-1",
                "xlink:role": "http://www.xbrl.org/2003/role/footnote",
                "xlink:type": "resource",
                "xml:lang": "en-US"
            },
            "_text": "Includes immaterial cash flows from discontinued operations."
        }
        */
        cy.visit('/Archives/edgar/data/0000051143/000005114323000021/ibm-20230630.htm#fact-identifier-856')
        cy.get(selectors.modalFootnoteVal).should('contain.text', 'Includes immaterial cash flows from discontinued operations.')
    });

    it('vpip footnote 2920 should show text', () => {
        /*
        instanceFootnotes["link:footnote"]: 
        {
            "_attributes": {
                "id": "fn-1",
                "xlink:label": "fn-1",
                "xlink:role": "http://www.xbrl.org/2003/role/footnote",
                "xlink:type": "resource",
                "xml:lang": "en-US"
            },
            "_text": "Includes immaterial cash flows from discontinued operations."
        }
        */

        cy.visit('/Archives/edgar/data/no-cik/0001437749-23-027411/vpip20230630_20f.htm#fact-identifier-2920')
        cy.get(selectors.modalFootnoteVal).should('contain.text', 'The $0.4 million of transaction costs incurred in the year ended June 30, 2023 (year ended June 30, 2022: $0.1 million; year ended June 30, 2021: $2.8 million) relate primarily to capital raises on Nasdaq.')
    });

    it('vpip footnote 1923 should NOT show text', () => {
        cy.visit('/Archives/edgar/data/no-cik/0001437749-23-027411/vpip20230630_20f.htm#fact-identifier-1923')
        cy.get('[data-cy="Tag-value"]').should('exist')
        cy.get(selectors.modalFootnoteVal).should('not.exist')
    });

    it('Fact 1362 should show text of 2 footnotes', () => {
        /*
        instanceFootnotes["link:footnote"]: 
        ...,
        {
            "_attributes": {
                "id": "FNT_61b5de8e-1a58-44e5-8eac-f24b56edfec2",
                "xlink:label": "FNT_61b5de8e-1a58-44e5-8eac-f24b56edfec2",
                "xlink:role": "http://www.xbrl.org/2003/role/footnote",
                "xlink:type": "resource",
                "xml:lang": "en-US"
            },
            "xhtml:span": {
                "_attributes": {
                    "style": "color:#000000;white-space:pre-wrap;font-size:10pt;font-family:Times New Roman;font-kerning:none;min-width:fit-content;"
                },
                "_text": "Refer to Note 22"
            }
        },
        ...
        */

        cy.visit('/Archives/edgar/data/1123799/000095017025076303/wit-20250331.htm#fact-identifier-1362')
        cy.get('[data-cy="Tag-value"]').should('exist')
        cy.get(selectors.modalFootnoteVal).should('contain.text', 'Includes 11,905,480 treasury shares held as at March 31, 2025 by a controlled trust.');
        cy.get(selectors.modalFootnoteVal).should('contain.text', 'Refer to Note 22');
    });

    it('Instance has 1 footnote (footnotes not array)', () => {
        /*
        instanceFootnotes["link:footnote"]: 
        {
            "_attributes": {
                "id": "x_000007_858a8538-619b-48d9-8b44-c76e2ec6f115",
                "xlink:label": "x_000007_858a8538-619b-48d9-8b44-c76e2ec6f115",
                "xlink:role": "http://www.xbrl.org/2003/role/footnote",
                "xlink:type": "resource",
                "xml:lang": "en-US"
            },
            "xhtml:span": {
                "_attributes": {
                    "style": "font-family:Times New Roman;font-size:7.5pt;font-style:italic;"
                },
                "_text": "The Fund’s “Other Expenses” have been estimated to reflect expenses expected to be incurred during the first fiscal year."
            }
        }
        */
        cy.visit('/Archives/edgar/data/1479026/000119312525229869/d50048d485bpos.htm#fact-identifier-15')
        cy.get(selectors.modalFootnoteVal).should('contain.text', 'The Fund’s “Other Expenses” have been estimated to reflect expenses expected to be incurred during the first fiscal year.');
    });

})