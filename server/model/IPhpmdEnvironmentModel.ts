import { WorkspaceFolder } from "vscode-languageserver";

/**
 * VSCode PHPMD environment model
 *
 * @module vscode-phpmd/server/model
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
interface IPhpmdEnvironmentModel {
    /**
     * WorkspaceFolders
     *
     * @property {WorkspaceFolder[]}
     */
    workspaceFolders: WorkspaceFolder[];
    
    /**
     * OS Home dir
     *
     * @property {string}
     */
    homeDir: string;
}

export default IPhpmdEnvironmentModel;
