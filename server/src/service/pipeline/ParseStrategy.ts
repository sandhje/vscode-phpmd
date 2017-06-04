import { IExecuteStrategy } from "@open-sourcerers/j-stillery";
import { Parser } from "xml2js";
import PipelinePayloadModel from "../../model/PipelinePayloadModel";
import { IPmd } from "../../model/pmd";

/**
 * Parse pipeline task strategy
 *
 * Strategy used to create the pipeline task responsible for parsing
 * the PHP mess detector result.
 *
 * @module vscode-phpmd/service/pipeline
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class ParseStrategy implements IExecuteStrategy<PipelinePayloadModel> {
    /**
     * Parse task strategy constructor
     *
     * @param {Parser} parser
     */
    public constructor(
        private parser: Parser
    ) { }

    /**
     * Strategy executor
     *
     * Resolve with the parse PHP mess detector result.
     *
     * @see IExecuteStrategy::execute
     */
    public execute(
        input: PipelinePayloadModel,
        resolve: (output?: PipelinePayloadModel | PromiseLike<PipelinePayloadModel>) => void,
        reject: (reason: any) => void
    ) {
        this.parser.parseString(input.raw, (error, result) => {
            if (!result) {
                result = { pmd: null };
            }

            input.pmd = <IPmd> result.pmd;

            resolve(input);
        });
    };
}

export default ParseStrategy;
