const Tesseract = require('tesseract.js');
const fs = require('fs');

async function test() {
  console.log('Starting OCR test...');
  try {
    const { data: { text } } = await Tesseract.recognize(
      '../uploads/1780155225441-621667155.jpeg',
      'eng'
    );
    console.log('--- OCR TEXT ---');
    console.log(text);
    console.log('----------------');
    
    // Test parsing logic
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    let merchant = 'Unknown Merchant';
    if (lines.length > 0) {
      const firstLines = lines.slice(0, 3).filter(l => !/^(receipt|bill|invoice|tax|cash)$/i.test(l));
      if (firstLines.length > 0) merchant = firstLines[0];
    }
    
    console.log('MERCHANT:', merchant);

    let amount = 0.0;
    const amountRegex = /[\$£€Rs\s]*(\d+[\.,]\d{2})/i;
    let maxAmount = 0.0;
    for (let line of lines) {
      if (line.toLowerCase().includes('total') || line.toLowerCase().includes('amount')) {
        const match = line.match(amountRegex) || line.match(/(\d+[\.,]\d{2})/);
        if (match) {
          const val = parseFloat(match[1].replace(',', '.'));
          if (val > amount) amount = val;
        }
      }
      const anyMatch = line.match(/(\d+[\.,]\d{2})/);
      if (anyMatch) {
         const val = parseFloat(anyMatch[1].replace(',', '.'));
         if (val > maxAmount) maxAmount = val;
      }
    }
    if (amount === 0.0) amount = maxAmount;
    
    console.log('AMOUNT:', amount);

    let dateStr = new Date().toISOString().split('T')[0];
    const dateRegexes = [
      /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/,
      /(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/
    ];
    for (let line of lines) {
      for (let regex of dateRegexes) {
        const match = line.match(regex);
        if (match) {
          try {
            let d = parseInt(match[1], 10);
            let m = parseInt(match[2], 10) - 1;
            let y = parseInt(match[3], 10);
            if (y < 100) y += 2000;
            const parsedDate = new Date(y, m, d);
            if (!isNaN(parsedDate.getTime())) {
              dateStr = parsedDate.toISOString().split('T')[0];
              break;
            }
          } catch (e) {}
        }
      }
    }
    console.log('DATE:', dateStr);
    
  } catch (err) {
    console.error(err);
  }
}
test();
