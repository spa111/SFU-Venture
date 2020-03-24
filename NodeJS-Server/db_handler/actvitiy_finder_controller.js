const requestCaller = require('request');
const googleapiKey = "AIzaSyDT4wuLrTQhVV6kil3hKjjyAwxnJ5vwZdw"
const googleApiBasicCall = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"

const getActivityAroundSFU = (request, response) => {
    let coord = "49.276765,-122.917957";
    // let textSearch = parseInt(request.params.text);
    let textSearch = "food"

    // https://maps.googleapis.com/maps/api/place/textsearch/xml?query=restaurants+in+Sydney&key=YOUR_API_KEY
    // https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=YOUR_API_KEY

    requestCaller(`${googleApiBasicCall}location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=${googleapiKey}
    `, { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err);
        } else {
            console.log(res);
            response.status(200).json(res);
        }

    });
};


module.exports = {
    getActivityAroundSFU
}