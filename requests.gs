//////////////////////////////////
// PREPARE API REQUEST HEADERS
function prepareParams() {
  var auth = "Bearer ".concat(documentProperties.getProperty('APIkey'));
  var headers = {"Authorization":auth};
  var params = {"method":"GET","headers":headers};
  return params
}
// GET RELEVANT ACCOUNT ID'S
function requestIdData() {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var idFetchA = UrlFetchApp.fetch("https://api.wise.com/v1/profiles", prepareParams());
    profileid = JSON.parse([idFetchA.getContentText()])[0].id;
    var idFetchB = UrlFetchApp.fetch("https://api.wise.com/v1/borderless-accounts?profileId=" + profileid, prepareParams());
    var bless_id = JSON.parse([idFetchB.getContentText()])[0].id;
    documentProperties.setProperty('profile_id', profileid)
    documentProperties.setProperty('borderless_id', bless_id)
    return true
  }
  catch {
    return false
  }
}
// GET TRANSACTION DATA
function requestTxData(beginDate, endDate, currency, side) {
  // PULL AND PREPARE DATA
  var idB = Math.round(documentProperties.getProperty('borderless_id')).toString();
  var borderlessUrl = "https://api.transferwise.com/v1/borderless-accounts/" + idB + "/statement.json?currency=" + currency.toUpperCase() + "&intervalStart=" + beginDate + "T00:00:00.000Z&intervalEnd=" + endDate + "T23:59:59.999Z";
  var response;
  try {
    response = UrlFetchApp.fetch(borderlessUrl, prepareParams());
  }
  catch(err) {
    ui.alert("Please make sure the currency is formatted as a standard 3-letter code.\nFor example: GBP.")
  }
  var statement = [response.getContentText()];
  var JSONObject = JSON.parse(statement);
  var tx = JSONObject.transactions.reverse();
  // SEND DATA TO HANDLING
  if (tx.length > 0) {
    sprayStatement(tx, currency, side);
  }
  else {
    ui.alert("No transactions found for this currency on given timeframe.")
  }
}
// HANDLE TRANSACTION DATA
function sprayStatement(tx, currency, side) {
  var sheet = SpreadsheetApp.getActiveSheet();
  const firstActive = sheet.getActiveCell();
  // sheet.getActiveCell().setValue(currency + " " + side.charAt(0).toUpperCase() + side.slice(1) + "s");
  // sheet.getActiveCell().offset(1, 0).activate();

  for (var i = 0; i < tx.length; i++) {
    if (tx[i].type == side.toUpperCase()) {
      var active = sheet.getActiveCell();
      // DATE
      date = (tx[i].date).toString();
      formattedDate = date.slice(5,7) + "/" + date.slice(8,10) + "/" + date.slice(0,4);
      active.setValue(formattedDate);
      // AMOUNT
      active.offset(0, 1).setValue([tx[i].amount.value]);
      // DESCRIPTION
      var description = tx[i].details.description;
      // MOVE FOCUS CELL
      active.offset(0, 2).setValue(description);
      active.offset(1, 0).activate();
    }
  }
  firstActive.activate();
}
