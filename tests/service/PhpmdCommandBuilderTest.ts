import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import PhpmdCommandBuilder from "../../server/service/PhpmdCommandBuilder";

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
}