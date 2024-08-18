function placeOrder(orderData) {
  Logger.log('placeOrder function called with data: ' + JSON.stringify(orderData));

  if (!orderData || !orderData.itemName || !orderData.quantity) {
    Logger.log('Order data is missing or incorrect: ' + JSON.stringify(orderData));
    return "Order data is missing or incorrect.";
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('シート1');
  if (!sheet) {
    Logger.log('Sheet not found. Please check the sheet name.');
    return "Sheet not found. Please check the sheet name.";
  }

  var userEmail = orderData.userEmail;
  
  var prices = {
    "たこ焼き": 500,
    "焼きそば": 400,
    "お好み焼き": 600,
    "ソフトドリンク": 200
  };
  
  var preparationTimes = {
    "たこ焼き": 3,   // 3分
    "焼きそば": 8,   // 8分
    "お好み焼き": 6, // 6分
    "ソフトドリンク": 1 // 1分
  };

  var totalAmount = prices[orderData.itemName] * orderData.quantity;
  var preparationTime = preparationTimes[orderData.itemName] * orderData.quantity;
  
  var now = new Date();
  var availableTime = new Date(now.getTime() + preparationTime * 60000); // 現在の時間に準備時間を加算

  sheet.appendRow([
    now,
    userEmail,
    orderData.itemName,
    orderData.quantity,
    totalAmount
  ]);

  Logger.log('Order placed successfully by ' + userEmail);

  // 注文者にメールを送信
  var subject = '注文が確定しました';
  var body = 'ご注文ありがとうございます。\n\n' +
             '注文内容:\n' +
             '商品名: ' + orderData.itemName + '\n' +
             '数量: ' + orderData.quantity + '\n' +
             '合計金額: ' + totalAmount + ' 円\n\n' +
             'ご注文いただきありがとうございました。\n' +
             '提供可能な時間: ' + Utilities.formatDate(availableTime, Session.getScriptTimeZone(), 'HH:mm') + '\n';

  MailApp.sendEmail(userEmail, subject, body);
  Logger.log('Confirmation email sent to ' + userEmail + ' with available time ' + availableTime);

  return "Order placed successfully by " + userEmail;
}


function getOrders() {
  Logger.log('getOrders function called');

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('シート1');
  if (!sheet) {
    Logger.log('Sheet not found.');
    return [];
  }

  var data = sheet.getDataRange().getValues();
  Logger.log('Data retrieved from sheet: ' + JSON.stringify(data));

  if (data.length > 1) {
    data.shift();  // ヘッダー行を削除
    return data;   // データを返す
  } else {
    Logger.log('No data found in the sheet.');
    return [];
  }
}

function getUserEmail() {
  return Session.getActiveUser().getEmail();
}


function doGet(e) {
  Logger.log('doGet function called');
  
  if (!e || !e.parameter) {
    Logger.log('No parameters passed to doGet');
    return HtmlService.createHtmlOutputFromFile('customer.html');
  }

  var page = e.parameter.page;
  Logger.log('Page parameter received: ' + page);

  if (page == 'restaurant') {
    return HtmlService.createHtmlOutputFromFile('restaurant.html');
  } else {
    return HtmlService.createHtmlOutputFromFile('customer.html');
  }
}
