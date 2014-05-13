/*jslint vars: true, nomen: true, indent: 4*/
/*global define, brackets, console, $*/
define(function (require, exports, module) {
    "use strict";
    
    var AppInit = brackets.getModule('utils/AppInit'),
        CodeInspection = brackets.getModule('language/CodeInspection'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        NodeDomain = brackets.getModule('utils/NodeDomain');
    
    var NAMESPACE = 'pylinterDomain';
    
    AppInit.appReady(function () {
        var pylintDomain = new NodeDomain(NAMESPACE, ExtensionUtils.getModulePath(module, 'node/Pylint'));
        
        $(pylintDomain).on(NAMESPACE + '.linted', function (event, output) {
            console.log("Pylint result = " + output);
        });
        
        function pylinter(text, filePath) {
            pylintDomain.exec('runPylint', filePath);
        }
        
        CodeInspection.register('python', {
            "name": "Pylinter",
            scanFile: pylinter
        });
    });
});