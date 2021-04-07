import { IExecuteStrategy } from "@open-sourcerers/j-stillery";
import { Parser } from "xml2js";
import PipelinePayloadModel from "../../model/PipelinePayloadModel";
import ILogger from "../logger/ILogger";
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
     * @param {ILogger} logger
     */
    public constructor(
        private parser: Parser,
        private logger: ILogger
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
        this.parser.parseString(this.escapeInput(input), (error, result) => {
            if (error) {
                this.logger.log(`Unable to parse result xml. ${error}`);
            }

            if (!result) {
                result = { pmd: null };
            }

            input.pmd = <IPmd> result.pmd;

            resolve(input);
        });
    };

    private escapeInput(input: PipelinePayloadModel): string {
        const escapedPath = input.path.replace(/[<>&'"]/g, function (c) {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
        });

        if (escapedPath !== input.path) {
            this.logger.info(`Escaping path in phpmd output xml to prevent parsing errors. Replacing ${input.path} with ${escapedPath}`, true);

            const trimmedPath = /^[a-zA-Z]:/.test(input.path) ? input.path.substr(2) : input.path;
            const trimmedEscapedPath = /^[a-zA-Z]:/.test(escapedPath) ? escapedPath.substr(2) : escapedPath;

            return input.raw.replace(trimmedPath, trimmedEscapedPath);
        }

        return input.raw;
    }
}

export default ParseStrategy;
