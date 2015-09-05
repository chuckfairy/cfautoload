//CFAutoload javascript asset loader

function CFAutoload( src, options ) {

    var scope = this;

    var options = typeof( options ) === "object" ? options : CFAutoload.Defaults;

    if( CFAutoload.isNode ) { scope.setAsNode(); }

    scope.setSource( src );

    scope.loadByType( src, options );

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

        try { return new XMLHttpRequest(); }
        catch( e ) {}
        try { return new ActiveXObject( 'Msxml2.XMLHTTP.6.0' ); }
        catch (e) {}
        try { return new ActiveXObject( 'Msxml2.XMLHTTP.3.0' ); }
        catch (e) {}
        try { return new ActiveXObject( 'Microsoft.XMLHTTP' ); }
        catch (e) {}
        return false;

    },


    //Create script load and callback

    createScriptLoad: function( src, async ) {

        return function( callback ) {

            var script = document.createElement( "script" );
            script.src = src;

            if( !!async ) {

                script.async = true;
                callback( 0, Date.now() ); 

            } else {

                script.onload = function() {
                    callback( 0, Date.now() );
                };

            }

            document.body.appendChild( script );

        }

    },


    //Create ajax get load function

    createAjaxLoad: function( src, options ) {

        return function( callback ) {

            var xhr = scope.createXHR();

            if( !xhr ) {

                throw new Error( "Browser does not support Ajax" );

            }

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

        var src = scope.src = src || [];

        var options = options || {};

        var loadMethods = []; 

        var ol = src.length|0;

        var loadFunc = options.useEval ? scope.createAjaxLoad : scope.createScriptLoad;

        for( var i = 0; i < ol; i ++ ) {

            loadMethods.push( loadFunc( src[ i ], !!options.async ) );

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
    loadKey: "compile",


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


//Node require objects

CFAutoload.require = function( src, options ) {

    if( !Array.isArray( src ) ) {

        throw new Error( "Argument 1 requires array to load to modules" );

    }

    var output = {};

    var srcLength = src.length;

    for( var i = 0; i < srcLength; i ++ ) {

        var moduleString = src[ i ];
        output[ mouduleString ] = require( moduleString );

    }

};


//Export if in node

if( CFAutoload.isNode ) { module.exports = CFAutoload; }
