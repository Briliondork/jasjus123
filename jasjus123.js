const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const pino = require('pino'); // Tambahkan pino
const { DisconnectReason, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const makeWASocket = require("@whiskeysockets/baileys").default;

// Buat logger dengan level minimal "warn"
const logger = pino({ level: 'warn' });

// Fungsi untuk menghapus informasi autentikasi
function deleteAuthInfo() {
    const authPath = path.join(__dirname, 'auth_info_baileys');
    if (fs.existsSync(authPath)) {
        fs.rmSync(authPath, { recursive: true, force: true });
        console.log(chalk.green("✅ JASJUS123: Anda berhasil logout dari whatsapp."));
    } else {
        console.log(chalk.red("❌ JASJUS123: Folder 'auth_info_baileys' tidak ditemukan."));
    }
}

// Logika utama untuk mengelola koneksi WhatsApp
async function connectionLogic() {
    console.log(chalk.blue("🔄 JASJUS123: Memulai koneksi..."));
    const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        logger, // Gunakan logger dari pino
    });

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update || {};
        if (qr) {
            console.log(chalk.green("📲 JASJUS123: Pindai QR ini Untuk Mulai."));
            console.log(qr);
        }

        if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log(chalk.yellow("⚠️ JASJUS123: Koneksi terputus. Menghubungkan kembali..."));
                connectionLogic();
            } else {
                console.log(chalk.red("❌ JASJUS123: Anda telah keluar. Tidak akan mencoba menghubungkan kembali."));
            }
        }

        if (connection === "open") {
            console.log(chalk.blue("✅ JASJUS123: Koneksi berhasil dibuka."));
            const numbersFilePath = path.join(__dirname, 'data.txt');
            if (!fs.existsSync(numbersFilePath)) {
                console.log(chalk.red("❌ JASJUS123: File 'data.txt' tidak ditemukan. Mohon sediakan file tersebut."));
                return;
            }

            const numbersToCheck = fs.readFileSync(numbersFilePath, 'utf8').split('\n');
            let totalChecked = 0;
            let totalExists = 0;
            let totalNotExists = 0;

            for (const number of numbersToCheck) {
                if (number.trim()) {
                    totalChecked++;
                    const exists = await checkNumberOnWhatsApp(sock, number.trim());
                    if (exists) totalExists++;
                    else totalNotExists++;
                }
            }

            console.log(chalk.green(`✅ JASJUS123: Pemindaian selesai. Total ${totalChecked} nomor diproses.`));
            console.log(chalk.green(`   - ${totalExists} nomor terdaftar di WhatsApp.`));
            console.log(chalk.green(`   - ${totalNotExists} nomor TIDAK terdaftar di WhatsApp.`));
            console.log(chalk.green("📁 JASJUS123: Hasil pemindaian disimpan di file 'Hasil_Scan.csv'."));
        }
    });

    sock.ev.on("creds.update", saveCreds);
}

// Fungsi untuk memeriksa apakah nomor terdaftar di WhatsApp
async function checkNumberOnWhatsApp(sock, id) {
    const [result] = await sock.onWhatsApp(id);
    const csvFilePath = path.join(__dirname, 'Hasil_Scan.csv');
    let logMessage = '';

    if (result?.exists) {
        console.log(chalk.green(`✅ JASJUS123: ${id} terdaftar di WhatsApp.`));
        logMessage = `${id},Terdaftar di WhatsApp,\n`;
        fs.appendFileSync(csvFilePath, logMessage);
        return true;
    } else {
        console.log(chalk.red(`❌ JASJUS123: ${id} TIDAK terdaftar di WhatsApp.`));
        logMessage = `${id},Tidak terdaftar di WhatsApp,\n`;
        fs.appendFileSync(csvFilePath, logMessage);
        return false;
    }
}

// Menangani argumen command-line
const args = process.argv.slice(2);
if (args[0] === "start") {
    connectionLogic();
} else if (args[0] === "delete") {
    deleteAuthInfo();
} else {
    console.log(chalk.red('❌ JASJUS123: Argumen tidak valid. Gunakan "start" atau "delete".'));
}
