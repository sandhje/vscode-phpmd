import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "@testdeck/mocha";
import * as sinon from "sinon";
import PhpmdCommandBuilder from "../../server/service/PhpmdCommandBuilder";
import { URI } from "vscode-uri";
import { WorkspaceFolder } from "vscode-languageserver";

@suite("PhpMD Command Builder")
class PhpmdCommandBuilderTest {

    @test("Should return true if using global php")
    public assertUsingGlobalPhp() {
        // Arrange
        const command = "php /path/to/phpmd.phar";
        const workspaceFolders = [];
        const homeDir = "";

        // Act
        const commandBuilder = new PhpmdCommandBuilder(command, workspaceFolders, homeDir);

        // Assert
        expect(commandBuilder.usingGlobalPhp()).to.be.true;
    }

    @test("Should return false if not using global php")
    public assertNotUsingGlobalPhp() {
        // Arrange
        const command = "/path/to/php /path/to/phpmd.phar";
        const workspaceFolders = [];
        const homeDir = "";

        // Act
        const commandBuilder = new PhpmdCommandBuilder(command, workspaceFolders, homeDir);

        // Assert
        expect(commandBuilder.usingGlobalPhp()).to.be.false;
    }

    @test("Should build phpmd version command")
    public assertBuildVersionCommand() {
        // Arrange
        const command = "php /path/to/phpmd.phar";
        const workspaceFolders = [];
        const homeDir = "";

        // Act
        const commandBuilder = new PhpmdCommandBuilder(command, workspaceFolders, homeDir);

        // Assert
        expect(commandBuilder.buildPhpmdVersionCommand()).to.equal("php /path/to/phpmd.phar --version");
    }

    @test("Should build phpmd command")
    public assertBuildPhpMDCommand() {
        // Arrange
        const command = "php /path/to/phpmd.phar";
        const workspaceFolders = [];
        const homeDir = "";
        const options = `"/path/to/file.php" xml "cleancode,codesize,controversial,design,unusedcode,naming"`;

        // Act
        const commandBuilder = new PhpmdCommandBuilder(command, workspaceFolders, homeDir);

        // Assert
        expect(commandBuilder.buildPhpmdCommand(options))
            .to.equal(`php /path/to/phpmd.phar "/path/to/file.php" xml "cleancode,codesize,controversial,design,unusedcode,naming"`);
    }

    @test("Should replace unix homedir and build phpmd command")
    public assertUnixHomeBuildPhpMDCommand() {
        // Arrange
        const command = "php /path/to/phpmd.phar";
        const workspaceFolders = [];
        const homeDir = "/home";
        const options = `"/path/to/file.php" xml "~/phpmd.xml"`;

        // Act
        const commandBuilder = new PhpmdCommandBuilder(command, workspaceFolders, homeDir);

        // Assert
        expect(commandBuilder.buildPhpmdCommand(options))
            .to.equal(`php /path/to/phpmd.phar "/path/to/file.php" xml "/home/phpmd.xml"`);
    }

    @test("Should replace windows homedir and build phpmd command")
    public assertWindowsHomeBuildPhpMDCommand() {
        // Arrange
        const command = "php /path/to/phpmd.phar";
        const workspaceFolders = [];
        const homeDir = "C:\\Users\\Test";
        const options = `"/path/to/file.php" xml "~\\phpmd.xml"`;

        // Act
        const commandBuilder = new PhpmdCommandBuilder(command, workspaceFolders, homeDir);

        // Assert
        expect(commandBuilder.buildPhpmdCommand(options))
            .to.equal(`php /path/to/phpmd.phar "/path/to/file.php" xml "C:\\Users\\Test\\phpmd.xml"`);
    }

    @test("Should replace workspace folder and build phpmd command")
    public assertWorkspaceFolderBuildPhpMDCommand() {
        // Arrange
        const command = "php /path/to/phpmd.phar";
        const workspaceFolders: WorkspaceFolder[] = [
            { name: "nomatch", uri: "file:///no/match/to/test" },
            { name: "test", uri: "file:///path/to/test" },
        ];
        const homeDir = "/home";
        const options = `"${URI.parse("/path/to/test/file.php").fsPath}" xml "$\{workspaceFolder\}/phpmd.xml"`;
        
        // Act
        const commandBuilder = new PhpmdCommandBuilder(command, workspaceFolders, homeDir);
        
        // Assert
        expect(commandBuilder.buildPhpmdCommand(options))
            .to.equal(`php /path/to/phpmd.phar "${URI.parse("/path/to/test/file.php").fsPath}" xml "${URI.parse("file:///path/to/test").fsPath}/phpmd.xml"`);
    }

    @test("Should default to first workspace folder if no match found and build phpmd command")
    public assertDefaultWorkspaceFolderBuildPhpMDCommand() {
        // Arrange
        const command = "php /path/to/phpmd.phar";
        const workspaceFolders: WorkspaceFolder[] = [
            { name: "nomatch", uri: "file:///no/match/to/test" },
            { name: "test", uri: "file:///path/to/test" },
        ];
        const homeDir = "/home";
        const options = `"${URI.parse("/not/path/to/test/file.php").fsPath}" xml "$\{workspaceFolder\}/phpmd.xml"`;
        
        // Act
        const commandBuilder = new PhpmdCommandBuilder(command, workspaceFolders, homeDir);
        
        // Assert
        expect(commandBuilder.buildPhpmdCommand(options))
            .to.equal(`php /path/to/phpmd.phar "${URI.parse("/not/path/to/test/file.php").fsPath}" xml "${URI.parse("file:///no/match/to/test").fsPath}/phpmd.xml"`);
    }
}