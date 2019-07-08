const axios = require('axios');
const readline = require('readline-sync');

const distance = 1000;
const credential = 'app_id=13411ed4&app_key=e15ea63629e09138b8c6c84355de0b68';

// function init() {
//     console.log('What postcode do you want to test?');
//     //const postcode = readline.prompt();
//     const postcode = 'E1 6AN'
//     const postcodesUrl = 'https://api.postcodes.io/postcodes/' + postcode;
//     return postcodesUrl
// }

async function getLonLatData(postcodesUrl) {
    try {
        const response = await axios.get(postcodesUrl);
        const longitude = response["data"]["result"]["longitude"];
        const latitude = response["data"]["result"]["latitude"];
        return [longitude, latitude];
    }   
    catch (error) {
        throw 'Invalid postcode';
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
            throw "There is no bus stop nearby.";
        }
    }
    catch (error) {
        throw "There is no bus stop nearby."
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
        throw 'Invalid stop code';
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
    return([stationName, trimmedListOfBuses]);
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

exports.main = async (postcode) => {
    let postcodesUrl = 'https://api.postcodes.io/postcodes/' + postcode;
    let LonLatData = await getLonLatData(postcodesUrl);
    let StopCode = await getStopCode(LonLatData);
    let BusData0 = await getBusData(StopCode[0]);
    let BusData1 = await getBusData(StopCode[1]);
    let stationAndBusData0 = await logBusData(BusData0);
    let stationAndBusData1 = await logBusData(BusData1);
    let stationName0 = stationAndBusData0[0];
    let busesStation0 = stationAndBusData0[1];
    let stationName1 = stationAndBusData1[0];
    let busesStation1 = stationAndBusData1[1];
    let dataObject = {
        'Name0' : stationName0,
        'Buses0' : busesStation0,
        'Name1' : stationName1,
        'Buses1' : busesStation1
    };

    return dataObject;
}
//main();

