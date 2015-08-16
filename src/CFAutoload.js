//CFAutoload javascript asset loader

function CFAutoload( src, options ) {

    var scope = this;

    var options = typeof( options ) === "object" ? options : CFAutoload.Defaults;

    if( CFAutoload.isNode ) { scope.setAsNode(); }

    scope.setSource( src );

    scope.loadByType( options );

};

CFAutoload.prototype = {

    //Src to load

    src: [],


    //Src typeof for loading [ object, string ]

    srcType: "object",


    //Assets loaded

    assets: [],


    //Compile string from assets

    compile: "",


    //Set source of loads

    setSource: function( src ) {

        this.src = src;

        this.srcType = typeof( src );

    },


    //Set as node enviorment

    setAsNode: function() {

        var scope = this;
        var fs = require( "fs" );

        scope.loadByType = function() {};

        scope.loadByURL = function() {};

        scope.loadByObject = function() {};

    },


    //Create AJAX request object

    createXHR: function() {

    },


    //Create script load and callback

    createScriptLoad: function( src, async ) {

        return function( callback ) {

            var script = document.createElement( "script" );
            script.src = src;

            if( !!async ) {

                script.async = true;
                callback(); 

            } else {

                script.onload = callback;

            }

            document.body.appendChild( script );

        }

    },


    //Load by src type

    loadByType: function( options ) {

        switch( this.srcType ) {

            case "string":
                this.loadByURL( options );
                break;

            case "object":
                this.loadByObject( options );
                break;

            default:
                throw new Error( "First argument requires an array or url location" );

        }

    },


    //Load by url of json file

    loadByURL: function( url, options, callback ) {

        var scope = this;

        scope.loadJSON( url, function( responseText ) {

            scope.src = JSON.parse( responseText ) || [];

            scope.loadByObject( options, callback );

        });

    },


    //Load by src array of assets

    loadByObject: function( src, options, callback ) {

        var scope = this;

        var src = src || [];

        var options = options || {};

        var loadMethods = []; 

        var ol = src.length|0;

        scope.src = src;

        for( var i = 0; i < ol; i ++ ) {

            loadMethods.push( scope.createScriptLoad( src[ i ] ), options.async );

        }

        async.series( loadMethods, callback );

    }

};


//CF option defaults

CFAutoload.Defaults = {

    //Settings
    async: false,
    useEval: false,
    fallbackEval: true,
    ajaxLoad: false,


    //Callback
    onLoad: null,
    onProgress: null

};


//Check if running in node.js

CFAutoload.isNode =  (function() {

    return ( typeof( module ) !== 'undefined' && module.exports );

})();


//Factory method

CFAutoload.load = function( src, options, callback ) {

    return new CFAutoload( src, options, callback );

};


//Export if in node

if( CFAutoload.isNode ) { module.exports = CFAutoload; }
