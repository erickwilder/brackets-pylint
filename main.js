/*jslint vars: true, nomen: true, indent: 4*/
/*global define, brackets, console*/
define(function (require, exports, module) {
    "use strict";
    
    var AppInit = brackets.getModule('utils/AppInit'),
        CodeInspection = brackets.getModule('language/CodeInspection'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        DocumentManager = brackets.getModule('document/DocumentManager'),
        FileSystem = brackets.getModule('filesystem/FileSystem'),
        NodeDomain = brackets.getModule('utils/NodeDomain'),
        ProjectManager = brackets.getModule('project/ProjectManager');
    
    var PYLINTRC_FILENAME = 'pylintrc';
    var pylintDomain = new NodeDomain('pylint', ExtensionUtils.getModulePath(module, 'node/Pylint'));
    
    function displayResults(output) {
        console.log("Pylint result = " + output);
    }
    
    function pylinter(text, filePath) {
        pylintDomain.exec('runPylint', filePath).always(displayResults);
    }
    
    /*TODO: Add mutiple rcfiles lookup*/
    function _locateConfig() {
        return ProjectManager.getProjectRoot() + PYLINTRC_FILENAME;
    }

    CodeInspection.register('python', {
        "name": "Pylinter",
        scanFile: pylinter
    });
});