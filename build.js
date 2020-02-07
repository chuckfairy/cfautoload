//Libs
var COMPILER = require("cfcompile");
var FS = COMPILER.getFS();

//Build three source
//cfcompile js build
COMPILER.compileFromConfigFile(__dirname + "/compile.json", function(data, err) {

    //Log errors
    if(err) {console.log(err);}

    //Write the build file
    console.log("\nWriting new file in /build/cfautoload.min.js");
    FS.writeFile(__dirname + "/build/cfautoload.min.js", data, function(err) {
        if(err) {console.log(err);}
    });

});
