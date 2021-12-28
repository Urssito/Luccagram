const Handlebars = require ("handlebars")


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

const profilePic = Handlebars.registerHelper('profilePic', function (picture) {
    if(picture){
        return `https://drive.google.com/uc?export=view&id=${picture}`
    }else{
        return "/img/main/profilePhoto.jpg";
    }
})

module.exports = lenghtobj;
module.exports = forbucle;
module.exports = compareHelper;
module.exports = profilePic;