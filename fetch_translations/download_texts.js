"use strict";

var step = require("step");
var fs = require("fs");

var request = require("request");

step(
    function() {
        // YouVersion provides translations by ID. Having the translation abbreviation in the URL is just for human friendliness, but the machines ignore it.
        request(
            {
                uri: "https://www.youversion.com/versions",
                headers: {"Accept": "application/json"}
            }, 
            this
        );
    }, function(err, response, body) {
        var translations = JSON.parse(body).by_language;
        console.log(JSON.stringify(translations));
    }
);
