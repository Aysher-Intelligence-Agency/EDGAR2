import "../styles.scss";
import { Constants } from "./constants/constants";
import { Errors } from "./errors/errors";
import { ErrorsMajor } from "./errors/major";
import { Listeners } from "./listeners";
import { SetCustomCSS } from "./settings";
import { App } from "./app/app";
import { Logger, ILogObj } from "tslog";

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

(() => {
    new Listeners();
    new SetCustomCSS();
    const startPerformance = performance.now();

    App.init(false, (formLoaded: boolean) => {
        console.log(`Version: ${Constants.version} (${Constants.featureSet})`);
        console.log(`CSS Mode: ${(document.compatMode=="CSS1Compat" ? "Standards 🎉" : "Quirks 😢")}`);

        if (formLoaded) {
            Errors.updateMainContainerHeight(false);
            App.initialSetup();
            removeHideClassFromSidebars();
        } else {
            ErrorsMajor.formNotLoaded();
        }

        const endPerformance = performance.now();
        if (DEBUGCSS) {
            // ErrorsMajor.debug();
        }
        if (LOGPERFORMANCE) {
            const log: Logger<ILogObj> = new Logger();
            log.debug(`AppInit.init() completed in: ${(endPerformance - startPerformance).toFixed(2)}ms`);
        }
    });

    const removeHideClassFromSidebars = () => {
        // fact and sections sidebars must be in DOM to be populated, but we want visibility-none during load.
        document.querySelector('.sidebar-container-right')?.classList.remove('hide'); // Facts Sidebar
        document.querySelector('.help-sidebar')?.classList.remove('hide');
        document.querySelector('.sections-sidebar')?.classList.remove('hide');
        document.getElementById('sections-menu')?.classList.remove('show');
        document.getElementById('facts-menu')?.classList.remove('show');
    };
})();
