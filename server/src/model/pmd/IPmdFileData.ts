import { IPmdFileMetaData } from "./IPmdFileMetaData";
import { IPmdViolation } from "./IPmdViolation";

/**
 * PHP mess detector file data interface
 *
 * @module vscode-phpmd/server/model/pmd
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
export interface IPmdFileData {
    /**
     * PHP mess detector file metadata
     *
     * @property {IPmdFileMetaData}
     */
    $: IPmdFileMetaData;

    /**
     * PHP mess detector violations list
     *
     * @property {IPmdViolation[]}
     */
    violation: IPmdViolation[];
}
