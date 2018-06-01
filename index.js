const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const fs = require('fs');
const os = require('os');

function mount(srcPath, mountPath, options) {
    return new Promise((resolve, reject) => {
        ensureDirExists(srcPath);
        ensureDirExists(mountPath);
        moduleArgs = ['key=passphrase:passphrase_passwd_fd=0', 'no_sig_cache'];
        // TODO: validate all params
        if (options.encryption) {
            moduleArgs.push(`ecryptfs_cipher=${options.encryption}`);
        }

        if (options.ecryptfsKeyBytes) {
            moduleArgs.push(`ecryptfs_key_bytes=${options.ecryptfsKeyBytes}`);
        }

        if (options.ecryptfsEnableFilenameCrypto) {
            moduleArgs.push(`ecryptfs_enable_filename_crypto=${options.ecryptfsEnableFilenameCrypto}`);
        }

        if (options.ecryptfsPassthrough) {
            moduleArgs.push(`ecryptfs_passthrough=${options.ecryptfsPassthrough}`);
        }

        const args = ['mount', '-t', 'ecryptfs', '-o', moduleArgs.join(','), srcPath, mountPath];
        spawnProcess = spawn('bash', [], { stdio: 'pipe' });
        spawnProcess.stdin.write(`echo  "passphrase_passwd=${options.password}" | sudo ${args.join(" ")}` + os.EOL);
        spawnProcess.stdin.end();

        let stdout = "";
        let stderr = "";
        spawnProcess.stderr.on("data", data => stdout += data.toString());
        spawnProcess.stdout.on("data", data => stderr += data.toString());
        spawnProcess.on('close', (code) => {
            if (code === 0) {
                return resolve({ code, stdout, stderr });
            }

            reject({ code, stdout, stderr });
        });
    });
}

function umount(src) {
    return new Promise((resolve, reject) => {
        const proc = exec(`sudo umount ${src}`, (error, stdout, stderr) => {
            if (error) {
                return reject({ error, stdout, stderr });
            }

            resolve({ stdout, stderr });
        });
    });
}

function ensureDirExists(src) {
    if (!fs.existsSync(src)) {
        fs.mkdirSync(src);
    }
}

module.exports = {
    mount,
    umount
};