const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'server/seed.js');
let seedJs = fs.readFileSync(seedPath, 'utf8');

// 1. We replace the expenseTemplates block with one that has realistic merchants tied to each template
const newTemplates = `    const expenseTemplates = [
      // Travel — varied price ranges
      { title: 'IndiGo flight BLR–DEL for client demo', category: 'Travel', min: 4500, max: 9800, merchants: ['IndiGo Airlines', 'MakeMyTrip'] },
      { title: 'Shatabdi Express Mumbai–Pune', category: 'Travel', min: 750, max: 1650, merchants: ['IRCTC'] },
      { title: 'Vistara flight HYD–BLR — sprint review', category: 'Travel', min: 5200, max: 11500, merchants: ['Vistara', 'Cleartrip'] },
      { title: 'Rajdhani Express Delhi–Kolkata', category: 'Travel', min: 2200, max: 4200, merchants: ['IRCTC'] },
      { title: 'Air India flight DEL–MAA roundtrip', category: 'Travel', min: 7500, max: 16000, merchants: ['Air India', 'MakeMyTrip'] },
      { title: 'SpiceJet flight BOM–GOI — offsite', category: 'Travel', min: 3200, max: 7500, merchants: ['SpiceJet', 'Goibibo'] },
      { title: 'Bus Bangalore–Mysore — factory visit', category: 'Travel', min: 450, max: 1100, merchants: ['RedBus', 'KSRTC'] },

      // Food & Dining
      { title: 'Client lunch at ITC Grand Chola', category: 'Food & Dining', min: 2800, max: 6500, merchants: ['ITC Hotels'] },
      { title: 'Team dinner — sprint celebration', category: 'Food & Dining', min: 5000, max: 14000, merchants: ['Barbeque Nation', 'Mainland China'] },
      { title: 'Working lunch — Swiggy order for team', category: 'Food & Dining', min: 800, max: 2200, merchants: ['Swiggy'] },
      { title: 'Chai and samosa — vendor meeting', category: 'Food & Dining', min: 150, max: 450, merchants: ['Chai Point', 'Haldiram\\'s'] },
      { title: 'Client dinner at Barbeque Nation', category: 'Food & Dining', min: 3500, max: 9000, merchants: ['Barbeque Nation'] },
      { title: 'Coffee with prospect — Starbucks', category: 'Food & Dining', min: 500, max: 1200, merchants: ['Starbucks India'] },
      { title: 'Team breakfast — Haldiram\\'s catering', category: 'Food & Dining', min: 1500, max: 4000, merchants: ['Haldiram\\'s'] },
      { title: 'Farewell party dinner — departing intern', category: 'Food & Dining', min: 3000, max: 7000, merchants: ['Zomato', 'Swiggy'] },

      // Office Supplies
      { title: 'HP LaserJet cartridges × 3', category: 'Office Supplies', min: 2500, max: 5500, merchants: ['Amazon India', 'Reliance Digital'] },
      { title: 'Dell USB-C monitor — WFH setup', category: 'Office Supplies', min: 14000, max: 24000, merchants: ['Croma Electronics', 'Dell Exclusive Store'] },
      { title: 'Whiteboard markers, sticky notes, pens', category: 'Office Supplies', min: 250, max: 900, merchants: ['Crossword Bookstore', 'BigBasket'] },
      { title: 'Laptop stand + keyboard + mouse — Amazon', category: 'Office Supplies', min: 3000, max: 6500, merchants: ['Amazon India', 'Flipkart'] },
      { title: 'Office chairs × 2 — new joiners', category: 'Office Supplies', min: 8000, max: 18000, merchants: ['Urban Company', 'Pepperfry'] },
      { title: 'Printer paper and binders — quarterly', category: 'Office Supplies', min: 400, max: 1200, merchants: ['Amazon India'] },

      // Accommodation
      { title: 'Taj Vivanta Bangalore — 2 nights', category: 'Accommodation', min: 12000, max: 22000, merchants: ['Taj Hotels'] },
      { title: 'OYO Townhouse Pune — 3 nights', category: 'Accommodation', min: 4500, max: 9000, merchants: ['OYO Rooms'] },
      { title: 'ITC Maurya Delhi — 2 nights onsite', category: 'Accommodation', min: 16000, max: 32000, merchants: ['ITC Hotels'] },
      { title: 'Lemon Tree Hyderabad — client visit', category: 'Accommodation', min: 5000, max: 10000, merchants: ['Lemon Tree Hotels'] },
      { title: 'Novotel Mumbai — conference stay', category: 'Accommodation', min: 9000, max: 18000, merchants: ['Novotel Hotels'] },
      { title: 'Airbnb Goa — team offsite (3 rooms)', category: 'Accommodation', min: 15000, max: 35000, merchants: ['Airbnb India'] },

      // Transportation
      { title: 'Ola cab — Hinjewadi to Pune airport', category: 'Transportation', min: 350, max: 800, merchants: ['Ola Cabs'] },
      { title: 'Uber to Kempegowda Airport BLR', category: 'Transportation', min: 500, max: 1200, merchants: ['Uber India'] },
      { title: 'Rapido bike — Koramangala to Whitefield', category: 'Transportation', min: 100, max: 280, merchants: ['Rapido'] },
      { title: 'Airport transfer Mumbai T2 to Andheri', category: 'Transportation', min: 400, max: 900, merchants: ['Uber India', 'Ola Cabs'] },
      { title: 'Auto-rickshaw — local site visits × 5', category: 'Transportation', min: 200, max: 500, merchants: ['Cash Payment', 'Local Auto'] },
      { title: 'Self-drive car rental — 3 days Jaipur', category: 'Transportation', min: 4500, max: 9000, merchants: ['Zoomcar'] },
      { title: 'Metro card recharge — monthly', category: 'Transportation', min: 500, max: 1500, merchants: ['Delhi Metro', 'Namma Metro'] },

      // Communication
      { title: 'Jio postpaid plan — work number', category: 'Communication', min: 599, max: 999, merchants: ['Jio Recharge'] },
      { title: 'Airtel broadband — WFH monthly', category: 'Communication', min: 999, max: 1499, merchants: ['Airtel'] },
      { title: 'International ISD charges — US client calls', category: 'Communication', min: 250, max: 750, merchants: ['Airtel', 'Jio Recharge'] },
      { title: 'Zoom Pro subscription — monthly', category: 'Communication', min: 1100, max: 1400, merchants: ['Zoom Video Communications'] },

      // Entertainment
      { title: 'Team outing — bowling + lunch', category: 'Entertainment', min: 3500, max: 9000, merchants: ['Smaaash', 'Amoeba'] },
      { title: 'IPL match tickets × 4 — client entertainment', category: 'Entertainment', min: 8000, max: 20000, merchants: ['BookMyShow'] },
      { title: 'Team building — escape room activity', category: 'Entertainment', min: 4000, max: 10000, merchants: ['Mystery Rooms'] },
      { title: 'Diwali celebration — office party', category: 'Entertainment', min: 6000, max: 15000, merchants: ['Haldiram\\'s', 'Amazon India'] },
      { title: 'Movie outing — team bonding', category: 'Entertainment', min: 2000, max: 5000, merchants: ['PVR Cinemas', 'INOX'] },

      // Miscellaneous
      { title: 'BlueDart courier — documents to client', category: 'Miscellaneous', min: 200, max: 700, merchants: ['BlueDart'] },
      { title: 'US B1 visa processing fee', category: 'Miscellaneous', min: 13000, max: 16500, merchants: ['US Consulate'] },
      { title: 'Parking charges — Pune IT Park monthly', category: 'Miscellaneous', min: 1500, max: 3000, merchants: ['Pune IT Park'] },
      { title: 'Annual medical checkup — company policy', category: 'Miscellaneous', min: 2000, max: 5000, merchants: ['Apollo Diagnostics', 'Dr. Lal PathLabs'] },
      { title: 'Conference registration — JSConf India', category: 'Miscellaneous', min: 3000, max: 8000, merchants: ['JSConf India'] },
      { title: 'Business cards printing — 500 nos.', category: 'Miscellaneous', min: 800, max: 2000, merchants: ['Vistaprint'] },
      { title: 'Domain renewal + SSL certificate', category: 'Miscellaneous', min: 1200, max: 3500, merchants: ['GoDaddy', 'Namecheap'] },
    ];`;

seedJs = seedJs.replace(/const expenseTemplates = \[[\s\S]*?\];/m, newTemplates);

// 2. We replace the merchant generation logic
const newMerchantLogic = `merchant: template.merchants ? template.merchants[Math.floor(Math.random() * template.merchants.length)] : merchants[Math.floor(Math.random() * merchants.length)],`;
seedJs = seedJs.replace(/merchant: merchants\[Math\.floor\(Math\.random\(\) \* merchants\.length\)\]\,/, newMerchantLogic);

fs.writeFileSync(seedPath, seedJs);
console.log('Seed updated with realistic merchants.');
