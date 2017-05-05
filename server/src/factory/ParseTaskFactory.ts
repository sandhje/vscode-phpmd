import { Task } from "@open-sourcerers/j-stillery";
import * as Xml2Js from "xml2js";
import IPhpmdSettingsModel from "../model/IPhpmdSettingsModel";
import PipelinePayloadModel from "../model/PipelinePayloadModel";
import ParseStrategy from "../service/pipeline/ParseStrategy";
import IFactory from "./IFactory";

class ExecuteProcessTaskFactory implements IFactory<Task<PipelinePayloadModel>> {
    constructor(
        private settings: IPhpmdSettingsModel
    ) { }

    public create(): Task<PipelinePayloadModel> {
        let strategy = new ParseStrategy(this.getParser());

        return new Task<PipelinePayloadModel>(strategy);
    }

    protected getParser(): Xml2Js.Parser {
        return new Xml2Js.Parser();
    }
}

export default ExecuteProcessTaskFactory;
