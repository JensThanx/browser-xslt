// ###### functions that are called from UI elements (event listeners) ######

// XML file gets loaded first and transformed later
var xmlfile;
// XSL file gets loaded first and is used for transformation later
var xslfile;
// final XML file is created by transformation first and kept for later download
var transformedXmlFile;

// Handles a file input for one file.
// A valid XML is expected, the file roughly checked and then parsed.
// Output of some basic file information or an error message.
function onXMLFileSelect(evt) {
	$("#file2").css("visibility", "hidden");
	$("#button1").css("visibility", "hidden");
	$("#button2").css("visibility", "hidden"); 
	$("#infofile2").html("");
	$("#infobutton1").html("");
	$("#infobutton2").html("");
    var fileList = evt.target.files; // FileList object
    var file = fileList[0];
    var fileName = file.name;
    if (fileName.length < 4 || fileName.substr(fileName.length-4, 4).toLowerCase() !== ".xml"){
       $("#info".concat(evt.target.id)).html(alertNode
          ("danger", "The XML file was not processed. Please make sure that the file ends with \".xml\"."));
    }
    else if (file.type != 'text/xml'){
       $("#info".concat(evt.target.id)).html(alertNode
          ("danger", "The XML file was not processed. Please make sure that it is the correct file type.").toString());
    }
    else{
       $("#info".concat(evt.target.id)).html('<h4>Loading file:</h4>' + fileInformationList(file));
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
       xmlReader.readAsText(file);
    }
}

// Handles a file input for one file.
// A valid XSL is expected, the file roughly checked and then parsed.
// Output of some basic file information or an error message.
function onXSLFileSelect(evt) {
	$("#button1").css("visibility", "hidden");
	$("#button2").css("visibility", "hidden");
	$("#infobutton1").html("");
	$("#infobutton2").html("");
    var fileList = evt.target.files; // FileList object
    var file = fileList[0];
    var fileName = file.name;
    if (fileName.length < 4 || fileName.substr(fileName.length-4, 4).toLowerCase() !== ".xsl"){
       $("#info".concat(evt.target.id)).html(alertNode
          ("danger", "The XSL file was not processed. Please make sure that the file ends with \".xsl\"."));
    }
    else if (file.type != 'text/xml'){
       $("#info".concat(evt.target.id)).html(alertNode
          ("danger", "The XSL file was not processed. Please make sure that it is the correct file type."));
    }
    else{
       $("#info".concat(evt.target.id)).html('<h4>Loading file:</h4>' + fileInformationList(file));
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
       xslReader.readAsText(file);
    }
}

function transformXmlXsl(evt){
	$("#button2").css("visibility", "hidden");
	$("#infobutton2").html("");
	try{
      var processor = new XSLTProcessor();
      $("#info".concat(evt.target.id)).html("Processing...");
      processor.importStylesheet(xslfile);
      transformedXmlFile = processor.transformToDocument(xmlfile);
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
