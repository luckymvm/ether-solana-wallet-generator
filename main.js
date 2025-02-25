const { ethers } = require("ethers");
const { Keypair } = require("@solana/web3.js");
const ExcelJS = require('exceljs');
const bs58 = require('bs58');
const fs = require("fs");

// EVM wallets generation
function generateEVMWallet() {
	const wallet = ethers.Wallet.createRandom();
	return {
		address: wallet.address,
		privateKey: wallet.privateKey,
	};
}

// Solana wallets generation
function generateSolanaWallet() {
	const keypair = Keypair.generate();
	return {
		address: keypair.publicKey.toBase58(),
		privateKey: bs58.encode(keypair.secretKey),
	};
}

// Saving wallets to txt file
// type: evm or solana
function saveWalletsToTextFile(type, wallets) {
	const data = wallets.map((wallet, index) => `Wallet ${index + 1}:
  Address: ${wallet.address}
  Private Key: ${wallet.privateKey}
`).join("\n");
	const fileName = type === 'evm' ? 'evm_wallets_data.txt' : 'solana_wallets_data.txt';
	const privateKeys = wallets.map(w => w.privateKey);

	if (type == 'evm') {
		const publicKeys = wallets.map(w => w.address);
		generateOKXTemplate(publicKeys);
		fs.writeFileSync('evmWallets.txt', privateKeys.join('\n'), 'utf8');
	} else {
		fs.writeFileSync('wallets.txt', privateKeys.join('\n'), 'utf8');
	}

	fs.writeFileSync(fileName, data, "utf8");
	console.log(`Кошельки сохранены в файл: ${fileName}`);
}

async function generateOKXTemplate(publicKeys) {
	try {
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('Address');

		// Adding headers
		worksheet.columns = [{ header: 'Address', key: 'address' },
			{ header: 'AddressName(optional)', key: 'name' }
		];

		publicKeys.forEach(pk => worksheet.addRow({address: pk}));

		// Saving wallets to xlsx file
		await workbook.xlsx.writeFile('OKXtemplate.xlsx');
		console.log('Файл OKXtemplate.xlsx создан!');
	} catch (e) {
		console.error(e);
	}
}

// type: evm or solana
async function saveWalletsToExcelFile(type, wallets) {
	try {
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('Address');
		const fileName = type == 'evm' ? 'evm_wallets_sheet.xlsx' : 'solana_wallets_sheet.xlsx';

		worksheet.columns = [
			{ header: 'Number', key: 'number', },
			{ header: 'Network', key: 'network' },
			{ header: 'Public Key', key: 'publicKey', width: 45 },
			{ header: 'Private Key', key: 'privateKey', width: 60 },
		];

		wallets.forEach(({address, privateKey}, i) => worksheet.addRow({
			number: i + 1,
			network: type == 'evm' ? 'Ethereum' : 'Solana',
			publicKey: address,
			privateKey
		}));

		await workbook.xlsx.writeFile(fileName);
		console.log(`Файл ${fileName} создан!`);
	} catch (e) {
		console.error(e);
	}
}

function main() {
	const numberOfWallets = Number(process.argv[2]);

	const evmWallets = [];
	for (let i = 0; i < numberOfWallets; i++) {
		const evmWallet = generateEVMWallet();
		evmWallets.push(evmWallet);
	}

	const solanaWallets = [];
	for (let i = 0; i < numberOfWallets; i++) {
		const solanaWallet = generateSolanaWallet();
		solanaWallets.push(solanaWallet);
	}

	// .txt
	saveWalletsToTextFile('evm', evmWallets);
	saveWalletsToTextFile('solana', solanaWallets);

	// .xlsx
	saveWalletsToExcelFile('evm', evmWallets);
	saveWalletsToExcelFile('solana', solanaWallets);
}

main();