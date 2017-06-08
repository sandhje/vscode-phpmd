import { IPmdFileData } from "./IPmdFileData";
import { IPmdMetaData } from "./IPmdMetaData";

/**
 * PHP mess detector output interface
 *
 * @module vscode-phpmd/server/model/pmd
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
export interface IPmd {
    /**
     * PHP mess detector metadata
     *
     * @property {IPmdMetaData}
     */
    $: IPmdMetaData;

    /**
     * PHP mess detector file data
     *
     * @property {IPmdFileData}
     */
    file: IPmdFileData[];
}
