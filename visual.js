// creates a visual alert message (content: @message) to a designated area (#alertspace)
function alert(alertLevel, message){
   $("#alertspace").append(alertNode(alertLevel, message));
};

// creates a visual alert message (content: @message) and returns this div-node
function alertNode(alertLevel, message){
   var alert = document.createElement("div");
   if (
      alertLevel != "success" &&
      alertLevel != "warning" &&
      alertLevel != "danger" 
      )
      alertLevel = "info";
   alert.className = "alert alert-"+alertLevel;
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

// creates a list of file information and returns this ul-node
function fileInformationList(file){
   var output = [];
   output.push('<ul><li><strong>', escape(file.name), '</strong></li><li>', file.type || 'n/a', '</li><li>',
               file.size, ' bytes</li><li>last modified: ',
               file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a',
               '</li></ul>');
   return output.join('');                  
}
