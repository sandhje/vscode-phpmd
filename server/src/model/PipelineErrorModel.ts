/**
 * PHP mess detector validation pipeline error interface
 *
 * @module vscode-phpmd/server/model
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class PipelineErrorModel {
    /**
     * Pipeline error model constructor
     *
     * @param {any} error Original error object
     * @param {boolean} silent Flag indicating wether the client should show a notification to the user or not
     */
    public constructor(
        public error: any,
        public silent: boolean = false
    ) { }
}

export default PipelineErrorModel;
