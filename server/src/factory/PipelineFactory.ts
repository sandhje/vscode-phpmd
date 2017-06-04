import { Pipeline } from "@open-sourcerers/j-stillery";
import IPhpmdSettingsModel from "../model/IPhpmdSettingsModel";
import PipelinePayloadModel from "../model/PipelinePayloadModel";
import ILogger from "../service/logger/ILogger";
import NullLogger from "../service/logger/NullLogger";
import BuildDiagnosticsTaskFactory from "./BuildDiagnosticsTaskFactory";
import ExecuteProcessTaskFactory from "./ExecuteProcessTaskFactory";
import IFactory from "./IFactory";
import ParseTaskFactory from "./ParseTaskFactory";

/**
 * PHP mess detector validation pipeline factory
 *
 * @module vscode-phpmd/server/factory
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class PipelineFactory implements IFactory<Pipeline<PipelinePayloadModel>> {
    /**
     * @param {IPhpmdSettingsModel} settings
     * @param {ILogger} logger
     */
    constructor(
        private settings: IPhpmdSettingsModel,
        private logger: ILogger = new NullLogger()
    ) { }

    /**
     * Create validation pipeline instance
     *
     * Configure pipeline with tasks:
     * - ExecuteProcess task
     * - Parse task
     * - BuildDiagnostics task
     *
     * @see IFaction::create
     * @returns {Pipeline<PipelinePayloadModel>}
     */
    public create(): Pipeline<PipelinePayloadModel> {
        let pipeline = new Pipeline<PipelinePayloadModel>()
            .pipe(new ExecuteProcessTaskFactory(this.settings, this.logger).create())
            .pipe(new ParseTaskFactory(this.settings).create())
            .pipe(new BuildDiagnosticsTaskFactory(this.settings, this.logger).create());

        return pipeline;
    }
}

export default PipelineFactory;
