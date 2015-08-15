//CFAutoload javascript asset loader

function CFAutoload( src, options ) {

    var scope = this;

    var options = typeof( options ) === "object" ? options : CFAutoload.Defaults;

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


    //Check if running in node.js

    isNode: (function() {

        return ( typeof( module ) !== 'undefined' && module.exports );

    })(),


    //Set source of loads

    setSource: function( src ) {

        this.src = src;

        this.srcType = typeof( src );

    },


    //Create AJAX request object

    createXHR: function() {

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

    loadByURL: function( options ) {


    },


    //Load by src array of assets

    loadByObject: function( options ) {

    }

};


//CF option defaults

CFAutoload.Defaults = {

    //Settings
    async: false,
    useEval: false,
    fallbackEval: true,

    //Callback
    onLoad: null,
    onProgress: null

};

if( CFAutoload.isNode ) { module.exports = CFAutoload; }
