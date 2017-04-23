import PipelinePayloadModel from '../../model/PipelinePayloadModel';
import { IExecuteStrategy } from '@open-sourcerers/j-stillery';
import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver';
import { Pmd, PmdViolation } from '../../model/pmd';

class BuildDiagnosticsStrategy implements IExecuteStrategy<PipelinePayloadModel>
{
    public execute(
        input: PipelinePayloadModel, 
        resolve: (output?: PipelinePayloadModel | PromiseLike<PipelinePayloadModel>) => void, 
        reject: (reason: any) => void
    ) {
        let pmd = <Pmd> input.pmd;

        if (pmd === null) {
            // If no pmd results found, resolve without diagnostics
            resolve(input);
        }

        // For all files in Pmd result
        // Get diagnostics and append to payload
        pmd.file.every((file) => {
            input.diagnostics = input.diagnostics.concat(this.getDiagnosticts(file.$.name, this.getProblems(pmd)));

            return true;
        });

        resolve(input);
    } void;

    getProblems(pmd: Pmd): Array<PmdViolation>
    {
        return pmd.file[0].violation || [];
    }

    getDiagnosticts(filename: string, problems: Array<PmdViolation>): Array<Diagnostic> {
        let diagnostics: Diagnostic[] = [];
        
        problems.forEach((problem) => {
            try {
                let diagnostic = this.getDiagnostic(problem);

                if (diagnostic !== null) {
                    diagnostics.push(diagnostic);
                }
            } catch (e) {
                // TODO: Log get diagnostic error
            }
        });	
        
        return diagnostics;
    }

    getDiagnostic(problem: any): Diagnostic {
        try {
            let line = this.getLine(problem);
            let index = this.getIndex(problem);
            let length = this.getLength(problem);

            let hash = this.createProblemHash(problem);
            if (hash !== null && this.alreadyReported(hash)) {
                return null;
            }

            this.report(hash);
            return {
                severity: this.getSeverity(problem),
                range: {
                    start: { line: line, character: index},
                    end: { line: line, character: index + length }
                },
                message: this.getMessage(problem),
                source: this.getSource(problem)
            };
        } catch (e) {
            throw new Error("Unable to create diagnostic (" + e.message + ")");
        }
    }

    reported: Array<string> = [];

    report(hash: string): void {
        this.reported.push(hash);
    }

    alreadyReported(hash: string): boolean {
        return this.reported.indexOf(hash) >= 0
    }

    createProblemHash(problem: any): string {
        let ruleset = problem.$.ruleset || null;
        let rule = problem.$.rule || null;
        let line = problem.$.beginline || null;

        let str = ruleset + "-" + rule + "-" + line;

        let hash = 0;
        if (str.length == 0) {
            return null;
        }

        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }

        return hash.toString();
    }

    getLine(problem: any): number {
        let beginline = problem.$.beginline || null;

        if (beginline === null) {
            throw new Error("Unable to find problem begin line");
        }

        return parseInt(beginline, 10) - 1;
    }

    getIndex(problem: any): number {
        return 0;
    }

    getLength(problem: any): number {
        return Number.MAX_VALUE;
    }

    getMessage(problem: any): string {
        let message = problem._ || null;

        if (message === null) {
            throw new Error("Unable to find problem message");
        }

        return message;
    }

    getSource(problem: any): string {
        return "PHP Mess Detector";
    }

    // TODO: construct form options
    severityMap: Array<DiagnosticSeverity> = [
        DiagnosticSeverity.Error,
        DiagnosticSeverity.Warning,
        DiagnosticSeverity.Information,
        DiagnosticSeverity.Hint,
        DiagnosticSeverity.Hint
    ];

    getSeverity(problem: any): DiagnosticSeverity {
        let priority: number = parseInt(problem.$.priority, 10) || 100;

        let severity = this.severityMap[priority - 1] || DiagnosticSeverity.Hint;

        return severity;
    }
}

export default BuildDiagnosticsStrategy;