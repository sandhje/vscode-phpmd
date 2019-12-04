import { IExecuteStrategy } from "@open-sourcerers/j-stillery";
import * as Process from "child_process";
import PipelineErrorModel from "../../model/PipelineErrorModel";
import PipelinePayloadModel from "../../model/PipelinePayloadModel";
import ILogger from "../logger/ILogger";
import NullLogger from "../logger/NullLogger";
import PhpmdService from "../PhpmdService";
import PhpmdCommandBuilder from "../PhpmdCommandBuilder";

/**
 * Execute PHP mess detector pipeline task strategy
 *
 * Strategy used to create the pipeline task responsible for executing
 * the PHP mess detector command.
 *
 * @module vscode-phpmd/service/pipeline
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class ExecuteProcessStrategy implements IExecuteStrategy<PipelinePayloadModel> {
    /**
     * PHP mess detector service
     *
     * @property {PhpmdService} service
     */
    private service: PhpmdService;

    /**
     * Execute process task strategy constructor
     *
     * @param {PhpmdCommandBuilder} commandBuilder CommandBuilder used to instantiate the PHP mess detector service
     * @param {string} rules PHP mess detector rules to be passed as option to the command
     * @param {ILogger} logger Logger, defaults to Null object implementation
     */
    public constructor(
        private commandBuilder: PhpmdCommandBuilder,
        private rules: string,
        private logger: ILogger = new NullLogger()
    ) { }

    /**
     * Strategy executor
     *
     * Resolve with the result from the executed PHP mess detector command.
     *
     * @see IExecuteStrategy::execute
     */
    public execute(
        input: PipelinePayloadModel,
        resolve: (output?: PipelinePayloadModel | PromiseLike<PipelinePayloadModel>) => void,
        reject: (reason: any) => void
    ) {
        this.executeProcess(input.path).then((data) => {
            input.raw = this.ltrimXML(data);

            resolve(input);
        }, (err: Error) => {
            reject(new PipelineErrorModel(err, false));
        });
    };

    /**
     * PHP mess detector service setter
     *
     * Allows overriding of the PHP mess detector service for testing purposes.
     *
     * @param {PhpmdService} service
     */
    public setService(service: PhpmdService) {
        this.service = service;
    }

    /**
     * PHP mess detector service getter
     *
     * Creates an instance of the default PHP mess detector service if no other instance was set before.
     *
     * @returns {PhpmdService}
     */
    protected getService() {
        if (!this.service) {
            this.service = new PhpmdService(this.commandBuilder);
            this.service.setLogger(this.logger);
        }

        return this.service;
    }

    /**
     * Strip any leading text or whitespace before the xml opening tag
     * 
     * @param {string} xml
     * @returns {string}
     */
    protected ltrimXML(xml: string): string {
        return xml.substring(xml.indexOf("<?xml"));
    }

    /**
     * Execute the PHP mess detector command
     *
     * @param {string} path File path to be scanned by the PHP mess detector command
     * @returns {Promise<string>}
     */
    protected executeProcess(path: string): Promise<string> {
        return this.getService().run(`"${path}" xml "${this.rules}"`);
    }
}

export default ExecuteProcessStrategy;
