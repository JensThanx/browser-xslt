// ###### methods which deal with XML structures ######

// Parse a string to receive a JavaScript XML object (allows DOM operations).
// Compatible with some IEx, FF, Chrome.
// @param xmlStr: the string that should be transformed to an object
// @return: the XML-object created from a string
// credits to "Tim Down", posted on StackOverflow
var parseXml;
// for all browsers which have a "DOMParser"
if (typeof window.DOMParser != "undefined") {
   parseXml = function(xmlStr) {
      var dom = new window.DOMParser().parseFromString(xmlStr, "text/xml");
      // check if errors occured during parsing
      if(isParseError(dom)) {
         throw new Error('Error parsing XML');
      }
         return dom;
   };
} 
// for IEx
// note that there is no special error check for IEx
else if (typeof window.ActiveXObject != "undefined" &&
       new window.ActiveXObject("Microsoft.XMLDOM")) {
    parseXml = function(xmlStr) {
        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlStr);
        return xmlDoc;
    };
// the browser is not supported
} else {
    throw new Error("No XML parser found");
}

// Asynchronously load an XML file from anywhere (@fileName) ...
// and execute a method when asynch load is complete (@asyncReceiver).
// credits in part to w3schools.com
function loadXMLDoc(fileName, asyncReceiver) {
   var xmlhttp;
   if (typeof window.XMLHttpRequest != "undefined") {
       xmlhttp = new XMLHttpRequest();
   } 
   else if (typeof window.ActiveXObject != "undefined" &&
       new window.ActiveXObject("Microsoft.XMLHTTP"))
   {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   }
   else {
      throw new Error("No http request possible with your browser.");
   }
   xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
         asyncReceiver(xmlhttp);
      }
   };
   xmlhttp.open("GET", fileName, true);
   xmlhttp.send();
}

// checks an XML document which was parsed by a browser (other than IEx).
// It will return "true" if an error was found during parsing.
// credits to "cspotcode", posted on Stackoverflow
function isParseError(parsedDocument) {
    // parser and parsererrorNS could be cached on startup for efficiency (cspotcode)
    var parser = new DOMParser(),
        errorneousParse = parser.parseFromString('<', 'text/xml'),
        parsererrorNS = errorneousParse.getElementsByTagName("parsererror")[0].namespaceURI;

    if (parsererrorNS === 'http://www.w3.org/1999/xhtml') {
        // In PhantomJS the parseerror element doesn't seem to have a special namespace, so we are just guessing here :( (cspotcode)
        return parsedDocument.getElementsByTagName("parsererror").length > 0;
    }

    return parsedDocument.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0;
};





// ###### functions that create UI elements ######

// creates a visual alert message (content: @message) to a designated area (#alertspace)
function alert(alertLevel, message){
   $( "#alertspace" ).append( alertNode ( alertLevel, message ) );
};

// creates a visual alert message (content: @message) and returns this div-node
// possible alert levels are: "success", "warning", "danger" and "info" (default)
function alertNode( alertLevel, message ){
   // "alert" is our return value
   var alert = document.createElement( "div" );

   if (
      alertLevel != "success" &&
      alertLevel != "warning" &&
      alertLevel != "danger" 
      )
      alertLevel = "info";

   // set the class of the returned node, using the bootstrap defaults for alert nodes
   alert.className = "alert alert-"+alertLevel;

   // creating a visible "×" element for the user to remove the alert message
   var close = document.createElement("a");
   close.className = "close";
   close.setAttribute("href", "#");
   close.setAttribute("data-dismiss", "alert");
   close.setAttribute("aria-label", "close");
   close.appendChild(document.createTextNode("×"));
   alert.appendChild(close);

   alert.appendChild(document.createTextNode(message));

   return alert;
};

// creates a list of file information and return a string (formatting as ul-node)
function fileInformationList(file){
   
   var output = [];
   
   output.push('<ul><li><strong>', escape(file.name), '</strong></li><li>', file.type || 'n/a', '</li><li>',
               file.size, ' bytes</li><li>last modified: ',
               file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a',
               '</li></ul>');
   
   return output.join('');                  
}





// ###### other helper functions ######

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
