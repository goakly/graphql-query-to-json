"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphQlQueryToJson = exports.isObject = exports.isArray = exports.isString = exports.flatMap = void 0;
var graphql_1 = require("graphql");
var json_to_graphql_query_1 = require("json-to-graphql-query");
var mapValues = require("lodash.mapvalues");
var undefinedVariableConst = "undefined_variable";
var isVariableDropinConst = "_____isVariableDropinConst";
exports.flatMap = function (arg, callback) {
    return arg.reduce(function (callbackFn, initialValue) { return callbackFn.concat(callback(initialValue)); }, []);
};
exports.isString = function (arg) { return typeof arg === "string"; };
exports.isArray = Array.isArray;
exports.isObject = function (arg) { return arg instanceof Object; };
var getArgumentObject = function (argumentFields) {
    var argObj = {};
    argumentFields.forEach(function (arg) {
        if (arg.value.kind === "ObjectValue") {
            argObj[arg.name.value] = getArgumentObject(arg.value.fields);
        }
        else if (arg.value.kind === "ListValue") {
            argObj[arg.name.value] = arg.value.values;
        }
        else if (arg.value.kind === "IntValue") {
            argObj[arg.name.value] = parseInt(arg.value.value);
        }
        else if (arg.value.kind === "Variable") {
            argObj[arg.name.value] = "" + arg.value.name.value + isVariableDropinConst;
        }
        else {
            argObj[arg.name.value] = arg.value.value;
        }
    });
    return argObj;
};
var getArguments = function (args) {
    var argsObj = {};
    args.forEach(function (arg) {
        if (arg.value.kind === "ObjectValue") {
            argsObj[arg.name.value] = getArgumentObject(arg.value.fields);
        }
        else if (arg.value.kind === "Variable") {
            argsObj[arg.name.value] = "" + arg.value.name.value + isVariableDropinConst;
        }
        else if (arg.selectionSet) {
            argsObj[arg.name.value] = getSelections(arg.selectionSet.selections);
        }
        else if (arg.value.kind === "EnumValue") {
            argsObj[arg.name.value] = new json_to_graphql_query_1.EnumType(arg.value.value);
        }
        else if (arg.value.kind === "IntValue") {
            argsObj[arg.name.value] = parseInt(arg.value.value);
        }
        else if (arg.value.kind === "ListValue") {
            var values = exports.flatMap(arg.value.values, function (element) { return element.value; });
            argsObj[arg.name.value] = values;
        }
        else {
            argsObj[arg.name.value] = arg.value.value;
        }
    });
    return argsObj;
};
var getSelections = function (selections) {
    var selObj = {};
    selections.forEach(function (selection) {
        var selectionHasAlias = selection.alias;
        var selectionName = selectionHasAlias
            ? selection.alias.value
            : selection.name.value;
        if (selection.selectionSet) {
            selObj[selectionName] = getSelections(selection.selectionSet.selections);
            if (selectionHasAlias) {
                selObj[selection.alias.value].__aliasFor = selection.name.value;
            }
        }
        if (!selection.selectionSet && selection.arguments.length) {
            selObj[selectionName] = true;
        }
        else if (selection.arguments.length > 0) {
            selObj[selectionName].__args = getArguments(selection.arguments);
        }
        if (!selection.selectionSet && !selection.arguments.length) {
            selObj[selectionName] = true;
        }
    });
    return selObj;
};
var checkEachVariableInQueryIsDefined = function (defintion, variables) {
    var varsList = defintion.variableDefinitions.reduce(function (prev, curr) {
        return __spreadArrays(prev, [
            {
                key: curr.variable.name.value,
                value: undefinedVariableConst,
            },
        ]);
    }, []);
    Object.entries(variables).forEach(function (_a) {
        var variableKey = _a[0], variableValue = _a[1];
        var idx = varsList.findIndex(function (element) {
            return element.key === variableKey;
        });
        if (idx !== -1) {
            varsList[idx].value = variableValue;
        }
    });
    var undefinedVariable = varsList.find(function (varInQuery) {
        return varInQuery.value === undefinedVariableConst;
    });
    if (undefinedVariable) {
        throw new Error("The query you want to parse is using variables. This means that you have to supply for every variable that is used in the query a corresponding value. You can parse these values as a second parameter on the options object, on the \"variables\" key.");
    }
    return varsList;
};
var replaceVariables = function (obj, variables) {
    return mapValues(obj, function (value) {
        if (exports.isString(value) &&
            new RegExp(isVariableDropinConst + "$").test(value)) {
            var variableName = value.replace(isVariableDropinConst, "");
            return variables[variableName];
        }
        else if (exports.isObject(value) && !exports.isArray(value)) {
            return replaceVariables(value, variables);
        }
        else {
            return value;
        }
    });
};
exports.graphQlQueryToJson = function (query, options) {
    if (options === void 0) { options = {
        variables: {},
    }; }
    var jsonObject = {};
    var parsedQuery = graphql_1.parse(query);
    if (parsedQuery.definitions.length > 1) {
        throw new Error("The parsed query has more than one set of definitions");
    }
    // @ts-ignore
    var firstDefinition = parsedQuery.definitions[0];
    var operation = firstDefinition.operation;
    checkEachVariableInQueryIsDefined(firstDefinition, options.variables);
    var selections = getSelections(firstDefinition.selectionSet.selections);
    jsonObject[operation] = selections;
    var varsReplacedWithValues = replaceVariables(jsonObject, options.variables);
    return varsReplacedWithValues;
};
//# sourceMappingURL=index.js.map