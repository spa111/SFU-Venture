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
            console.log(err);

            // Dont throw error a failure here. Send an empty array instead to prevent frontend from seeing
            // an error caused by a book not existing for a class
            response.status(200).json({ "searchResults": [] });
        } else {
            if (!res.body.errorMessage) {
                section = res.body[0].value;
                requestCaller(`http://www.sfu.ca/bin/wcm/course-outlines?${year}/${term}/${course}/${courseNumber}/${section}
                `, { json: true }, (err, res, body) => {
                    if (err) {
                        console.log(err);
                        response.status(401).send(err);
                    } else {
                        if (res.body.requiredText === undefined && res.body.recommendedText === undefined) {
                            // Dont throw here as the class exists in the api's database but there just is no reaing material required
                            response.status(200).json({ "searchResults": [] });
                        } else {
                            let books = [];
                            let requiredTexts = res.body.requiredText;
                            let recommendedTexts = res.body.recommendedText;
                            requiredTexts && requiredTexts.forEach(book => {
                                if (book.isbn) {
                                    if (book.isbn.includes(" ")) {
                                        book.isbn = book.isbn.split(" ")[1];
                                    }
                                    books.push(book);
                                }
                            });

                            recommendedTexts && recommendedTexts.forEach(book => {
                                if (book.isbn) {
                                    if (book.isbn.includes(" ")) {
                                        book.isbn = book.isbn.split(" ")[1];
                                    }
                                    books.push(book);
                                }
                            });
                            response.status(200).json({ "searchResults": books });
                        }
                    }
                });
            } else {
                response.status(200).json({ "searchResults": [] });
            }

        }

    });
};

const getImageForISBN = (request, response) => {
    let isbn = request.body.isbn;
    let size = request.body.size;
    response.status(200).json(`https://syndetics.com/index.php?client=primo&isbn=${isbn}/${size}c.jpg`);
};

module.exports = {
    getBookDetails,
    getImageForISBN
};