import { Task } from "@open-sourcerers/j-stillery";
import * as Xml2Js from "xml2js";
import IPhpmdSettingsModel from "../model/IPhpmdSettingsModel";
import PipelinePayloadModel from "../model/PipelinePayloadModel";
import BuildDiagnosticsStrategy from "../service/pipeline/BuildDiagnosticsStrategy";
import IFactory from "./IFactory";

class BuildDiagnosticsTaskFactory implements IFactory<Task<PipelinePayloadModel>> {
    constructor(
        private settings: IPhpmdSettingsModel
    ) { }

    public create(): Task<PipelinePayloadModel> {
        let strategy = new BuildDiagnosticsStrategy();

        return new Task<PipelinePayloadModel>(strategy);
    }
}

export default BuildDiagnosticsTaskFactory;
