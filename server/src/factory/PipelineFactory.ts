import { Pipeline } from "@open-sourcerers/j-stillery";
import IPhpmdSettingsModel from "../model/IPhpmdSettingsModel";
import PipelinePayloadModel from "../model/PipelinePayloadModel";
import ILogger from "../service/logger/ILogger";
import NullLogger from "../service/logger/NullLogger";
import BuildDiagnosticsTaskFactory from "./BuildDiagnosticsTaskFactory";
import ExecuteProcessTaskFactory from "./ExecuteProcessTaskFactory";
import IFactory from "./IFactory";
import ParseTaskFactory from "./ParseTaskFactory";

class PipelineFactory implements IFactory<Pipeline<PipelinePayloadModel>> {
    constructor(
        private settings: IPhpmdSettingsModel,
        private logger: ILogger = new NullLogger()
    ) { }

    public create(): Pipeline<PipelinePayloadModel> {
        let pipeline = new Pipeline<PipelinePayloadModel>()
            .pipe(new ExecuteProcessTaskFactory(this.settings, this.logger).create())
            .pipe(new ParseTaskFactory(this.settings).create())
            .pipe(new BuildDiagnosticsTaskFactory(this.settings).create());

        return pipeline;
    }
}

export default PipelineFactory;
