/** @odoo-module */
// @ts-check

import { _t } from "@web/core/l10n/translation";
import { toServerDateString } from "../helpers/helpers";
import { EvaluationError } from "@odoo/o-spreadsheet";

/**
 * @typedef Currency
 * @property {string} name
 * @property {string} code
 * @property {string} symbol
 * @property {number} decimalPlaces
 * @property {"before" | "after"} position
 */
export class CurrencyDataSource {
    constructor(params) {
        /** @type {import("../data_sources/server_data").ServerData} */
        this.serverData = params.serverData;
    }

    /**
     * Get the currency rate between the two given currencies
     * @param {string} from Currency from
     * @param {string} to Currency to
     * @param {string|undefined} date
     * @returns {number|undefined}
     */
    getCurrencyRate(from, to, date) {
        const data = this.serverData.batch.get("res.currency.rate", "get_rates_for_spreadsheet", {
            from,
            to,
            date: date ? toServerDateString(date) : undefined,
        });
        const rate = data !== undefined ? data.rate : undefined;
        if (rate === false) {
            throw new EvaluationError(_t("Currency rate unavailable."));
        }
        return rate;
    }

    /**
     *
     * @param {number|undefined} companyId
     * @returns {Currency}
     */
    getCompanyCurrencyFormat(companyId) {
        const result = this.serverData.get("res.currency", "get_company_currency_for_spreadsheet", [
            companyId,
        ]);
        if (result === false) {
            throw new EvaluationError(_t("Currency not available for this company."));
        }
        return result;
    }

    /**
     * Get all currencies from the server
     * @param {string} currencyName
     * @returns {Currency}
     */
    getCurrency(currencyName) {
        return this.serverData.batch.get(
            "res.currency",
            "get_currencies_for_spreadsheet",
            currencyName
        );
    }
}
