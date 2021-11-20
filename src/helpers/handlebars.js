const Handlebars = require ("handlebars")
const fs = require("fs");
const path = require("path");
const usersDb = require("../models/users");
const { drive } = require("googleapis/build/src/apis/drive");

const compareHelper = Handlebars.registerHelper( "when",function(operand_1, operator, operand_2, options) {
    var operators = {
     'eq': function(l,r) { return l == r; },
     'noteq': function(l,r) { return l != r; },
     'gt': function(l,r) { return Number(l) > Number(r); },
     'or': function(l,r) { return l || r; },
     'and': function(l,r) { return l && r; },
     '%': function(l,r) { return (l % r) === 0; }
    }
    , result = operators[operator](operand_1,operand_2);
  
    if (result) return options.fn(this);
    else  return options.inverse(this);
  });

const forbucle = Handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});

const lenghtobj = Handlebars.registerHelper('get_length', function (obj) {
    return obj.length;
});

/*const returnImg = Handlebars.registerHelper( 'picProfile', function(id){
    require("../config/googleAuth");
    const user = usersDb.findById(id)
    let dir = "https://drive.google.com/drive/u/1/folders/" + user.Google.drivePath
    async.doWhilst((callback) => {
        drive.files.list({
            q: "name='profilePhoto'"
        })
    })
});*/

//module.exports = returnImg;
module.exports = lenghtobj;
module.exports = forbucle;
module.exports = compareHelper;