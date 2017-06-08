# VSCode PHP Mess Detector

[![Build Status](https://travis-ci.org/sandhje/vscode-phpmd.svg?branch=master)](https://travis-ci.org/sandhje/vscode-phpmd)
[![codecov](https://codecov.io/gh/sandhje/vscode-phpmd/branch/master/graph/badge.svg)](https://codecov.io/gh/sandhje/vscode-phpmd)
[![Join the chat at https://gitter.im/sandhje/vscode-phpmd](https://badges.gitter.im/sandhje/vscode-phpmd.svg)](https://gitter.im/sandhje/vscode-phpmd?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Features

* Analyze your PHP source code on save with PHP mess detector
* No additional setup required if PHP is installed on your system
* Customize which PHPMD rules are used
* Supports custom PHPMD ruleset files

## Installation

To install the extension: Press `F1`, type `ext install vscode-phpmd`

### Using the built-in PHP mess detector

To use the built-in PHP mess detector you need to have PHP in your PATH. To test, open a shell or command window and type `php -v`, this should return "PHP x.x.x ...". If PHP is in your PATH you can directly use this extension, no further setup is required.

### Using a custom PHP mess detector

IF you want to customize the default PHP mess detector command, e.g. you have PHP mess detector globally installed through composer or have PHP available on a different location, you can customize the command with the `command` setting. 

## Configuration

The following configuration options are available:

### `phpmd.command`: 
Customize the PHP mess detector command. If left empty the built-in PHPMD PHAR archive will be executed and PHP needs to be available on your PATH. If you want to use a different PHPMD PHAR you can customize the command here. 

#### Examples:
To use PHPMD installed globally with composer on a windows machine set this setting to: 
```
"phpmd.command": "C:/Users/{USER}/AppData/Roaming/Composer/vendor/bin/phpmd.bat"
```

Or to use your own PHPMD PHAR on a custom location: 
```
"phpmd.command": "php C:/path/to/phpmd.phar"`
```

### `phpmd.rules`: 

Customize the PHPMD ruleset files used. This option can also take the path to a custom [PHPMD ruleset file](https://phpmd.org/documentation/creating-a-ruleset.html). Use VS Code's workspace settings to control the rules or ruleset files per workspace. Refer to [PHPMD's documentation](https://phpmd.org/documentation/index.html) for more information on the ruleset parameter.

#### Examples:
To use only the cleancode ruleset and skip all the others: 
```
"phpmd.rules": "cleancode"
```

Pass a comma seperated list of rulesets: 
```
"phpmd.rules": "cleancode,codesize"
```

Pass the path to a ruleset file: 
```
"phpmd.rules": "C:/path/to/phpmd_config.xml"
```

### `phpmd.verbose`: 
Turn verbose logging on or off. All log entries can be viewed VS Code's output panel. Generally this can be turned off (default) unless you need to troubleshoot problems.

#### Examples:
To enable verbose logging: 
```
"phpmd.verbose": true
```

## Troubleshooting
* Turn on verbose logging through settings and check output
* Ask a question on [gitter](https://gitter.im/sandhje/vscode-phpmd)
* Found a bug? [file an issue](https://github.com/sandhje/vscode-phpmd/issues) (include the logs)