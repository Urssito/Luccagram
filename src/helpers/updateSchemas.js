const users = require("../models/users");
const publications = require("../models/publications");

const userData = JSON.stringify(users.schema.obj);
const pubData = JSON.stringify(publications.schema.obj);
updateModels(users, userData);

async function updateModels(schema,schemaString){
    let rawData = schemaString.split('":');
    let schemaKeys = [];
    let objUpdated = [];
    let waiter = false

    rawData.forEach(key => {
        if(key.indexOf("required") <= -1 && key.indexOf("default") <= -1){
            schemaKeys.push(key.split('"').pop());
        }
    });
    schemaKeys = schemaKeys.slice(0, schemaKeys.length-1)

    await schema.find((err,results)=>{
        if(err) console.error;
        else{
            

            let objString = JSON.stringify(results[0]).split('":');
            let keys = []

            objString.forEach(a => {
                keys.push(a.split('"').pop())
            });
            keys = keys.slice(0, keys.length-1)

            results.forEach(result => {
                keys.forEach(key => {
                    if(key != '_id' && key != '__v'){
                        let found = schemaKeys.includes(key);
                        if(!found){
                            delete result[key]
                            objUpdated.push(result);
                        }
                    }
                });
            });

        }
        waiter = true
    }).clone();
    
    objUpdated.forEach(obj => {
        schema.findOneAndUpdate({user: obj.user}, obj, (err, success) => {
            if(err) console.error(err);
            else{
                console.log('success');
            }
        });
    });
}