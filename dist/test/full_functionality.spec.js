"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var json_to_graphql_query_1 = require("json-to-graphql-query");
describe("Queries", function () {
    it("Test", function () {
        var query = "\n        query {\n            feedback {\n              nodes {\n                id\n                timezone\n                weee:fieldValue(fieldId: \"test\")\n              }\n            }\n          }\n        ";
        expect(index_1.graphQlQueryToJson(query)).toEqual({
            query: {
                feedback: {
                    nodes: {
                        id: true,
                        timezone: true,
                        weee: true
                    }
                }
            },
        });
    });
    it("Single property", function () {
        var query = "\n            query {\n                viewer {\n                    theOnlyPropertyIWant\n                }\n                other {\n                    anotherOne\n                }\n            }\n        ";
        expect(index_1.graphQlQueryToJson(query)).toEqual({
            query: {
                viewer: {
                    theOnlyPropertyIWant: true,
                },
                other: {
                    anotherOne: true,
                },
            },
        });
    });
    it("Two properties", function () {
        var query = "\n            query {\n                viewer {\n                    propertyOne\n                    propertyTwo\n                }\n            }\n        ";
        expect(index_1.graphQlQueryToJson(query)).toEqual({
            query: {
                viewer: {
                    propertyOne: true,
                    propertyTwo: true,
                },
            },
        });
    });
    it("Two properties separated by commas", function () {
        var query = "\n            query {\n                viewer {\n                    propertyOne,\n                    propertyTwo\n                }\n            }\n        ";
        expect(index_1.graphQlQueryToJson(query)).toEqual({
            query: {
                viewer: {
                    propertyOne: true,
                    propertyTwo: true,
                },
            },
        });
    });
    it("Nested simple query using commas", function () {
        var query = "\n            query {\n                viewer {\n                    propertyOne,\n                    propertyTwo\n                }\n                nested {\n                    evenDeeper {\n                        nestedOne,\n                        nestedTwo,\n                        nestedThree\n                    }\n                }\n            }\n        ";
        expect(index_1.graphQlQueryToJson(query)).toEqual({
            query: {
                viewer: {
                    propertyOne: true,
                    propertyTwo: true,
                },
                nested: {
                    evenDeeper: {
                        nestedOne: true,
                        nestedTwo: true,
                        nestedThree: true,
                    },
                },
            },
        });
    });
    it("Nested simple query using commas with custom query name", function () {
        var query = "\n            query GetThatStuff {\n                viewer {\n                    propertyOne,\n                    propertyTwo\n                }\n                nested {\n                    evenDeeper {\n                        nestedOne,\n                        nestedTwo,\n                        nestedThree\n                    }\n                }\n            }\n        ";
        expect(index_1.graphQlQueryToJson(query)).toEqual({
            query: {
                viewer: {
                    propertyOne: true,
                    propertyTwo: true,
                },
                nested: {
                    evenDeeper: {
                        nestedOne: true,
                        nestedTwo: true,
                        nestedThree: true,
                    },
                },
            },
        });
    });
    it("Simple query using variables", function () {
        var query = "\n        query GetThisStuff($name: String, $lastName: String) {\n            viewer {\n                personal(criteria: {\n                    name: $name,\n                    lastName: $lastName\n                }) {\n                    name\n                    address\n                }\n            }\n        }\n        ";
        var result = index_1.graphQlQueryToJson(query, {
            variables: {
                name: "PETER",
                lastName: "SCHMIDT",
            },
        });
        expect(result).toEqual({
            query: {
                viewer: {
                    personal: {
                        __args: {
                            criteria: {
                                name: "PETER",
                                lastName: "SCHMIDT",
                            },
                        },
                        name: true,
                        address: true,
                    },
                },
            },
        });
    });
});
describe("Mutations", function () {
    it("Emtpy properties", function () {
        var mutation = "\n            mutation {\n                getPersonalStuff (info: {\n                    emptyString: \"\",\n                    emptyObject: {},\n                    emptyArray: [],\n                }) {\n                    personal\n                }\n            }\n        ";
        expect(index_1.graphQlQueryToJson(mutation)).toEqual({
            mutation: {
                getPersonalStuff: {
                    personal: true,
                    __args: {
                        info: {
                            emptyString: "",
                            emptyObject: {},
                            emptyArray: [],
                        },
                    },
                },
            },
        });
    });
    it("Simple mutation using string argument with sibling queries", function () {
        var mutation = "\n        mutation {\n            getPersonalStuff(name: \"PETER\") {\n                personal {\n                    name\n                    address\n                }\n                other {\n                    parents\n                }\n            }\n        }\n        ";
        expect(index_1.graphQlQueryToJson(mutation)).toEqual({
            mutation: {
                getPersonalStuff: {
                    __args: {
                        name: "PETER",
                    },
                    personal: {
                        name: true,
                        address: true,
                    },
                    other: {
                        parents: true,
                    },
                },
            },
        });
    });
    it("Simple mutation using multiple string arguments with sibling queries", function () {
        var mutation = "\n        mutation {\n            getPersonalStuff(name: \"AMADEUS\", lastName: \"MOZART\") {\n                personal {\n                    name\n                    address\n                }\n                other {\n                    parents\n                }\n            }\n        }\n        ";
        expect(index_1.graphQlQueryToJson(mutation)).toEqual({
            mutation: {
                getPersonalStuff: {
                    __args: {
                        name: "AMADEUS",
                        lastName: "MOZART",
                    },
                    personal: {
                        name: true,
                        address: true,
                    },
                    other: {
                        parents: true,
                    },
                },
            },
        });
    });
    it("Arguments wrapped in object", function () {
        var mutation = "\n        mutation {\n            getPersonalStuff(input: {\n                name: \"HANNES\",\n                lastName: \"RUDOLF\"\n            }) {\n                personal {\n                    name\n                    address\n                }\n                other {\n                    parents\n                }\n            }\n        }\n        ";
        expect(index_1.graphQlQueryToJson(mutation)).toEqual({
            mutation: {
                getPersonalStuff: {
                    __args: {
                        input: {
                            name: "HANNES",
                            lastName: "RUDOLF",
                        },
                    },
                    personal: {
                        name: true,
                        address: true,
                    },
                    other: {
                        parents: true,
                    },
                },
            },
        });
    });
    it("Arguments wrapped in object using an int value", function () {
        var mutation = "\n        mutation {\n            getPersonalStuff(input: {\n                count: 1000,\n            }) {\n                personal {\n                    name\n                    address\n                }\n                other {\n                    parents\n                }\n            }\n        }\n        ";
        expect(index_1.graphQlQueryToJson(mutation)).toEqual({
            mutation: {
                getPersonalStuff: {
                    __args: {
                        input: {
                            count: 1000,
                        },
                    },
                    personal: {
                        name: true,
                        address: true,
                    },
                    other: {
                        parents: true,
                    },
                },
            },
        });
    });
    it("Arguments wrapped in nested object", function () {
        var mutation = "\n        mutation {\n            getPersonalStuff(input: {\n                name: \"HANNES\",\n                lastName: \"RUDOLF\",\n                city: {\n                    name: \"Hollywood\",\n                    country: \"California, USA\"\n                }\n            }) {\n                personal {\n                    name\n                    address\n                }\n                other {\n                    parents\n                }\n            }\n        }\n        ";
        expect(index_1.graphQlQueryToJson(mutation)).toEqual({
            mutation: {
                getPersonalStuff: {
                    __args: {
                        input: {
                            name: "HANNES",
                            lastName: "RUDOLF",
                            city: {
                                name: "Hollywood",
                                country: "California, USA",
                            },
                        },
                    },
                    personal: {
                        name: true,
                        address: true,
                    },
                    other: {
                        parents: true,
                    },
                },
            },
        });
    });
    it("Argument is a list", function () {
        var mutation = "\n        mutation {\n            getPersonalStuff(input: [\n                \"ONE\",\n                \"TWO\"\n            ]) {\n                personal {\n                    name\n                    address\n                }\n                other {\n                    parents\n                }\n            }\n        }\n        ";
        expect(index_1.graphQlQueryToJson(mutation)).toEqual({
            mutation: {
                getPersonalStuff: {
                    __args: {
                        input: ["ONE", "TWO"],
                    },
                    personal: {
                        name: true,
                        address: true,
                    },
                    other: {
                        parents: true,
                    },
                },
            },
        });
    });
    it("Argument is a int", function () {
        var mutation = "\n        mutation {\n            getUsers(count: 1000) {\n                personal {\n                    count\n                }\n            }\n        }";
        expect(index_1.graphQlQueryToJson(mutation)).toEqual({
            mutation: {
                getUsers: {
                    __args: {
                        count: 1000,
                    },
                    personal: {
                        count: true,
                    },
                },
            },
        });
    });
});
describe("Aliases", function () {
    it("Simple example with aliases", function () {
        var query = "\n            query {\n                viewer {\n                    thingOne {\n                        name\n                        team\n                    }\n                    renamed: thingOne {\n                        propertyC\n                    }\n                }\n            }\n        ";
        var json = index_1.graphQlQueryToJson(query);
        expect(json).toEqual({
            query: {
                viewer: {
                    thingOne: {
                        name: true,
                        team: true,
                    },
                    renamed: {
                        __aliasFor: "thingOne",
                        propertyC: true,
                    },
                },
            },
        });
    });
});
describe("Enum Types", function () {
    it("Simple enum type", function () {
        var query = "\n            query {\n                viewer {\n                    stuffWithArguments(argumentOne: ALL) {\n                        personalEnumData\n                    }\n                }\n            }\n        ";
        expect(index_1.graphQlQueryToJson(query)).toEqual({
            query: {
                viewer: {
                    stuffWithArguments: {
                        __args: {
                            argumentOne: new json_to_graphql_query_1.EnumType("ALL"),
                        },
                        personalEnumData: true,
                    },
                },
            },
        });
    });
    it("Argument is a variable", function () {
        var query = "\n    mutation {\n        getUsers(count: $count) {\n            personal {\n                count\n            }\n        }\n    }";
        var result = index_1.graphQlQueryToJson(query, {
            variables: {
                count: 1000,
            },
        });
        expect(result).toEqual({
            mutation: {
                getUsers: {
                    __args: {
                        count: 1000,
                    },
                    personal: {
                        count: true,
                    },
                },
            },
        });
    });
});
describe("Complex examples", function () {
    it("Query using name, variables, enums and aliases", function () {
        var variables = { ownership: "ALL", name: "" };
        var query = "query GetAuthenticationsPrivate($name: String, $ownership: OwnershipQueryType!) {\n  viewer {\n    userAuthentications(criteria: {name: $name, ownershipQueryType: $ownership}) {\n      edges {\n        node {\n          id\n          name\n          created\n          creator {\n            name\n            id\n            __typename\n          }\n          service {\n            icon\n            __typename\n          }\n          owner {\n            ownerType\n            __typename\n          }\n          customFields\n          scopes\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    count: userAuthentications(criteria: {ownershipQueryType: ALL}) {\n      edges {\n        node {\n          id\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n";
        var result = index_1.graphQlQueryToJson(query, { variables: variables });
        var userAuthenticationsQuery = {
            __args: {
                criteria: {
                    name: "",
                    ownershipQueryType: "ALL",
                },
            },
            edges: {
                node: {
                    id: true,
                    name: true,
                    created: true,
                    creator: {
                        name: true,
                        id: true,
                        __typename: true,
                    },
                    service: {
                        icon: true,
                        __typename: true,
                    },
                    owner: {
                        ownerType: true,
                        __typename: true,
                    },
                    customFields: true,
                    scopes: true,
                    __typename: true,
                },
                __typename: true,
            },
            __typename: true,
        };
        var countQuery = {
            __aliasFor: "userAuthentications",
            __args: {
                criteria: {
                    ownershipQueryType: "ALL",
                },
            },
            edges: {
                node: {
                    id: true,
                    __typename: true,
                },
                __typename: true,
            },
            __typename: true,
        };
        var expectedQueryOutput = {
            query: {
                viewer: {
                    __typename: true,
                    userAuthentications: userAuthenticationsQuery,
                    count: countQuery,
                },
            },
        };
        expect(result).toEqual(expectedQueryOutput);
    });
});
describe("Errors", function () {
    it("Throws error if given invalid graphQL schema", function () {
        expect(function () { return index_1.graphQlQueryToJson("query { asdf sd"); }).toThrow();
    });
    it("Throws error if query has variable which is not passed in", function () {
        var query = "\n        query GetThisStuff($name: String, $lastName: String) {\n            viewer {\n                personal(criteria: {\n                    name: $name,\n                    lastName: $lastName\n                }) {\n                    name\n                    address\n                }\n            }\n        }\n        ";
        var getResult = function () {
            return index_1.graphQlQueryToJson(query, {
                variables: {
                    name: "PETER",
                },
            });
        };
        expect(getResult).toThrow();
    });
});
describe("Helpers", function () {
    it("flatMap", function () {
        var result = index_1.flatMap([1, 2, 3], function (x) { return [x, x + 1]; });
        expect(result).toEqual([1, 2, 2, 3, 3, 4]);
    });
    it("isString", function () {
        expect(index_1.isString("asdf")).toBe(true);
        expect(index_1.isString(1)).toBe(false);
    });
    it("isObject", function () {
        expect(index_1.isObject({})).toBe(true);
        expect(index_1.isObject(1)).toBe(false);
    });
    it("isArray", function () {
        expect(index_1.isArray([])).toBe(true);
        expect(index_1.isArray(1)).toBe(false);
    });
});
//# sourceMappingURL=full_functionality.spec.js.map