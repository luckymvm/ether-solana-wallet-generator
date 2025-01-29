const { ethers } = require("ethers");
const { Keypair } = require("@solana/web3.js");
const ExcelJS = require('exceljs');
const readline = require('readline');
const fs = require("fs");

// Генерация Ethereum (EVM) кошелька
function generateEVMWallet() {
	const wallet = ethers.Wallet.createRandom();
	return {
		address: wallet.address,
		privateKey: wallet.privateKey,
	};
}

// Генерация Solana кошелька
function generateSolanaWallet() {
	const keypair = Keypair.generate();
	return {
		address: keypair.publicKey.toBase58(),
		privateKey: Buffer.from(keypair.secretKey).toString("hex"),
	};
}

// Сохранение кошельков в файл
// type evm or solana
function saveWalletsToFile(type, wallets) {
	const data = wallets.map((wallet, index) => `Wallet ${index + 1}:
  Address: ${wallet.address}
  Private Key: ${wallet.privateKey}
`).join("\n");
	const fileName = type === 'evm' ? 'evm_wallets_data.txt' : 'solana_wallets_data.txt';
	const privateKeys = wallets.map(w => w.privateKey);

	if (type == 'evm') {
		const publicKeys = wallets.map(w => w.address);
		generateExcel(publicKeys).catch(e => console.error(e));
		fs.writeFileSync('evmWallets.txt', privateKeys.join('\n'), 'utf8');
	} else {
		fs.writeFileSync('wallets.txt', privateKeys.join('\n'), 'utf8');
	}

	fs.writeFileSync(fileName, data, "utf8");
	console.log(`Кошельки сохранены в файл: ${fileName}`);
}

async function generateExcel(publicKeys) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Address');

  // Добавление заголовка
  worksheet.columns = [{ header: 'Address', key: 'address' },
   { header: 'AddressName(optional)', key: 'name' }
	];

  publicKeys.forEach(pk => worksheet.addRow({address: pk}));

  // Сохранение файла
  await workbook.xlsx.writeFile('template.xlsx');
  console.log('Файл template.xlsx создан!');
}

// Генерация и вывод результатов
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

	saveWalletsToFile('evm', evmWallets);
	saveWalletsToFile('solana', solanaWallets);
}

main();
