import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver";
import PipelinePayloadModel from "../../../server/model/PipelinePayloadModel";
import { IPmd, IPmdFileData, IPmdFileMetaData, IPmdViolation, IPmdViolationMetaData } from "../../../server/model/pmd";
import BuildDiagnosticsStrategy from "../../../server/service/pipeline/BuildDiagnosticsStrategy";

@suite("BuildDiagnostics strategy")
class BuildDiagnosticsStrategyTest {

    @test("Should resolve with an array of diagnostic instances")
    public assertResolveDiagnostics(done) {
        // Arrange
        // =======
        // Fake resolve callback
        let resolve = (output: PipelinePayloadModel) => {
            // Assert
            // ======
            expect(output.diagnostics.length).to.equal(1);
            expect(output.diagnostics[0].message).to.equal("Test message");
            expect(output.diagnostics[0].range.start.line).to.equal(0);
            expect(output.diagnostics[0].range.start.character).to.equal(0);
            expect(output.diagnostics[0].range.end.line).to.equal(0);
            expect(output.diagnostics[0].range.end.character).to.equal(Number.MAX_VALUE);
            expect(output.diagnostics[0].severity).to.equal(DiagnosticSeverity.Error);
            expect(output.diagnostics[0].source).to.equal("PHP Mess Detector");
            done();
        };

        // Fake reject callback
        let reject = (reason: any) => {
            // Nothing to do here, test will fail because of absence of done
        };

        // Fake input
        let input = <PipelinePayloadModel> {};
        input.pmd = <IPmd> {};
        input.pmd.file = <IPmdFileData[]> [];
        input.pmd.file[0] = <IPmdFileData> {};
        input.pmd.file[0].$ = <IPmdFileMetaData> {};
        input.pmd.file[0].$.name = "Test.php";
        input.pmd.file[0].violation = <IPmdViolation[]> [];
        input.pmd.file[0].violation[0] = <IPmdViolation> {};
        input.pmd.file[0].violation[0]._ = "Test message";
        input.pmd.file[0].violation[0].$ = <IPmdViolationMetaData> {};
        input.pmd.file[0].violation[0].$.beginline = "1";
        input.pmd.file[0].violation[0].$.class = "TestClass";
        input.pmd.file[0].violation[0].$.endline = "11";
        input.pmd.file[0].violation[0].$.externalInfoUrl = "http://test.com/test";
        input.pmd.file[0].violation[0].$.package = "TestPackage";
        input.pmd.file[0].violation[0].$.priority = "1";
        input.pmd.file[0].violation[0].$.rule = "TestRule";
        input.pmd.file[0].violation[0].$.ruleset = "TestRuleSet";
        input.diagnostics = <Diagnostic[]> [];

        // Create and configure strategy instance
        let strategy = new BuildDiagnosticsStrategy();

        // Act
        strategy.execute(input, resolve, reject);
    }

    @test("Should resolve without diagnostics if pmd empty")
    public assertResolveWithoutPmd(done) {
        // Arrange
        // =======
        // Fake resolve callback
        let resolve = (output: PipelinePayloadModel) => {
            // Assert
            // ======
            expect(output.diagnostics.length).to.equal(0);
            done();
        };

        // Fake reject callback
        let reject = (reason: any) => {
            // Nothing to do here, test will fail because of absence of done
        };

        // Fake input
        let input = <PipelinePayloadModel> {};
        input.pmd = null;
        input.diagnostics = <Diagnostic[]> [];

        // Create and configure factory instance
        let strategy = new BuildDiagnosticsStrategy();

        // Act
        strategy.execute(input, resolve, reject);
    }
}
