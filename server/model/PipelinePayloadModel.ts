import { Diagnostic } from "vscode-languageserver";
import { URI } from "vscode-uri";
import { IPmd } from "./pmd";

/**
 * PHP mess detector validation pipeline payload interface
 *
 * @module vscode-phpmd/server/model
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class PipelinePayloadModel {
    /**
     * URI of file to be validated
     *
     * @property {string}
     */
    public uri: string = "";

    /**
     * File path for file to be validated
     *
     * @readonly
     * @property {string}
     */
    public get path(): string {
        return URI.parse(this.uri).fsPath;
    }

    /**
     * Raw validation result
     *
     * @property {string}
     */
    public raw: string = "";

    /**
     * Parsed validation result
     *
     * @property {IPmd}
     */
    public pmd: IPmd;

    /**
     * List of VSCode diagnosticts
     *
     * @property {Diagnostic[]}
     */
    public diagnostics: Diagnostic[] = [];

    /**
     * Validation pipeline payload model constructor
     *
     * @param {string} uri URI of file to be validated
     */
    public constructor(uri: string) {
        this.uri = uri;
    }
}

export default PipelinePayloadModel;
