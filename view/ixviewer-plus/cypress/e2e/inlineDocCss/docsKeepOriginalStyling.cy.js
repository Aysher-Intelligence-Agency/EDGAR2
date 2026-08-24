import { selectors } from "../../utils/selectors"

describe('Inline docs layout matches plain html version', () => {
    // p elem wrapping S-1 fact should not have user agent styles adding margin top and margin bottom of 26.6667px
    it('CSS reset should prevent margin top and bottom on p elems', () => {
        // example broken: http://md-ud-edgxbrl01:8082/ixviewer-release-24.4/ix.xhtml?doc=/Archives/edgar/data/no-cik/test/htmlfootnote/EXFILINGFEES.htm
        // orig html: http://md-ud-edgxbrl01:8082/Archives/edgar/data/no-cik/test/htmlfootnote/EXFILINGFEES.htm
        cy.loadByAccessionNum('htmlfootnote')
        cy.get('div:nth-child(2) > table > tbody > tr:nth-child(1) > td').then(($td) => {
            const height = $td.height();
            expect(height).to.be.lt(40);
        })
    })

    it('Paragraph top and bottom margin', () => {
        // http://md-ud-edgxbrl02:8082/ixviewer-ix-dev/ix.xhtml?doc=/Archives/edgar/data/1090009/000120677425000099/sfst4401651-10k.htm
        // http://localhost:3000/ix.xhtml?doc=/Archives/edgar/data/1090009/000120677425000099/sfst4401651-10k.htm
        /* paragraph text: 
            "CAUTIONARY NOTE REGARDING
            FORWARD-LOOKING STATEMENTS"
        */
        cy.loadByAccessionNum('000120677425000099')
        cy.get('#xbrl-section-current > p:nth-child(37)').then(($p) => {
            // strip out 'px' at end and convert to numbers.
            const marginTop = parseFloat(getComputedStyle($p[0]).marginTop);
            const marginBtm = parseFloat(getComputedStyle($p[0]).marginBottom);
            expect(marginTop).to.be.within(12, 15);
            expect(marginBtm).to.be.within(12, 15);
        })
    })

    it('Link color is user agent', () => {
        // http://md-ud-edgxbrl02:8082/ixviewer-ix-dev/ix.xhtml?doc=/Archives/edgar/data/1090009/000120677425000099/sfst4401651-10k.htm
        // http://localhost:3000/ix.xhtml?doc=/Archives/edgar/data/1090009/000120677425000099/sfst4401651-10k.htm
        cy.loadByAccessionNum('000120677425000099')
        cy.get('#xbrl-section-current > p:nth-child(2) > a').then(($link) => {
            const fontColor = getComputedStyle($link[0]).color;
            expect(fontColor).to.eq('rgb(0, 0, 238)'); // set by chrome.  May change with chrome updates.
        })
    })

    it('Some headings in table are bold', () => {
        // http://md-ud-edgxbrl02:8082/ixviewer-ix-dev/ix.xhtml?doc=/Archives/edgar/data/1090009/000120677425000099/sfst4401651-10k.htm
        // http://localhost:3000/ix.xhtml?doc=/Archives/edgar/data/1090009/000120677425000099/sfst4401651-10k.htm
        cy.loadByAccessionNum('000120677425000099')
        cy.get('#dynamic-xbrl-form table:nth-child(89) > tbody > tr:nth-child(2) > td:nth-child(1) > span > b').then(($tHead) => {
            const fontWt = getComputedStyle($tHead[0]).fontWeight;
            expect(fontWt).to.eq('900');
        })
    })

    it("Table should have full-screen width (Not overwritten by ixviewer)", () => {
        cy.viewport(1920, 1080);
        cy.loadByAccessionNum('000175392625000093');
        cy.get('table').contains('table', '5225 Wiley Post Way, Suite 500').then(($table) => {
            let width = window.getComputedStyle($table[0]).width;
            // Width is currently a string like '1870px'. This will strip the letters out and convert it to a number
            width = Number(width.replace(/px/g, ''));
            // Giving it 1% wiggle room so it doesn't have to be pixel-perfect
            cy.expect(width).to.be.within(0.98 * 1870, 1.02 * 1870);
        })
    })

    it('Dont apply boostrap margins to horiztontal rules (hrs)', () => {
        // example broken: http://md-ud-edgxbrl01:8082/ixviewer-release-24.4/ix.xhtml?doc=/Archives/edgar/data/1517396/000121390021056659/stratasys-991.htm
        // orig html: http://md-ud-edgxbrl01:8082/Archives/edgar/data/1517396/000121390021056659/stratasys-991.htm
        cy.loadByAccessionNum('000121390021056659-991')
        cy.get('div > div:nth-child(2) > div:nth-child(15) > div > div:nth-child(2) > hr').should('have.css', 'margin-top', '5px')
        cy.get('div > div:nth-child(2) > div:nth-child(15) > div > div:nth-child(2) > hr').should('have.css', 'margin-bottom', '5px')
    })

    
    it('HR original left and right margin should not be changed (±2px tolerance)', () => {
       cy.loadByAccessionNum('000119312525229869')
       cy.get('hr[style*="width:120pt"][style*="height:0.75pt"][style*="margin-top:4.0pt"][style*="margin-bottom:0pt"]')
       .first()
       .then(($hr) => {
        const ixML =parseFloat(getComputedStyle($hr[0]).marginLeft);
        const ixMR =parseFloat(getComputedStyle($hr[0]).marginRight);
      
        expect(Math.abs(ixML - 279)).to.be.lte(2); // ±2px tolerance
        expect(Math.abs(ixMR - 279)).to.be.lte(2);
       })

       cy.get('hr[style*="margin-top:40.0pt"][style*="margin-bottom:0.25pt"][style*="margin-left:0.25pt"][style*="margin-right:0.25pt"]')
       .first()
       .then(($hr) => {
        const ixML =parseFloat(getComputedStyle($hr[0]).marginLeft);
        const ixMR =parseFloat(getComputedStyle($hr[0]).marginRight);
      
        expect(Math.abs(ixML - 0.333333)).to.be.lte(2); // ±2px tolerance
        expect(Math.abs(ixMR - 0.333333)).to.be.lte(2);
       })

        cy.get('hr[style*="width:540pt"][style*="height:0.75pt"][style*="margin-top:4.0pt"][style*="margin-bottom:1.5pt"][style*="margin-left:0%"][style*="top:-1pt"]')
       .first()
       .then(($hr) => {
        const ixML =parseFloat(getComputedStyle($hr[0]).marginLeft);
    
        expect(Math.abs(ixML - 0)).to.be.lte(2); // ±2px tolerance
       })
       
        cy.loadByAccessionNum('000005114323000021')
        cy.get('hr[style*="page-break-after:always"]')
       .first()
       .then(($hr) => {
        const ixML =parseFloat(getComputedStyle($hr[0]).marginLeft);
        const ixMR =parseFloat(getComputedStyle($hr[0]).marginRight);
        expect(Math.abs(ixML - 0)).to.be.lte(2); // ±2px tolerance
        expect(Math.abs(ixMR - 0)).to.be.lte(2);
       })
    })

    it('Table should have 100% width', () => {
        // example broken: http://md-ud-edgxbrl01:8082/ixviewer-release-24.4/ix.xhtml?doc=/Archives/edgar/data/1517396/000121390021056659/stratasys-991.htm
        // orig html: http://md-ud-edgxbrl01:8082/Archives/edgar/data/1517396/000121390021056659/stratasys-991.htm
        cy.viewport(1600, 1080);
        cy.loadByAccessionNum('000121390021056659-991')
        cy.get('#t001').then(($table) => {
            const width = $table.width();
            expect(width).to.be.gt(1540);
        })
    })

    it('Address should have times new roman font', () => {
        // example broken (legacy): https://www.sec.gov/ix?doc=/Archives/edgar/data/0000067215/000094787124000794/ss3949877_8k.htm
        // orig html: https://www.sec.gov/Archives/edgar/data/67215/000094787124000794/ss3949877_8k.htm
        cy.loadByAccessionNum('000094787124000794');
        cy.get('#fact-identifier-8').should('have.css', 'font-family', '"Times New Roman"')
    })

    it('Tables should not have excess top and bottom padding', () => {
        cy.viewport(1920, 1080);
        cy.loadByAccessionNum('htmlfootnote');
        // http://localhost:3000/ix.xhtml?doc=/Archives/edgar/data/no-cik/test/htmlfootnote/EXFILINGFEES.htm
        // Grab the row which contains the words "Calculation of Filing Fee Tables"
        cy.get('tr').contains('tr', 'Calculation of Filing Fee Tables').then(($table) => {
            // Height element should be around 45px (Bugged was more than double)
            let height = window.getComputedStyle($table[0]).getPropertyValue('height');
            height = Number(height.replace(/[^\d.-]/g, ''));
            // Giving it 1% wiggle room so it doesn't have to be pixel-perfect
            cy.expect(height).to.be.within(0.99 * 45, 1.01 * 45);
        })
    })

    it('<B> elements should have a font-weight of "Bold", not "Bolder"', () => {
        cy.loadByAccessionNum('htmlfootnote');
        // Grab the B element which contains the words "Calculation of Filing Fee Tables"
        cy.get('b').contains('b', 'Calculation of Filing Fee Tables').then(($table) => {
            // Should be weight 700
            let fontWeight = window.getComputedStyle($table[0]).fontWeight
            cy.expect(fontWeight).to.eq('700')
        })
    })

    it('H1 tags should have a font size 24', () => {
        cy.loadByAccessionNum('htmlfootnote');
        // Grab the B element which contains the words "Calculation of Filing Fee Tables"
        cy.get('h1').contains('h1', 'For a fee calculated as').then(($table) => {
            // Should be weight 700
            let fontSize = window.getComputedStyle($table[0]).fontSize
            cy.expect(fontSize).to.eq('32px')
        })
    })

    it('"Tagged Sections" in Sections Sidebar should have computed font weight of 500', () => {
        cy.loadByAccessionNum('htmlfootnote');
        cy.get(selectors.sectionsHeader).click().then(() => {
            // Grab the B element which contains the words "Calculation of Filing Fee Tables"
            cy.get('h5').contains('h5', 'Tagged Sections').then(($table) => {
                // Should be weight 500
                let fontSize = window.getComputedStyle($table[0]).fontWeight
                cy.expect(fontSize).to.eq('500')
            })
        })
    })

    it('P elements should not have excess padding', () => {
        cy.viewport(1920, 1080);
        cy.loadByAccessionNum('htmlfootnote');
        // Grab the row which contains the words "Calculation of Filing Fee Tables"
        cy.get('p').contains('p', 'Calculation of Filing Fee Tables').then(($table) => {
            // All these properties should be 0px - Bugged version came out to 26.6px
            let margin = window.getComputedStyle($table[0]).getPropertyValue('margin');
            margin = Number(margin.replace(/[^\d.-]/g, ''));

            let marginBlock = window.getComputedStyle($table[0]).getPropertyValue('marginBlock');
            marginBlock = Number(marginBlock.replace(/[^\d.-]/g, ''));

            let marginBlockStart = window.getComputedStyle($table[0]).getPropertyValue('marginBlockStart');
            marginBlockStart = Number(marginBlockStart.replace(/[^\d.-]/g, ''));

            let marginBlockEnd = window.getComputedStyle($table[0]).getPropertyValue('marginBlockEnd');
            marginBlockEnd = Number(marginBlockEnd.replace(/[^\d.-]/g, ''));

            let marginBlockBottom = window.getComputedStyle($table[0]).getPropertyValue('marginBottom');
            marginBlockBottom = Number(marginBlockBottom.replace(/[^\d.-]/g, ''));

            let marginTop = window.getComputedStyle($table[0]).getPropertyValue('marginTop');
            marginTop = Number(marginTop.replace(/[^\d.-]/g, ''));

            let webkitMarginBefore = window.getComputedStyle($table[0]).getPropertyValue('webkitMarginBefore');
            webkitMarginBefore = Number(webkitMarginBefore.replace(/[^\d.-]/g, ''));

            let webkitMarginAfter = window.getComputedStyle($table[0]).getPropertyValue('webkitMarginAfter');
            webkitMarginAfter = Number(webkitMarginAfter.replace(/[^\d.-]/g, ''));

            // Each one of these should be 0.
            // Giving it 5px wiggle room so it doesn't have to be pixel-perfect
            cy.expect(margin).to.be.within(0, 5);
            cy.expect(marginBlock).to.be.within(0, 5);
            cy.expect(marginBlockStart).to.be.within(0, 5);
            cy.expect(marginBlockEnd).to.be.within(0, 5);
            cy.expect(marginBlockBottom).to.be.within(0, 5);
            cy.expect(marginTop).to.be.within(0, 5);
            cy.expect(webkitMarginBefore).to.be.within(0, 5);
            cy.expect(webkitMarginAfter).to.be.within(0, 5);
        })
    })

    it('Selected Text Block Facts that are enabled should have an outline', () => {
        // Warning.  Zoom level of browser will affect this.
        // Outline is less reliable in relative size than box-shadow.  Likely to be smaller.  2px -> 1.1111px
        // Faling tests are due to outline property, not cypress flakiness.
        cy.loadByAccessionNum('000143774923034166');
        // Looking at a text block fact
        cy.get('[id="fact-identifier-185"]').click().then($fact => {
            cy.get(selectors.factModalClose).click()
            // cy.get('[id="fact-identifier-185"]').should('have.css', 'outline-width', '2px')
            const outlineWidth = parseFloat(getComputedStyle($fact[0]).outlineWidth);
            expect(outlineWidth).to.be.within(1, 2.2); // Orig value = 2px
            // perhaps we see if we should use box-shadow again...
        });
    })

    it('Page break HR elements should be displayed all black with opacity 1', () => {
        cy.loadByAccessionNum('000143774923034166');
        // Grabbing an HR element
        cy.get('hr[style^="PAGE-BREAK-AFTER"]').then(($pageBreak) => {
            // Checking it's color and opacity
            let color = window.getComputedStyle($pageBreak[0]).color;
            let opacity = window.getComputedStyle($pageBreak[0]).opacity;
            cy.expect(color).to.eq("rgb(0, 0, 0)");
            cy.expect(opacity).to.eq("1");
        })
    })

    it('Continued Facts should have the same font throughout', () => {
        cy.viewport(1920, 1080);
        cy.loadWithHash('000121390021056659-991', 'fact-identifier-570');
        // Checking the font of the beginning fact
        cy.get('[ix=fact-identifier-570]').then(($fact) => {
            let font = window.getComputedStyle($fact[0]).font;
            cy.expect(font).to.include('"Times New Roman"')
        })
        //Checking the font of the continued facts.
        cy.get('[continued-main-fact-id="fact-identifier-570"]').each((contFact, index, list) => {
            let font = window.getComputedStyle(contFact[0]).font;
            cy.expect(font).to.include('"Times New Roman"')
        })
    })

    it('Dycom Filing Address font should be times new roman', () => {+
        cy.loadByAccessionNum('000094787124000794')
        cy.get('#fact-identifier-8').should('have.css', 'font-family', '"Times New Roman"');
    })
    
    it('TCW Filing Table font should be arial', () => {
        cy.loadByAccessionNum('000119312524185882')
        cy.get('div:nth-child(3) > div > div:nth-child(97) > div:nth-child(7) > table > tbody > tr:nth-child(7) > td:nth-child(1) > div')
            .should('have.css', 'font-family', 'arial');
    })

    it('Vertical alignment of text and images should be at bottom of line', () => {
        cy.loadByAccessionNum('DonnelleyTest')
        // img element should not have vertical align property that was being set by bootstrap reboot 'center', should be 'baseline' instead.
        cy.get('#fact-identifier-26 > p:nth-child(3) > img').should('have.css', 'vertical-align', 'baseline');
        cy.get('#fact-identifier-26 > p:nth-child(3) > span').should('have.css', 'vertical-align', 'baseline');
    })

    it('2 column layout for Loews', () => {
        // /Archives/edgar/data/60086/000114036125011755/ny20041383x1_def14a.htm
        cy.loadByAccessionNum('000114036125011755')
        cy.get('.BRDSX_BRDSX_block-main-columns').should('have.css', 'box-sizing', 'content-box');
    })
})
