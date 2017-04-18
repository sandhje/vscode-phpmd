import PipelinePayloadModel from '../../model/PipelinePayloadModel';
import { IExecuteStrategy } from '@open-sourcerers/j-stillery';
import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver';

class BuildDiagnosticsStrategy implements IExecuteStrategy<PipelinePayloadModel>
{
    public execute(
        input: PipelinePayloadModel, 
        resolve: (output?: PipelinePayloadModel | PromiseLike<PipelinePayloadModel>) => void, 
        reject: (reason: any) => void
    ) {
        input.diagnostics = this.getDiagnosticts(input.uri, input.parsed.pmd.file[0].violation);

        resolve(input);
    } void;

    getDiagnosticts(uri: string, problems: Array<any>): Array<Diagnostic> {
        let diagnostics: Diagnostic[] = [];
        
        problems.forEach((problem) => {
            let line = parseInt(problem.$.beginline, 10) - 1; // get line
            let index = 0; // get character
            let length = 10; // get length
            let message = "Mess detection: " + problem._; // get message

            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range: {
                    start: { line: line, character: index},
                    end: { line: line, character: index + length }
                },
                message: message,
                source: 'PHP Mess Detector'
            });
        });	
        
        return diagnostics;
    }
}

export default BuildDiagnosticsStrategy;