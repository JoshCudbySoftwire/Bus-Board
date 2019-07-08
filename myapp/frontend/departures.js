function myFunction() {
    document.getElementById("myForm").submit();
    let postcode = document.getElementById("postcode").value

    let xhttp = new XMLHttpRequest();
    const url = 'http://localhost:3000/departureBoards?postcode=' + postcode;
    xhttp.open('GET', url, true);
    xhttp.onload = function() {
        const repsonseData = JSON.parse(xhttp.response)
        document.getElementById("listHeader").innerHTML = "Buses are shown below"
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
        document.getElementById("list2").innerHTML = StringToPrint;
        console.log(JSON.parse(xhttp.response))
    }
    xhttp.send()
}