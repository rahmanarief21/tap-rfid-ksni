const Raspberry = require("../models/raspberry.model.js");

function promiseGetRaspberryByIpAddress(ipAddress) {
    const raspPromise = new Promise((resolve, reject) => {
        Raspberry.getOneByIpAddress(ipAddress, (err, data) => {
            if (err) {
                reject(err);
            } else resolve(data);
        });
    });

    return raspPromise;
}

exports.getByIpAddress = async (req, res) => {
    const resultPromise = {};

    try {
        resultPromise.success = await promiseGetRaspberryByIpAddress(req.params.ip_address);
    }catch(errors){
        resultPromise.errors = errors;
    }
    
    if (resultPromise.hasOwnProperty("success")) {
        res.send({status : 1});
    }else res.send({status : 0});
    
};

module.exports = {
    promiseGetRaspberryByIpAddress
}