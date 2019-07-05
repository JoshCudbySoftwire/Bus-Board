function myFunction() {
    document.getElementById("myForm").submit();
    let postcode = document.getElementById("postcode").value
    //app.use(express.static('/mnt/c/Work/Training/Bus-Board2/Bus-Board'));
    // app.get('/departureBoards', async function(req, res) {
    //     try {
    //         let postcode = await req.query.postcode;
    //         res.send(await index.main(postcode))
    //     }
    //     catch (error) {
    //         if(error == 'Invalid postcode') res.send(error);
    //         else if (error == 'Invalid stop code') res.send(error);
    //         else if (error == 'There is no bus stop nearby.') res.send(error);
    //     };
    // });
    let xhttp = new XMLHttpRequest();
    const url = 'http://localhost:3000/departureBoards?postcode=' + postcode;
    xhttp.open('GET', url, true);
    xhttp.onload = function() {
        let formattedData = {};
        let strtoprint = '';
        for (let index in xhttp.response) {
            const stopName = xhttp.response[index][0];
            const stopNameStr = `<h3> ${stopName} </h3>`
            strtoprint += stopNameStr;
        }
        repsonseData = JSON.parse(xhttp.response)
        document.getElementById("bus1").innerHTML= xhttp.responseXML
        //document.getElementById("stopName1").innerHTML = `${strtoprint}`
    }
    xhttp.send()
}