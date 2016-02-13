
// Parse a string to receive a JS-XML object (allows DOM operations).
// Compatible with some IEx, FF, Chrome.
// @param xmlStr: the string that should be transformed to an object
// @return: the XML-object created from a string
// credits to "Tim Down", posted on StackOverflow
var parseXml;
if (typeof window.DOMParser != "undefined") {
    parseXml = function(xmlStr) {
       var dom = new window.DOMParser().parseFromString(xmlStr, "text/xml");
       if(isParseError(dom)) {
           throw new Error('Error parsing XML');
       }
           return dom;
    };
} else if (typeof window.ActiveXObject != "undefined" &&
       new window.ActiveXObject("Microsoft.XMLDOM")) {
    parseXml = function(xmlStr) {
        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlStr);
        return xmlDoc;
    };
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

// credits to "cspotcode", posted on Stackoverflow
function isParseError(parsedDocument) {
    // parser and parsererrorNS could be cached on startup for efficiency
    var parser = new DOMParser(),
        errorneousParse = parser.parseFromString('<', 'text/xml'),
        parsererrorNS = errorneousParse.getElementsByTagName("parsererror")[0].namespaceURI;

    if (parsererrorNS === 'http://www.w3.org/1999/xhtml') {
        // In PhantomJS the parseerror element doesn't seem to have a special namespace, so we are just guessing here :(
        return parsedDocument.getElementsByTagName("parsererror").length > 0;
    }

    return parsedDocument.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0;
};