// ════════════════════════════════════════════════
//  BITACORA_PAGOS — Apps Script con soporte JSONP
//  Pega este código en tu Apps Script y republica
// ════════════════════════════════════════════════

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('BITACORA_PAGOS');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue; // saltar filas vacías
    const obj = {};
    headers.forEach((h, j) => { obj[h] = row[j]; });
    rows.push(obj);
  }

  const payload = JSON.stringify({
    data: rows,
    updated: new Date(),
    total: rows.length
  });

  // Soporte JSONP: si viene ?callback=nombreFuncion
  const callback = e && e.parameter && e.parameter.callback;
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + payload + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  // Sin callback: JSON normal
  return ContentService
    .createTextOutput(payload)
    .setMimeType(ContentService.MimeType.JSON);
}
