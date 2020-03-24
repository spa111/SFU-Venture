const requestCaller = require('request');
const googleapiKey = "AIzaSyDT4wuLrTQhVV6kil3hKjjyAwxnJ5vwZdw"
const googleApiBasicCall = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"

const getActivityAroundSFU = (request, response) => {
    let coord = request.body.coord;
    let radius = request.body.radius;
    let type = request.body.typer;
    let keyword = request.body.keyword;

    // https://maps.googleapis.com/maps/api/place/textsearch/xml?query=restaurants+in+Sydney&key=YOUR_API_KEY
    // https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=YOUR_API_KEY

    requestCaller(`${googleApiBasicCall}location=${coord}&radius=${radius}&type=${type}&keyword=${keyword}&key=${googleapiKey}
    `, { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err);
        } else {
            response.status(200).json(body.results);
        }

    });
};


module.exports = {
    getActivityAroundSFU
}