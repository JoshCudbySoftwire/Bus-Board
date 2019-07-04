const axios = require('axios');
const readline = require('readline-sync');

console.log('What postcode do you want to test?');
const postcode = readline.prompt();
const postcodesUrl = 'https://api.postcodes.io/postcodes/' + postcode;

// const data = axios.get('https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals')
// console.log(data)

async function getLonLatData() {
    try {
        const response = await axios.get(postcodesUrl);
        const longitude = response["data"]["result"]["longitude"];
        const latitude = response["data"]["result"]["latitude"];
        return [longitude, latitude];
    }   
    catch (error) {
        console.error(error);
    }
}

async function getStopCode(LonLatData) {
    const stopsUrl = 'https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanOnStreetBusCoachStopPair&radius=200&useStopPointHierarchy=true&modes=bus&returnLines=false&lat=' + LonLatData[1] + '&lon=' + LonLatData[0];
    try {
        const response = await axios.get(stopsUrl);
        console.log(response['data']['stopPoints'])
        if (response['data']['stopPoints'].length == 0) {
            console.log('empty stop points')
            throw 'error';            
        }
        else {
            let data = '';
            data = response['data']['stopPoints'][0]['children'][0]['id']
            console.log(data)
            return data;
        }
        

        //const naptanId = data['stopPoints'][i]['lineGroup'][0]['naptanIdReference'];
        //console.log(naptanId)
        // const url = 'https://api.tfl.gov.uk/StopPoint/' + naptanId;
        // const StopCodeData = await axios.get(url);
        // console.log(StopCodeData)

        //const naptanCode = StopCodeData["data"]["lineGroup"][0]["naptanIdReference"]
        //console.log(naptanId)
        
    }
    catch (error) {
        console.log(error);
    }
}


async function getAndLogBusData(StopCode) {
    const BusesUrl = 'https://api.tfl.gov.uk/StopPoint/' + StopCode + '/Arrivals';
    try {
        const response = await axios.get(BusesUrl);
        logBusData(response);
        
        return;
    } 
    catch (error) {
        console.error('error in log bus');
    }
}
  
const logBusData = (response) => {
    const DataArray = response['data'];
    let listOfBuses = [];
    for (let i = 0; i < DataArray.length; i++ ) {
        let BusData = new incomingBus(DataArray[i]['destinationName'], DataArray[i]['lineId'], DataArray[i]['timeToStation']);
        listOfBuses.push(BusData);
    };    
    listOfBuses.sort(function(a,b){return a.time-b.time});
    let trimmedListOfBuses = listOfBuses.slice(0,5);
    for (let index in trimmedListOfBuses) {
        trimmedListOfBuses[index].time = Math.floor(trimmedListOfBuses[index].time / 60);
    };
    for (let bus in trimmedListOfBuses) {
        trimmedListOfBuses[bus].busLogger();
    };
};

class incomingBus {
    constructor(destination, route, time){
        this.destination = destination
        this.route = route
        this.time = time
    };
    busLogger() {
        console.log(`The next bus is a number ${this.route}, going to ${this.destination} and will arrive in ${this.time} minutes.`);
    };
};

const main = async () => {
    let LonLatData = await getLonLatData();
    let StopCode = await getStopCode(LonLatData);
    let BusData = await getAndLogBusData(StopCode);
}
main();
// async function test() {
//     try {
//         const response = await axios.get('https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanOnStreetBusCoachStopPair&radius=200&useStopPointHierarchy=false&modes=bus&returnLines=false&lat=51.5074&lon=0.1278');
//     console.log(response['data'])
//     }
//     catch (error) {
//         console.log(error)
//     }
// }
// test()

