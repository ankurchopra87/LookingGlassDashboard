var exports = module.exports = {};

const virusNames = ['APT1', 'Spam', 'Botnet', 'StealCreds'];
const ipFunctionNames = ['web server', 'mail server', 'ftp server'];

// Get Random Int between 0 and max. 
exports.GetRandomInt = function(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// Generate a random name between 2 and 256 characters
exports.GenerateRandomName = function(){
    let length = exports.GetRandomInt(254) + 2; // minimum length is 2, maximum is 256

    let name = "";
    for(let i =0; i < length; i++){
        let character = String.fromCharCode(97 + exports.GetRandomInt(26));
        if(i == 0){
            character.toUpperCase(); 
        }
        name += character; 
    }
    return name; 
}

// Generate random Virus Data
exports.GenerateRandomVirusData = function(){
    let numViruses = exports.GetRandomInt(virusNames.length) + 1 ; // minimum one, maximum length
    let virusIndexes = Array.from({length: numViruses}, () => Math.floor(Math.random() * numViruses));
    const uniqueIndexes = new Set(virusIndexes);
    let viruses = [];

    uniqueIndexes.forEach((index) => viruses.push(virusNames[index]));
    return viruses;
}

// Generates 2 new threatData entries with random data
exports.GenerateThreatData = function()
{
    let newData = { "threatData": [] };
    for(var i=0; i< 2; i++){
        const virusIndex = exports.GetRandomInt(virusNames.length);
        const ipFunctionIndex = exports.GetRandomInt(ipFunctionNames.length); 
        const ip = (exports.GetRandomInt(254) + 1) + '.' + exports.GetRandomInt(256) + '.' + exports.GetRandomInt(256) + '.' + exports.GetRandomInt(256); 

     
        newData["threatData"].push({
            "ip": ip,
            "virus": exports.GenerateRandomVirusData(),
            "owner": exports.GenerateRandomName(),
            "function": ipFunctionNames[ipFunctionIndex]
        });
    }
    return newData;
}

