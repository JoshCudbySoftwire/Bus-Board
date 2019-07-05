const express = require('express');
const app = express();
const port = 3000;
const index = require('/mnt/c/Work/Training/Bus-Board2/Bus-Board/index.js');

app.use(express.static('frontend'));
app.use(express.static('/mnt/c/Work/Training/Bus-Board2/Bus-Board'));
app.get('/departureBoards', async function(req, res) {
    try {
        let postcode = await req.query.postcode;
        res.send(await index.main(postcode))
    }
    catch (error) {
        if(error == 'Invalid postcode') res.send(error);
        else if (error == 'Invalid stop code') res.send(error);
        else if (error == 'There is no bus stop nearby.') res.send(error);
    };
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

