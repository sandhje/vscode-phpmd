import { IPmdViolationMetaData } from "./IPmdViolationMetaData";

/**
 * PHP mess detector violation interface
 *
 * @module vscode-phpmd/server/model/pmd
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
export interface IPmdViolation {
    /**
     * PHP mess detector violation message
     *
     * @property {string}
     */
    _: string;

    /**
     * PHP mess detector violation metadata
     *
     * @property {IPmdViolationMetaData}
     */
    $: IPmdViolationMetaData;
}
