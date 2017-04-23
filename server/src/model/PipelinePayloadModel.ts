import Uri from 'vscode-uri';
import { Diagnostic } from 'vscode-languageserver';
import { Pmd } from './pmd';

class PipelinePayloadModel
{
    public uri: string = "";

    public get path(): string {
        return Uri.parse(this.uri).fsPath;
    }

    public raw: string = "";

    public pmd: Pmd;

    public diagnostics: Array<Diagnostic> = [];

    public constructor(uri: string) {
        this.uri = uri;
    }
}

export default PipelinePayloadModel;