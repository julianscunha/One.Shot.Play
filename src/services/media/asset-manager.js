const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

class AssetManager {
  constructor() {
    this.cache = new Map();
    this.basePath = path.join(__dirname, '../../uploads');
  }

  async obterAsset(tipo, identificador) {
    const cacheKey = `${tipo}:${identificador}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const assetPath = path.join(this.basePath, tipo, identificador);
    const exists = await fs.access(assetPath).then(() => true).catch(() => false);

    if (!exists) {
      return null;
    }

    this.cache.set(cacheKey, assetPath);
    return assetPath;
  }

  async otimizarImagem(inputPath, outputPath, options = {}) {
    const { quality = 80, width = 1280 } = options;

    await sharp(inputPath)
      .resize(width, null, { withoutEnlargement: true })
      .jpeg({ quality })
      .toFile(outputPath);

    return outputPath;
  }

  async otimizarVideo(inputPath, outputPath, options = {}) {
    const { resolution = '1080p', bitrate = '2M' } = options;

    const { spawn } = require('child_process');
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-i', inputPath,
        '-vf', `scale=-2:${resolution === '4k' ? 2160 : resolution === '1080p' ? 1080 : 720}`,
        '-b:v', bitrate,
        '-c:a', 'aac',
        '-b:a', '128k',
        outputPath
      ]);

      ffmpeg.on('close', (code) => {
        if (code === 0) resolve(outputPath);
        else reject(new Error(`FFmpeg falhou com código ${code}`));
      });
    });
  }
}

module.exports = { AssetManager };
