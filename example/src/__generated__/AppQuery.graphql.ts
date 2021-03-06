/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type AppQueryVariables = {};
export type AppQueryResponse = {
  readonly ships: ReadonlyArray<{
    readonly id: string | null;
    readonly name: string | null;
  } | null> | null;
};
export type AppQuery = {
  readonly response: AppQueryResponse;
  readonly variables: AppQueryVariables;
};

/*
query AppQuery {
  ships {
    id
    name
  }
}
*/

const node: ConcreteRequest = (function () {
  var v0 = [
    {
      alias: null,
      args: null,
      concreteType: "Ship",
      kind: "LinkedField",
      name: "ships",
      plural: true,
      selections: [
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "id",
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "name",
          storageKey: null,
        },
      ],
      storageKey: null,
    },
  ];
  return {
    fragment: {
      argumentDefinitions: [],
      kind: "Fragment",
      metadata: null,
      name: "AppQuery",
      selections: v0 /*: any*/,
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [],
      kind: "Operation",
      name: "AppQuery",
      selections: v0 /*: any*/,
    },
    params: {
      cacheID: "5d4f179d9fd77529c8d5229f95d52f65",
      id: null,
      metadata: {},
      name: "AppQuery",
      operationKind: "query",
      text: "query AppQuery {\n  ships {\n    id\n    name\n  }\n}\n",
    },
  };
})();
(node as any).hash = "fe6589af5b8bfbe9722d3b296cc93444";
export default node;
