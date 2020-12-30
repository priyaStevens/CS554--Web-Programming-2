"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const mongo = require("mongodb");
var App;
(function (App) {
    class MongoHelper {
        constructor() {
        }
        static connect(url) {
            return new Promise((resolve, reject) => {
                mongo.MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
                    if (err) {
                        console.log('in error');
                        reject(err);
                    }
                    else {
                        MongoHelper.client = client;
                        resolve(client);
                    }
                });
            });
        }
        disconnect() {
            MongoHelper.client.close();
        }
    }
    App.MongoHelper = MongoHelper;
})(App = exports.App || (exports.App = {}));
