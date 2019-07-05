const axios = require('axios');
const readline = require('readline-sync');

const distance = 1000;
const credential = 'app_id=13411ed4&app_key=e15ea63629e09138b8c6c84355de0b68';

function init() {
    console.log('What postcode do you want to test?');
    const postcode = readline.prompt();
    const postcodesUrl = 'https://api.postcodes.io/postcodes/' + postcode;
    return postcodesUrl
}

async function getLonLatData(postcodesUrl) {
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
    const stopsUrl = 'https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanOnStreetBusCoachStopPair&radius=' + distance + '&useStopPointHierarchy=true&modes=bus&returnLines=true&lat=' + LonLatData[1] + '&lon=' + LonLatData[0] + '&' + credential;
    try {
        const response = await axios.get(stopsUrl);
        const stationsRawData = response['data']['stopPoints']
        const idList = [];
        for(let i = 0; i < stationsRawData.length; i++) {
            const stationId = stationsRawData[i]['children']
            let pairIdList = [];
            for(let j in stationId) {pairIdList.push(stationId[j]['id'])};
            if(pairIdList.length != 0) {idList.push(pairIdList)};
        }
        if(idList.length != 0) {
            return idList
        }
        else{
            throw "This is no bus stop nearby."
        }
    }
    catch (error) {
        console.log(error);
    }
}

async function getBusData(stopCodeArr) {
    try {
        let responseData = [];
        for(let i = 0; i < stopCodeArr.length; i ++){
            const BusesUrl = 'https://api.tfl.gov.uk/StopPoint/' + stopCodeArr[i] + '/Arrivals?' + credential;
            const rawData = await axios.get(BusesUrl);
            responseData = responseData.concat(rawData['data'])
        }
        return responseData;
    } 
    catch (error) {
        console.error('Invalid stop code');
    }
}
  
const logBusData = (DataArray) => {
    const stationName = DataArray[0]['stationName']
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
    console.log('Station Name: ' + stationName)
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
    let postcodesUrl = await init()
    let LonLatData = await getLonLatData(postcodesUrl);
    let StopCode = await getStopCode(LonLatData);
    let BusData0 = await getBusData(StopCode[0]);
    let BusData1 = await getBusData(StopCode[1]);
    await logBusData(BusData0);
    await logBusData(BusData1);
}
main();

