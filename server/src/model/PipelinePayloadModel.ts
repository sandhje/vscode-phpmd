import { Diagnostic } from "vscode-languageserver";
import Uri from "vscode-uri";
import { IPmd } from "./pmd";

class PipelinePayloadModel {
    public uri: string = "";

    public get path(): string {
        return Uri.parse(this.uri).fsPath;
    }

    public raw: string = "";

    public pmd: IPmd;

    public diagnostics: Diagnostic[] = [];

    public constructor(uri: string) {
        this.uri = uri;
    }
}

export default PipelinePayloadModel;
