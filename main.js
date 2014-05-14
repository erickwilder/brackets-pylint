/*jslint vars: true, nomen: true, indent: 4*/
/*global define, brackets, console, $*/
define(function (require, exports, module) {
    "use strict";
    
    var _ = brackets.getModule('thirdparty/lodash'),
        CodeInspection = brackets.getModule('language/CodeInspection'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        NodeDomain = brackets.getModule('utils/NodeDomain');
    
    var PylintTypes = {
        refactor: CodeInspection.Type.META,
        convention: CodeInspection.Type.META,
        error: CodeInspection.Type.ERROR,
        fatal: CodeInspection.Type.ERROR,
        warning: CodeInspection.Type.WARNING
    };
    
    var pylintDomain = new NodeDomain('bracketsPylint', ExtensionUtils.getModulePath(module, 'node/PylintDomain')),
        runSettings = {
            pylintPath: '/usr/local/bin/pylint', // TODO: Write a dynamic finding util
            rcfilePath: '~/.pylintrc',  // TODO: Support per-project rcfiles
            filePath: null
        };
    
    function parseResult(data) {
        console.log('Will parse data...', data);
        /*jslint regexp: true*/
        var lines = _.filter(data || [], function (line) {
            return (/\b\d+:\d+:[a-z]+:.+$/).test(line);
        });
        /*jslint regexp: false*/
        
        console.log('Filtered lines', lines);
        
        var errors = _.map(lines || [], function (line) {
                // pylint format = {line}:{column}:{category}:{msg}
                var pieces = line.split(':');
                return {
                    pos: {line: _.parseInt(pieces[0]), ch: _.parseInt(pieces[1])},
                    type: PylintTypes[pieces[2]],
                    message: pieces[3]
                };
            });
        if (errors.length) {
            return {errors: errors};
        }
        return null;
    }
    
    function handleLinterAsync(text, filePath) {
        var deferred = $.Deferred(),
            config = _.defaults({filePath: filePath}, runSettings);
        pylintDomain.exec('run', config)
            .done(function (pylintResult) {
                deferred.resolve(parseResult(pylintResult));
            });
        return deferred.promise();
    }
    
    // Register a new async linter to `python` language
    CodeInspection.register('python', {
        name: 'Pylint',
        scanFileAsync: handleLinterAsync
    });
});