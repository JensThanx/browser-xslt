// the loaded XML file as object
var xmlfile;
var xmlstring;
var xslfile;
var transformedXmlFile;
var testTransform = document.implementation.createDocument("", "xmldoc", null);
var xmlReader;

// a helper method that triggers a download action
// @text: the contents of the downloadable file
// @name: the name of the downloadable file
// @type: the mime type (not sure if really necessary)
function download(text, name, type) {
    var a = downloadLink(text, name, type);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
function downloadLink(text, name, type){
    var a = document.createElement("a");
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.innerHTML = "Download " + name;
    return a;
}

// Handles a file input for one file.
// A valid XML is expected, the file roughly checked and then parsed.
// Output of some basic file information or an error message.
function onXMLFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var f = files[0];
    var fn = f.name;
    if (fn.length < 4 || fn.substr(fn.length-4, 4).toLowerCase() !== ".xml"){
       $("#info".concat(evt.target.id)).html(alertNode
          ("danger", "The XML file was not processed. Please make sure that the file ends with \".xml\"."));
    }
    else if (f.type != 'text/xml'){
       $("#info".concat(evt.target.id)).html(alertNode
          ("danger", "The XML file was not processed. Please make sure that it is the correct file type.").toString());
    }
    else{
       $("#info".concat(evt.target.id)).html('<h4>Loading file:</h4>' + fileInformationList(f));
       xmlReader = new FileReader();
       xmlReader.onloadend = function(e){
         try{
            xmlfile = parseXml(e.target.result);
            $("#info".concat(evt.target.id)).append("<h4>Loading complete!</h4>");
            $("#file2").css("visibility", "visible");
         }
         catch(err){
             $("#info".concat(evt.target.id)).html(alertNode
                ("danger", "Error while parsing the XML file. Make sure the file is correct."));
         }
       };
       xmlReader.readAsText(f);
    }
}

// Handles a file input for one file.
// A valid XSL is expected, the file roughly checked and then parsed.
// Output of some basic file information or an error message.
function onXSLFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var f = files[0];
    var fn = f.name;
    if (fn.length < 4 || fn.substr(fn.length-4, 4).toLowerCase() !== ".xsl"){
       $("#info".concat(evt.target.id)).html(alertNode
          ("danger", "The XSL file was not processed. Please make sure that the file ends with \".xsl\"."));
    }
    else if (f.type != 'text/xml'){
       $("#info".concat(evt.target.id)).html(alertNode
          ("danger", "The XSL file was not processed. Please make sure that it is the correct file type."));
    }
    else{
       $("#info".concat(evt.target.id)).html('<h4>Loading file:</h4>' + fileInformationList(f));
       xslReader = new FileReader();
       xslReader.onloadend = function(e){
          try{
             xslfile = parseXml(e.target.result);
             $("#info".concat(evt.target.id)).append("<h4>Loading complete!</h4>");
             $("#button1").css("visibility", "visible");
          }
          catch(err){
             $("#info".concat(evt.target.id)).html(alertNode
                ("danger", "Error while parsing the XSL file. Make sure the file is correct."));
          }
       };
       xslReader.readAsText(f);
    }
}

function transformXmlXsl(evt){
   try{
      var processor = new XSLTProcessor();
      $("#info".concat(evt.target.id)).html("Processing...");
      processor.importStylesheet(xslfile);
      var result = processor.transformToDocument(xmlfile);
      transformedXmlFile = result;
      $("#info".concat(evt.target.id)).html("Transformation complete.");
      $("#button2").css("visibility", "visible");
   }
   catch(err){
       $("#info".concat(evt.target.id)).html(alertNode
          ("danger", "Error during XSL transformation: " + err.message));
   }

}

function downloadTransformedFile(evt){
   var serializer = new XMLSerializer();
   var text = serializer.serializeToString(transformedXmlFile); 
   download(text, "file.html", "text/xml");
   $("#info".concat(evt.target.id)).html(downloadLink(text, "file.html", "text/xml"));
}

/*function loadXml(evt){
   var asyncReceiver = function(response){
      xmlfile = response.responseXML;
      xmlstring = response.responseText;
      if (xmlfile == undefined){
         $("#info".concat(evt.target.id)).html('no XML file!');
      }
      else{
         $("#info".concat(evt.target.id)).html('XML file ready.'+ xmlstring);
      }
   };
   loadXMLDoc("test.xml", asyncReceiver);
}

function loadXsl(evt){
   var asyncReceiver = function(response){
      xslfile = response.responseXML;
      if (xslfile == undefined){
         $("#info".concat(evt.target.id)).html('no XSL file!');
      }
      else{
         $("#info".concat(evt.target.id)).html('XSL file ready.');
      } 
   };
   loadXMLDoc("test.xsl", asyncReceiver);
}*/