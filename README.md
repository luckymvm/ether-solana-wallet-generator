# 📄 **Generation and Saving of Cryptocurrency Wallets (Ethereum & Solana)**  

To work, you need Node.js version >22  
Link:  
https://nodejs.org/en/download

## 📥 **Installation**  
```
npm install
```

## 📥 **Running**  
```
node main.js <number_of_wallets>
```
## 📥 **Example**  
```
node main.js 20
```

- `evm_wallets_data.txt` — contains public and private keys for Ethereum.  
- `evm_wallets_sheet.xlsx` — contains spreadsheet in the format (Number / Network / Public key / Private key) for Ethereum.
- `solana_wallets_data.txt` — contains public and private keys for Solana.  
- `solana_wallets_sheet.txt` — contains spreadsheet in the format (Number / Network / Public key / Private key) for Solana.
- `evmWallets.txt` — contains only private keys for Ethereum.  
- `wallets.txt` — contains only private keys for Solana.  
- `OKXtemplate.xlsx` — Excel file with public Ethereum addresses.  
**The Excel file is needed for the whitelist on OKX.**