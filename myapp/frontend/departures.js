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
        const repsonseData = JSON.parse(xhttp.response)
        document.getElementById("stopName1").innerHTML= repsonseData['Name0']
        let StringToPrint = ''
        let busCo = repsonseData['Buses0']
        for (let index in busCo) {
            StringToPrint += `<li> ${busCo[index]['time']} minutes: ${busCo[index]['route']} to ${busCo[index]['destination']} </li>`
        }
        document.getElementById("list1").innerHTML = StringToPrint

        document.getElementById("stopName2").innerHTML= repsonseData['Name1']
        StringToPrint = ''
        busCo = repsonseData['Buses1']
        for (let index in busCo) {
            StringToPrint += `<li> ${busCo[index]['time']} minutes: ${busCo[index]['route']} to ${busCo[index]['destination']} </li>`
        }
        document.getElementById("list2").innerHTML = StringToPrint


        console.log(JSON.parse(xhttp.response))
        //document.getElementById("stopName1").innerHTML = `${strtoprint}`
    }
    xhttp.send()
}