'use strict';
var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

var PIPELINE_SCHEMA = new Schema({
        created: { type: Date, default: Date.now},
        createBy: String,
        lastUpdated: Date,
        branches: [{name: String, repoUrl: String}],
        steps: []
    });

var Pipeline = mongoose.model('Pipeline', PIPELINE_SCHEMA);

module.exports = function(req, res) {
    res.send('none ya')
}
// var appConfig   = require( '../../app-config.json' ),
//     db          = require( '../db' ).db( appConfig.database.name );

// // Example route - returns all items in database collection
// module.exports = function( req, res ) {

//     console.log( 'Accessing database ' + db.databaseName );

//     db.collection( appConfig.database.collection, function( err, collection ) {
//         if ( err ) {
//             console.log( 'Error accessing collection' );
//             console.log( err );
//             return err;
//         }

//         // Find all items and return them
//         collection.find().toArray( function( err, items ) {
//             if ( err ) {
//                 console.log( 'Error finding items in collection' );
//                 console.log( err );
//                 return err;
//             }

//             res.send( items );
//         } );
//     } );

// };