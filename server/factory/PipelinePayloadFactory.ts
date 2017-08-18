import { Pipeline } from "@open-sourcerers/j-stillery";
import PipelinePayloadModel from "../model/PipelinePayloadModel";
import IFactory from "./IFactory";

/**
 * PHP mess detector pipeline payload model factory
 *
 * @module vscode-phpmd/server/factory
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class PipelinePayloadFactory implements IFactory<PipelinePayloadModel> {
    /**
     * @param {string} uri
     */
    constructor(
        private uri: string
    ) { }

    /**
     * Set file URI to be used upon creating a new instance of the model
     *
     * @param uri
     */
    public setUri(uri: string) {
        this.uri = uri;

        return this;
    }

    /**
     * Create pipeline payload model instance
     *
     * @see IFaction::create
     * @returns {PipelinePayloadModel}
     */
    public create(): PipelinePayloadModel {
        return new PipelinePayloadModel(this.uri);
    }
}

export default PipelinePayloadFactory;
