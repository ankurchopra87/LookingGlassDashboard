const dataGenerator = require("../dataGenerator.js");

describe("Getting random interger under a maximum value", function(){
    it("The function should return a int", function(){
        var value = dataGenerator.GetRandomInt(40);
        expect(Number.isInteger(value)).toBe(true);
    })

    it("The function should return a int under or equal to max value", function(){
        var value = dataGenerator.GetRandomInt(40);
        expect(value).toBeLessThanOrEqual(40);
    })
});

describe("Getting random name between 2 and 256 chars", function(){
    it("The function should return a string", function(){
        var value = dataGenerator.GenerateRandomName();
        expect(typeof value).toBe("string");
    })

    it("The function should return a string netween 2 and 256 characters", function(){
        var value = dataGenerator.GenerateRandomName();
        expect(value.length).toBeLessThanOrEqual(256);
        expect(value.length).toBeGreaterThanOrEqual(2);

    })
});

describe("Getting random array of Virus Data", function(){
    it("The function should return an array", function(){
        var value = dataGenerator.GenerateRandomVirusData();
        expect(Array.isArray(value)).toBe(true);
    })

    it("The function should return an array with length greater than 0", function(){
        var value = dataGenerator.GenerateRandomVirusData();
        expect(value.length).toBeGreaterThan(0);
    })

    it("The function should return an array with unique values", function(){
        var value = dataGenerator.GenerateRandomVirusData();
        var set = new Set(value);
        expect(set.size == value.length).toBe(true);
    })

    it("The function should return an array with valid virus values", function(){
        const virusNames = ['APT1', 'Spam', 'Botnet', 'StealCreds'];
        var value = dataGenerator.GenerateRandomVirusData();
        
        var valid = true;
        for(let i = 0; i < value.length; i++){
            if (!virusNames.includes(value[i])){
                valid = false; 
                break;
            }
        }
        expect(valid).toBe(true);
    })
});

describe("Getting random Threat Data", function(){
    it("The function should return an object", function(){
        var value = dataGenerator.GenerateThreatData();
        expect(value && typeof value === 'object' && value.constructor === Object).toBe(true);
    })

    it("The function should return an object with a 'threatData' key", function(){
        var value = dataGenerator.GenerateThreatData();
        expect(value.hasOwnProperty('threatData')).toBe(true);
    })

    it("The function should return an object with 'threatData' value of type array", function(){
        var value = dataGenerator.GenerateThreatData();
        expect(Array.isArray(value["threatData"])).toBe(true);
    })

    it("The function should return an object with 'threatData' containins 2 records", function(){
        var value = dataGenerator.GenerateThreatData();
        expect(value["threatData"].length).toBe(2);
    })

    it("'threatData' record must contain valid function", function(){
        const ipFunctionNames = ['web server', 'main server', 'ftp server'];
        var value = dataGenerator.GenerateThreatData();

        var valid = true;
        for(let i = 0; i < value["threatData"].length; i++){
            if (!ipFunctionNames.includes(value["threatData"][i]["function"])){
                valid = false; 
                break;
            }
        }
        expect(valid).toBe(true);
    })
});