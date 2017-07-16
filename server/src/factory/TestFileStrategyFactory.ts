import { Task } from "@open-sourcerers/j-stillery";
import * as fs from "fs";
import IPhpmdSettingsModel from "../model/IPhpmdSettingsModel";
import PipelinePayloadModel from "../model/PipelinePayloadModel";
import ILogger from "../service/logger/ILogger";
import NullLogger from "../service/logger/NullLogger";
import TestFileStrategy from "../service/pipeline/TestFileStrategy";
import IFactory from "./IFactory";

/**
 * Test file task factory
 *
 * @module vscode-phpmd/server/factory
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class TestFileStrategyFactory implements IFactory<Task<PipelinePayloadModel>> {
    /**
     * Test file factory constructor
     *
     * @param {IPhpmdSettingsModel} settings
     * @param {ILogger} logger
     */
    constructor(
        private settings: IPhpmdSettingsModel,
        private logger: ILogger = new NullLogger()
    ) { }

    /**
     * Create TestFile pipeline task instance
     *
     * @see IFactory::create
     * @returns {Task<PipelinePayloadModel>}
     */
    public create(): Task<PipelinePayloadModel> {
        let strategy = new TestFileStrategy(fs.readFile, this.logger);

        return new Task<PipelinePayloadModel>(strategy);
    }
}

export default TestFileStrategyFactory;
