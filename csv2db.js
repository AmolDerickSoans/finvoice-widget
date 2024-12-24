const fs = require('fs');
const csv = require('csv-parser');

function csvToJson(csvFilePath, jsonFilePath) {
    return new Promise((resolve, reject) => {
        const results = { stocks: [] };
        let lineCount = 0;

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                lineCount++;
                const symbol = row['SYMBOL'] ? String(row['SYMBOL']).trim() : null;
                const companyName = row['NAME OF COMPANY'] ? String(row['NAME OF COMPANY']).trim() : null;

                if (symbol && companyName) {
                    results.stocks.push({
                        ticker: symbol,
                        name: companyName,
                    });
                    console.log(`Converted: ${symbol} - ${companyName}`);
                }
            })
            .on('end', () => {
                console.log(`Total number of lines: ${lineCount}`);
                fs.writeFile(jsonFilePath, JSON.stringify(results, null, 4), (err) => {
                    if (err) {
                        reject(`Error writing to JSON file: ${err}`);
                    } else {
                        console.log(`Successfully converted '${csvFilePath}' to '${jsonFilePath}'`);
                        resolve();
                    }
                });
            })
            .on('error', (err) => {
                reject(`Error reading or parsing CSV file: ${err}`);
            });
    });
}

// Example Usage:
const csvFile = 'EQUITY_L.csv';
const jsonFile = 'db.json';

csvToJson(csvFile, jsonFile)
  .then(() => {
        console.log("Conversion Complete");
    })
    .catch((error) => {
        console.error("Error during conversion:", error);
    });