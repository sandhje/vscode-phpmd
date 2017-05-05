import { Pipeline } from "@open-sourcerers/j-stillery";
import PipelinePayloadModel from "../model/PipelinePayloadModel";
import IFactory from "./IFactory";

class PipelinePayloadFactory implements IFactory<PipelinePayloadModel> {
    constructor(
        private uri: string
    ) { }

    public setUri(uri: string) {
        this.uri = uri;

        return this;
    }

    public create(): PipelinePayloadModel {
        return new PipelinePayloadModel(this.uri);
    }
}

export default PipelinePayloadFactory;
