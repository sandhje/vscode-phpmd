import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "@testdeck/mocha";
import * as sinon from "sinon";
import { URI } from "vscode-uri";
import PipelinePayloadModel from "../../server/model/PipelinePayloadModel";

@suite("Pipeline payload model")
class PipelinePayloadModelTest {

    @test("Get path from uri")
    public assertPath() {
        // Arrange
        // =======
        // Fake uri
        let uri = "file:///c%3A/Projects/Untitled-2.php";

        // Model
        let model = new PipelinePayloadModel(uri);

        // Act
        let path = model.path;

        // Assert
        expect(path).to.equal(URI.parse(uri).fsPath);
    }
}
