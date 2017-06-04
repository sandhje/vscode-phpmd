/**
 * PHP mess detector violation metadata interface
 *
 * @module vscode-phpmd/server/model/pmd
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
export interface IPmdViolationMetaData {
    /**
     * PHP mess detector violation begin line
     *
     * @property {string}
     */
    beginline: string;

    /**
     * PHP mess detector violation class name
     *
     * @property {string}
     */
    class: string;

    /**
     * PHP mess detector violation end line
     *
     * @property {string}
     */
    endline: string;

    /**
     * PHP mess detector violation external info url
     *
     * @property {string}
     */
    externalInfoUrl?: string;

    /**
     * PHP mess detector violation package
     *
     * @property {string}
     */
    package: string;

    /**
     * PHP mess detector violation priority
     *
     * @property {string}
     */
    priority: string;

    /**
     * PHP mess detector violation rule
     *
     * @property {string}
     */
    rule: string;

    /**
     * PHP mess detector violation ruleset
     *
     * @property {string}
     */
    ruleset: string;
}
