// This is an auto-generated file, do not edit manually
export const definition = {"models":{"Composite":{"interface":false,"implements":[],"id":"kjzl6hvfrbw6c9kigzo7cylhkiageuvjslfvj8gdouhqoo5n2iny4ny5i3lfh56","accountRelation":{"type":"list"}},"CompositeModel":{"interface":false,"implements":[],"id":"kjzl6hvfrbw6c60mn52cwyzw9rpxlfdyb4tf2ppwag3pksnrcr6h8fz4pnvt3w8","accountRelation":{"type":"list"}}},"objects":{"Composite":{"name":{"type":"string","required":true,"indexed":true},"revoke":{"type":"boolean","required":false,"indexed":true},"schema":{"type":"string","required":true},"createAt":{"type":"datetime","required":false,"indexed":true},"modifiedAt":{"type":"datetime","required":false,"indexed":true},"description":{"type":"string","required":false},"encodedDefinition":{"type":"string","required":true},"creator":{"type":"view","viewType":"documentAccount"},"version":{"type":"view","viewType":"documentVersion"},"compositeModels":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c60mn52cwyzw9rpxlfdyb4tf2ppwag3pksnrcr6h8fz4pnvt3w8","property":"compositeID"}}},"CompositeModel":{"modelID":{"type":"streamid","required":true},"compositeID":{"type":"streamid","required":true},"composite":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c9kigzo7cylhkiageuvjslfvj8gdouhqoo5n2iny4ny5i3lfh56","property":"compositeID"}}}},"enums":{},"accountData":{"compositeList":{"type":"connection","name":"Composite"},"compositeModelList":{"type":"connection","name":"CompositeModel"}}}