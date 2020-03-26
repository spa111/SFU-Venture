const requestCaller = require('request');


const getBookDetails = (request, response) => {
    let year = request.body.year;
    let term = request.body.term;
    let course = request.body.course;
    let courseNumber = request.body.courseNumber;
    let section = '';

    requestCaller(`http://www.sfu.ca/bin/wcm/course-outlines?${year}/${term}/${course}/${courseNumber}
    `, { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err);
        } else {
            section = res.body[0].value
            requestCaller(`http://www.sfu.ca/bin/wcm/course-outlines?${year}/${term}/${course}/${courseNumber}/${section}
            `, { json: true }, (err, res, body) => {
                if (err) {
                    return console.log(err);
                } else {
                    console.log(res.body.requiredText);
                    response.status(200).json(res.body.requiredText);
                }
            });
        }

    });
};

const getImageForISBN = (request, response) => {
    let isbn = request.body.isbn;
    let size = request.body.size;
    response.status(200).send(`https://syndetics.com/index.php?client=primo&isbn=${isbn}/${size}c.jpg`)
}

module.exports = {
    getBookDetails,
    getImageForISBN
}