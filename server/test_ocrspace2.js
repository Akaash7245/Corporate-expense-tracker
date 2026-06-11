const fs = require('fs');

async function testOCRSpace() {
  try {
    const formData = new FormData();
    const fileBuffer = fs.readFileSync('../uploads/1780155225441-621667155.jpeg');
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    formData.append('file', blob, 'receipt.jpg');
    formData.append('isOverlayRequired', 'false');
    formData.append('isTable', 'true');
    formData.append('scale', 'true');
    formData.append('detectOrientation', 'true');
    formData.append('OCREngine', '2'); // Test Engine 2
    
    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': 'helloworld'
      },
      body: formData
    });
    
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}
testOCRSpace();
