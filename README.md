# jasjus123 Tools

### Langkah Installasi dan Pengaturan:

1. **Buka Command Prompt (atau PowerShell)** di komputer Anda.

2. **Buat Folder Proyek Baru**: Jalankan perintah berikut untuk membuat folder proyek dan masuk ke dalamnya:
    ```
    mkdir WATOOLS
    cd WATOOLS
    ```

3. **Inisialisasi Proyek Node.js**: Jalankan perintah berikut untuk membuat file `package.json`:
    ```
    npm init -y
    ```

4. **Instalasi Pustaka yang Diperlukan**: Instal paket-paket yang dibutuhkan dengan perintah ini:
    ```
    npm install @whiskeysockets/baileys pino chalk
    ```

5. **Buat File `data.txt`**:
    - Buat file teks bernama `data.txt` di folder yang sama dengan file JavaScript Anda.
    - Masukkan nomor WhatsApp yang ingin Anda cek, satu nomor per baris, seperti ini:
        ```
        628123456789
        628987654321
        ```

### Menjalankan Program:

6. **Mulai Pemindaian Nomor**: Untuk menjalankan program dan mulai memindai nomor-nomor WhatsApp, jalankan perintah berikut di terminal (pastikan Anda berada di folder `WATOOLS`):
    ```
    node jasjus123.js start
    ```

7. **Hapus Data Autentikasi**: Jika Anda ingin menghapus data autentikasi atau keluar dari sesi WhatsApp, jalankan perintah ini:
    ```
    node jasjus123.js delete
    ```
