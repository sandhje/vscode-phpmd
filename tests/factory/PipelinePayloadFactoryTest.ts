import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import PipelinePayloadFactory from "../../server/factory/PipelinePayloadFactory";
import PipelinePayloadModel from "../../server/model/PipelinePayloadModel";

@suite("PipelinePayload factory")
class PipelineFactoryTest {

    @test("Should create PipelinePayload instance")
    public assertCreate() {
        // Arrange
        // =======
        // Fake settings
        let uri = "Test";

        // Create and configure factory instance
        let factory = new PipelinePayloadFactory(uri);

        // Act
        let pipelinePayload = factory.create();

        // Assert
        expect(pipelinePayload).to.be.instanceof(PipelinePayloadModel);
        expect(pipelinePayload.uri).to.equal(uri);
    }

    @test("Should update uri on setter")
    public assertSetUri() {
        // Arrange
        // =======
        // Fake settings
        let uri = "Test1";
        let uri2 = "Test2";

        // Create and configure factory instance
        let factory = new PipelinePayloadFactory(uri);
        factory.setUri(uri2);

        // Act
        let pipelinePayload = factory.create();

        // Assert
        expect(pipelinePayload).to.be.instanceof(PipelinePayloadModel);
        expect(pipelinePayload.uri).to.equal(uri2);
    }
}
