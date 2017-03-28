var express = require('express');
var router = express.Router();

// "Database". Names of places, and whether the user has visited it or not.

//var places = [
//    {id: "1", name: "Rome", lowerCaseName: "rome", visited: true},
//    {id: "2", name: "New York", lowerCaseName: "new york", visited: false},
//    {id: "3", name: "Tokyo", lowerCaseName: "tokyo", visited: false}
//];
/*
 db.locations.insertMany(
     [
         {id: "1", name: "Rome", lowerCaseName: "rome", visited: true},
         {id: "2", name: "New York", lowerCaseName: "new york", visited: false},
         {id: "3", name: "Tokyo", lowerCaseName: "tokyo", visited: false}
     ]
 )
*/

/* GET home page. */
router.get('/', function (req, res, next) {

    req.db.collection('locations').find().toArray(function(err, docs){
        if (err) {
            return next(err)
        }
        res.render('index', {title: 'Travel Wish List', places: docs});

    });
});


/* GET all items home page. */
router.get('/all', function (req, res) {
    req.db.collection('locations').find().toArray(function(err, docs){
        if (err) {
            return next(err)
        }
        res.json(docs);
    });
});


/* POST - add a new location */
router.post('/add', function (req, res) {
    var name = req.body.name;
    var lowerCaseName = req.lowerCaseWords(name);

    // Check if we have this one already
    req.db.collection("locations").count({"lowerCaseName": lowerCaseName}, function(err, count){
        if(err){
            return err;
        }
        if ( count !== 0 ) {
            return res.json({"status": "fail", "message":"duplicate entry"});
        }
        // insert
        req.db.collection('locations').count(function (err, count) {
            if (err) {
                return err;
            }
            var place = {'id': ++count + "", 'name': name, 'lowerCaseName': lowerCaseName, 'visited': false};

            req.db.collection('locations').insertOne(place, function (err) {
                if (err) {
                    return err;
                }
                req.db.collection('locations').find(function (err, places) {
                    if (err) {
                        return err;
                    }

                    console.log('After POST, the places list is');

                    res.status(201);      // Created
                    res.json({"status": "success", "place":place});      // Send new object data back as JSON, if needed.

                })
            });
        });

    });

});


/* PUT - update whether a place has been visited or not */
router.put('/update', function (req, res) {

    var id = req.body.id;
    var visited = req.body.visited == "true";  // all the body parameters are strings

    req.db.collection('locations').update({'id':id}, {$set:{'visited':visited}}, function(err, doc){
        if (err ){
            return err;
        }

        console.log('After PUT, the places list is');
        res.json({"status":"success"});
    });

});


router.delete('/delete', function (req, res) {

    var place_id = req.body.id;

    req.db.collection('locations').findOneAndDelete({"id":place_id},function (err, doc) {
        if (err) {
            return err;
        }

        res.status(200);
        res.json({"status":"success", "place": doc.value});
    });

});

module.exports = router;
