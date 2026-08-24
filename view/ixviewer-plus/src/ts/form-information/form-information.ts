/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

import { Constants } from "../constants/constants";
import { HelpersUrl } from "../helpers/url";

export const FormInformation = {
    init: () => {
        FormInformation.xbrlInstance();
        FormInformation.xbrlZip();
        FormInformation.xbrlHtml();
        FormInformation.version();
    },

    xbrlInstance: () => {
        const currentInstance = Constants.getInstances.find(element => element.current);
        const urlParams = HelpersUrl.returnURLParamsAsObject();
        let xmlUrl = currentInstance?.xmlUrl || '';
        if (HelpersUrl.isWorkstation() || HelpersUrl.isMockWorkstation()) {
            if (urlParams.redline) {
                // private
                xmlUrl = xmlUrl.replace('_htm.xml', '_ht2.xml')
            } else {
                // public
                xmlUrl = xmlUrl.replace('_htm.xml', '_ht1.xml')
            }
        }
        document.getElementById('form-information-instance')?.setAttribute('href', xmlUrl || "#");
    },

    xbrlZip: () => {
        // Handle Workstation case
        if (HelpersUrl.isWorkstation()) {
            const url = Constants.appWindow.location.href;
            const params = new URLSearchParams(Constants.appWindow.location.search);
            const zip = `${params.get("accessionNumber")}-xbrl.zip`;
            params.set("filename", zip);
            params.set("step", "docOnly");
            params.set("interpretedFormat", "false");
            params.delete("status");
            params.delete("sequenceNumber");

            const zipUrl = url.substring(0, url.indexOf("?")+1) + params.toString();
            document.getElementById("form-information-zip")?.setAttribute("href", zipUrl);
            document.getElementById("form-information-zip")?.setAttribute("target", "_blank");
            return;
        }

        const filePath = HelpersUrl.getExternalFile || "";
        const [_, beginning, CIK, filingID] = [...filePath.matchAll(/(.*Archives\/edgar\/data)\/([0-9]+|no-cik)\/([0-9-]+)\//g)].shift() || [];
        
        let zipFileName = '';
        let zipPath = '';

        if (beginning && CIK && filingID) {
            // conventional edgar file path
            // append -xbrl-zip to accession-num part of file path name
            // - accession num needs hyphens 
            // filepath of          /Archives/edgar/data/807863/000080786323000002/mitk-20230104.htm
            // should yield zip     /Archives/edgar/data/807863/0000807863-23-000002-xbrl.zip
            zipFileName = filingID;
            if (zipFileName?.indexOf('-') < 0) {
                zipFileName = filingID.substring(0, 10) + "-" + filingID.substring(10, 12) + "-" + filingID.substring(12, 18);
            }
            zipFileName += "-xbrl.zip";
            zipPath = `${beginning}/${CIK}/${filingID}/${zipFileName}`;
        } else {
            // loaded by arelle or on some other domain
            // with file path /1/doc.htm result will not seem to make sense, but arelle handles it well somehow.
            let lastSlash = filePath.lastIndexOf("/");
            let accNum = filePath.substring(lastSlash, lastSlash - 18);
            const accNumFormatted = accNum.substring(0, 10) + "-" + accNum.substring(10, 12) + "-" + accNum.substring(12, 18);
            zipFileName = accNumFormatted + '-xbrl.zip';
            zipPath = filePath.substring(0, lastSlash) + "/" + zipFileName;
        }

        document.getElementById("form-information-zip")?.setAttribute("href", zipPath);
    },

    xbrlHtml: () => {
        const currentXHTML = Constants.getInstances.find(element => element.current)?.docs.find(element => element.current);
        const urlParams = HelpersUrl.returnURLParamsAsObject();
        let htmlUrl = currentXHTML?.url || '';
        if (HelpersUrl.isWorkstation() || HelpersUrl.isMockWorkstation()) {
            if (urlParams.redline) {
                // private
                htmlUrl = htmlUrl.replace('.htm', '_ix2.htm');
            } else {
                // public
                htmlUrl = htmlUrl.replace('.htm', '_ix1.htm');
            }
        }
        document.getElementById('form-information-html')?.setAttribute('href', htmlUrl || "#");
    },

    version: () => {
        document.getElementById('form-information-version')!.innerText = `Version: ${Constants.version} (${Constants.featureSet})`;
    },
};
