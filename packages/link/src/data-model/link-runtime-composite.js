// This is an auto-generated file, do not edit manually
export const definition = {
  "models": {
    "Favor": {
      "id": "kjzl6hvfrbw6cb7lwvteayki4ox8s3lupuewby4gfjlxrkfegbhmodmokdz7596",
      "accountRelation": { "type": "list" },
    },
    "Link": {
      "id": "kjzl6hvfrbw6c87sqyjuqw7q5w8ofjsp6ki9ubghblh4gk72urafq1kdy9nlzc8",
      "accountRelation": { "type": "list" },
    },
    "Vote": {
      "id": "kjzl6hvfrbw6c8o023d8jq7hdy0tac2icdw7ac44r9esf0htu3xmxlgzadfratb",
      "accountRelation": { "type": "list" },
    },
    "Score": {
      "id": "kjzl6hvfrbw6c7rikzda322kjfonr67looylk4nivze2wr7cgm861yjepl1qjpu",
      "accountRelation": { "type": "list" },
    },
    "Comment": {
      "id": "kjzl6hvfrbw6c6mg1xohqe4eukt3hauxgsgdhwqvcevjgdlrj6b7s7rqsjcwyl2",
      "accountRelation": { "type": "list" },
    },
  },
  "objects": {
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
    "Link": {
      "url": { "type": "string", "required": true },
      "data": { "type": "string", "required": false },
      "type": { "type": "string", "required": true },
      "title": { "type": "string", "required": true },
      "createAt": { "type": "datetime", "required": false },
      "modifidedAt": { "type": "datetime", "required": false },
      "creator": { "type": "view", "viewType": "documentAccount" },
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
  },
  "enums": { "VoteType": ["UP_VOTE", "DOWN_VOTE"] },
  "accountData": {
    "favorList": { "type": "connection", "name": "Favor" },
    "linkList": { "type": "connection", "name": "Link" },
    "voteList": { "type": "connection", "name": "Vote" },
    "scoreList": { "type": "connection", "name": "Score" },
    "commentList": { "type": "connection", "name": "Comment" },
  },
};
