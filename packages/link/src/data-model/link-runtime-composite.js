// This is an auto-generated file, do not edit manually
export const definition = {
  "models": {
    "Vote": {
      "id": "kjzl6hvfrbw6c8o023d8jq7hdy0tac2icdw7ac44r9esf0htu3xmxlgzadfratb",
      "accountRelation": { "type": "list" },
    },
    "Favor": {
      "id": "kjzl6hvfrbw6cb7lwvteayki4ox8s3lupuewby4gfjlxrkfegbhmodmokdz7596",
      "accountRelation": { "type": "list" },
    },
    "Comment": {
      "id": "kjzl6hvfrbw6c6mg1xohqe4eukt3hauxgsgdhwqvcevjgdlrj6b7s7rqsjcwyl2",
      "accountRelation": { "type": "list" },
    },
    "Link": {
      "id": "kjzl6hvfrbw6c5k700w9ff9o7y243g2wifpx9bdmdrvnjteu3annxfd3kljtp6w",
      "accountRelation": { "type": "list" },
    },
    "Score": {
      "id": "kjzl6hvfrbw6c7rikzda322kjfonr67looylk4nivze2wr7cgm861yjepl1qjpu",
      "accountRelation": { "type": "list" },
    },
  },
  "objects": {
    "Vote": {
      "type": {
        "type": "reference",
        "refType": "enum",
        "refName": "VoteType",
        "required": false,
      },
      "linkID": { "type": "streamid", "required": true },
      "revoke": { "type": "boolean", "required": false },
      "createAt": { "type": "datetime", "required": false },
      "modifiedAt": { "type": "datetime", "required": false },
      "link": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "document",
          "model":
            "kjzl6hvfrbw6c5k700w9ff9o7y243g2wifpx9bdmdrvnjteu3annxfd3kljtp6w",
          "property": "linkID",
        },
      },
      "creator": { "type": "view", "viewType": "documentAccount" },
      "version": { "type": "view", "viewType": "documentVersion" },
    },
    "Favor": {
      "linkID": { "type": "streamid", "required": true },
      "revoke": { "type": "boolean", "required": false },
      "createAt": { "type": "datetime", "required": false },
      "modifiedAt": { "type": "datetime", "required": false },
      "link": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "document",
          "model":
            "kjzl6hvfrbw6c5k700w9ff9o7y243g2wifpx9bdmdrvnjteu3annxfd3kljtp6w",
          "property": "linkID",
        },
      },
      "creator": { "type": "view", "viewType": "documentAccount" },
      "version": { "type": "view", "viewType": "documentVersion" },
    },
    "Comment": {
      "text": { "type": "string", "required": true },
      "linkID": { "type": "streamid", "required": true },
      "revoke": { "type": "boolean", "required": false },
      "createAt": { "type": "datetime", "required": false },
      "modifiedAt": { "type": "datetime", "required": false },
      "link": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "document",
          "model":
            "kjzl6hvfrbw6c5k700w9ff9o7y243g2wifpx9bdmdrvnjteu3annxfd3kljtp6w",
          "property": "linkID",
        },
      },
      "creator": { "type": "view", "viewType": "documentAccount" },
      "version": { "type": "view", "viewType": "documentVersion" },
    },
    "Link": {
      "url": { "type": "uri", "required": true },
      "data": { "type": "string", "required": false },
      "type": { "type": "string", "required": true },
      "title": { "type": "string", "required": true },
      "createAt": { "type": "datetime", "required": false },
      "modifiedAt": { "type": "datetime", "required": false },
      "creator": { "type": "view", "viewType": "documentAccount" },
      "version": { "type": "view", "viewType": "documentVersion" },
      "votesCount": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "queryCount",
          "model":
            "kjzl6hvfrbw6c8o023d8jq7hdy0tac2icdw7ac44r9esf0htu3xmxlgzadfratb",
          "property": "linkID",
        },
      },
      "votes": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "queryConnection",
          "model":
            "kjzl6hvfrbw6c8o023d8jq7hdy0tac2icdw7ac44r9esf0htu3xmxlgzadfratb",
          "property": "linkID",
        },
      },
      "commentsCount": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "queryCount",
          "model":
            "kjzl6hvfrbw6c6mg1xohqe4eukt3hauxgsgdhwqvcevjgdlrj6b7s7rqsjcwyl2",
          "property": "linkID",
        },
      },
      "comments": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "queryConnection",
          "model":
            "kjzl6hvfrbw6c6mg1xohqe4eukt3hauxgsgdhwqvcevjgdlrj6b7s7rqsjcwyl2",
          "property": "linkID",
        },
      },
      "favorsCount": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "queryCount",
          "model":
            "kjzl6hvfrbw6cb7lwvteayki4ox8s3lupuewby4gfjlxrkfegbhmodmokdz7596",
          "property": "linkID",
        },
      },
      "favors": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "queryConnection",
          "model":
            "kjzl6hvfrbw6cb7lwvteayki4ox8s3lupuewby4gfjlxrkfegbhmodmokdz7596",
          "property": "linkID",
        },
      },
      "scoresCount": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "queryCount",
          "model":
            "kjzl6hvfrbw6c7rikzda322kjfonr67looylk4nivze2wr7cgm861yjepl1qjpu",
          "property": "linkID",
        },
      },
      "scores": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "queryConnection",
          "model":
            "kjzl6hvfrbw6c7rikzda322kjfonr67looylk4nivze2wr7cgm861yjepl1qjpu",
          "property": "linkID",
        },
      },
    },
    "Score": {
      "text": { "type": "string", "required": true },
      "value": { "type": "integer", "required": true },
      "linkID": { "type": "streamid", "required": true },
      "revoke": { "type": "boolean", "required": false },
      "createAt": { "type": "datetime", "required": false },
      "modifiedAt": { "type": "datetime", "required": false },
      "link": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "document",
          "model":
            "kjzl6hvfrbw6c5k700w9ff9o7y243g2wifpx9bdmdrvnjteu3annxfd3kljtp6w",
          "property": "linkID",
        },
      },
      "creator": { "type": "view", "viewType": "documentAccount" },
      "version": { "type": "view", "viewType": "documentVersion" },
    },
  },
  "enums": { "VoteType": ["UP_VOTE", "DOWN_VOTE"] },
  "accountData": {
    "voteList": { "type": "connection", "name": "Vote" },
    "favorList": { "type": "connection", "name": "Favor" },
    "commentList": { "type": "connection", "name": "Comment" },
    "linkList": { "type": "connection", "name": "Link" },
    "scoreList": { "type": "connection", "name": "Score" },
  },
};
