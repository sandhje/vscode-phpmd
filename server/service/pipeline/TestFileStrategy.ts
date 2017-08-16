import { IExecuteStrategy } from "@open-sourcerers/j-stillery";
import * as fs from "fs";
import PipelineErrorModel from "../../model/PipelineErrorModel";
import PipelinePayloadModel from "../../model/PipelinePayloadModel";
import ILogger from "../logger/ILogger";
import NullLogger from "../logger/NullLogger";

/**
 * Test file pipeline task strategy
 *
 * Strategy used to test wether the file to be analyzed by PHPMD is readable
 *
 * @module vscode-phpmd/service/pipeline
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class TestFileStrategy implements IExecuteStrategy<PipelinePayloadModel> {
    /**
     * Test file task strategy constructor
     *
     * @param {IReadFile} readfile
     * @param {ILogger} logger
     */
    public constructor(
        private readfile: IReadFile,
        private logger: ILogger = new NullLogger()
    ) { }

    /**
     * Strategy executor
     *
     * Test wether the file is in the input is readable
     *
     * @see IExecuteStrategy::execute
     */
    public execute(
        input: PipelinePayloadModel,
        resolve: (output?: PipelinePayloadModel | PromiseLike<PipelinePayloadModel>) => void,
        reject: (reason: any) => void
    ) {
        this.readfile(input.path, "utf8", (err: NodeJS.ErrnoException, data: string) => {
            // Reject the pipeline if the file was not found or is not readable
            if (err) {
                this.logger.error("File " + input.path + " not found");
                return reject(new PipelineErrorModel(err, true));
            }

            // Resolve with unmodified input if the file is readable
            this.logger.info("File " + input.path + " test successful", true);
            return resolve(input);
        });
    };
}

/**
 * Readfile interface
 *
 * @module vscode-phpmd/service/pipeline
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
interface IReadFile {
    (filename: string, encoding: string, callback: (err: NodeJS.ErrnoException, data: string) => void): void;
}

export default TestFileStrategy;
