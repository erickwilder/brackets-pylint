/*jslint vars: true, nomen: true, indent: 4*/
/*global define, brackets, console, $*/
define(function (require, exports, module) {
    "use strict";
    
    var CodeInspection = brackets.getModule('language/CodeInspection'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        NodeDomain = brackets.getModule('utils/NodeDomain');
    
    var pylintDomain = new NodeDomain('bracketsPylint', ExtensionUtils.getModulePath(module, 'node/PylintDomain'));
    
    function handleLinterAsync(text, filePath) {
        var deferred = $.Deferred();
        pylintDomain.exec('run', filePath)
            .done(function (pylintResult) {
                var result = { errors: [] };
                pylintResult.forEach(function (lintData) {
                    result.errors.push({
                        pos: {line: lintData.line, ch: lintData.col},
                        message: lintData.msg,
                        type: lintData.cat
                    });
                });
                deferred.resolve(result);
            });
        return deferred.promise();
    }
    
    // Register a new async linter to `python` language
    CodeInspection.register('python', {
        name: 'BracketsPylint',
        scanFileAsync: handleLinterAsync
    });
});