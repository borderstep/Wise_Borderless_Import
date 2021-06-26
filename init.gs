//////////////////////////////////
// SCOPE VARIABLES
var documentProperties = PropertiesService.getDocumentProperties();
var APIkey;
var ui = SpreadsheetApp.getUi();
function alertFunction(msg) {ui.alert(msg)}
// RUN ON INSTALL
function onInstall() {
  documentProperties.setProperty("APIkey", "")
  onOpen();
}
// RUN ON OPEN
function onOpen() {
  var item = ui.createMenu("Wise").addItem("Import borderless statement", 'runApp');
  item.addToUi();
}
// RUN APP
function runApp() {
  function runHtml() {
    html = HtmlService.createTemplateFromFile("sidebar")
      .evaluate()
      .setTitle("Wise Borderless Statement Import");
      ui.showSidebar(html);
  }
  var documentKey = documentProperties.getProperty("APIkey");
  if (documentKey == null || documentKey == "") {
    var result = ui.prompt(
        'Let\'s connect',
        'Please enter your Wise API key with Read permissions',
        ui.ButtonSet.OK_CANCEL);
    APIkey = result.getResponseText();
    documentProperties.setProperty('APIkey', APIkey);
    var idRequestSuccess = requestIdData();
    if (idRequestSuccess == true) {
      runHtml()
    } else {
      documentProperties.setProperty("APIkey", "")
      var result = ui.alert(
        'Authentication failed.',
        'Try again?',
          ui.ButtonSet.YES_NO);
      if (result == ui.Button.YES) {
        runApp();
      }
    }
  } else {
    runHtml()
  }

}
