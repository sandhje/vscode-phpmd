/**
 * PHP mess detector metadata interface
 *
 * @module vscode-phpmd/server/model/pmd
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
export interface IPmdMetaData {
    /**
     * Report timestamp
     *
     * @property {string}
     */
    timestamp: string;

    /**
     * PHP mess detector version
     *
     * @property {string}
     */
    version: string;
}
