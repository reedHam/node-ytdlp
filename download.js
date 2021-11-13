const spawn = require('child_process').spawn;

/**
 * @param {string} url Target URL.
 * @param {string} workingDir Working directory.
 * @param {Object} options Any passed options overwrite the values in the config file.
 * @see {@link https://github.com/yt-dlp/yt-dlp} repository for ytdlp configuration documentation.
 * @param {Boolean} logging Whether to enable logging.
 * @example 
 *  await download('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '.', {
 *      '--config-location': './config.conf',
 *      '-j': true
 *  }, false);
 * @returns {Promise<void>}
 */
async function download(url, workingDir, options, logging = false) {
    return new Promise((resolve, reject) => {
        const config = [];

        if (options) {
            for (const [key, value] of Object.entries(options)) {
                config[key] = value;
            }
        }

        const args = [];
        for (const [key, value] of Object.entries(config)) {
            args.push(key);
            if (value !== true) {
                args.push(`${value}`);
            }
        }
        args.unshift(url);
        console.log(args);

        const ytdlp = spawn('./yt-dlp', args, {
            cwd: workingDir
        });
        
        ytdlp.stdout.on('data', data => {
            if (logging === true) {
                console.log(data.toString());
            }
        });

        ytdlp.stderr.on('data', data => {
            if (logging === true) {
                console.error(`${data}`);
            }
        });

        ytdlp.on('close', code => {
            if (code !== 0) {
                reject(`yt-dlp exited with code ${code}`);
            }
            resolve(code);
        });
    });
}
