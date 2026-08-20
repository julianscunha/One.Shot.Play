const OpenAI = require('openai');
const Replicate = require('replicate');
const fs = require('fs').promises;
const path = require('path');
const { pathToFileURL } = require('url');
const axios = require('axios');
const { createLogger } = require('./logger');
const { runFFmpeg, checkFFmpeg, ffmpegInstallHint } = require('./ffmpeg');

class AIVideoGenerator {
  constructor(credentials = {}) {
    this.logger = createLogger('AIVideoGenerator');

    // ============================================================
    // OpenRouter
    // ============================================================

    this.openRouterApiKey =
      credentials.aiProvider?.apiKey ||
      credentials.openrouter?.apiKey ||
      process.env.OPENROUTER_API_KEY;

    this.openRouterBaseURL = 'https://openrouter.ai/api/v1';

    this.openRouterImageModel =
      credentials.openrouter?.imageModel ||
      process.env.OPENROUTER_IMAGE_MODEL ||
      'google/gemini-3.1-flash-image';

    this.openRouterTTSModel =
      credentials.openrouter?.ttsModel ||
      process.env.OPENROUTER_TTS_MODEL ||
      'google/gemini-3.1-flash-tts-preview';

    this.openRouterTTSVoice =
      credentials.openrouter?.ttsVoice ||
      process.env.OPENROUTER_TTS_VOICE ||
      'Kore';

    if (this.openRouterApiKey) {
      this.openrouter = new OpenAI({
        apiKey: this.openRouterApiKey,
        baseURL: this.openRouterBaseURL,
      });

      this.logger.info(
        `OpenRouter initialized (image: ${this.openRouterImageModel}, TTS: ${this.openRouterTTSModel}, voice: ${this.openRouterTTSVoice})`
      );
    } else {
      this.logger.warn(
        'OpenRouter API key not found - OpenRouter media generation unavailable'
      );
    }

    // ============================================================
    // OpenAI - fallback
    // ============================================================

    const openaiKey =
      credentials.openai?.apiKey ||
      process.env.OPENAI_API_KEY;

    if (openaiKey) {
      this.openai = new OpenAI({
        apiKey: openaiKey,
      });

      this.logger.info('OpenAI fallback service initialized');
    }

    // ============================================================
    // Replicate
    // ============================================================

    const replicateKey =
      credentials.replicate?.apiKey ||
      process.env.REPLICATE_API_KEY;

    if (replicateKey) {
      this.replicate = new Replicate({
        auth: replicateKey,
      });

      this.logger.info('Replicate service initialized');
    } else {
      this.logger.warn(
        'Replicate API key not found - advanced video generation unavailable'
      );
    }

    // ============================================================
    // Gemini direct - fallback
    // ============================================================

    const geminiKey =
      credentials.gemini?.apiKey ||
      process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const { GoogleGenAI } = require('@google/genai');

        this.gemini = new GoogleGenAI({
          apiKey: geminiKey,
        });

        this.logger.info(
          'Gemini direct media service initialized (fallback)'
        );
      } catch (error) {
        this.logger.warn(
          'Failed to initialize Gemini media service:',
          error.message
        );
      }
    }

    // ============================================================
    // ElevenLabs
    // ============================================================

    this.elevenLabsApiKey =
      credentials.elevenLabs?.apiKey ||
      process.env.ELEVENLABS_API_KEY;

    this.elevenLabsVoiceId =
      credentials.elevenLabs?.voiceId ||
      process.env.ELEVENLABS_VOICE_ID;

    // ============================================================
    // Azure Speech
    // ============================================================

    this.azureSpeechKey =
      credentials.azure?.speechKey ||
      process.env.AZURE_SPEECH_KEY;

    this.azureSpeechRegion =
      credentials.azure?.speechRegion ||
      process.env.AZURE_SPEECH_REGION;
  }

  // ============================================================
  // TTS
  // ============================================================

  async generateTTSAudio(text, outputPath) {
    this.logger.info('Generating TTS audio...');

    try {
      // OpenRouter is the preferred provider
      if (this.openRouterApiKey) {
        return await this.generateOpenRouterTTS(
          text,
          outputPath
        );
      }

      // ElevenLabs fallback
      if (
        this.elevenLabsApiKey &&
        this.elevenLabsVoiceId
      ) {
        return await this.generateElevenLabsTTS(
          text,
          outputPath
        );
      }

      // OpenAI fallback
      if (this.openai) {
        return await this.generateOpenAITTS(
          text,
          outputPath
        );
      }

      // Direct Gemini fallback
      if (this.gemini) {
        return await this.generateGeminiTTS(
          text,
          outputPath
        );
      }

      return await this.simulateTTSGeneration(
        text,
        outputPath
      );
    } catch (error) {
      this.logger.error(
        `TTS generation failed: ${error.message}`
      );

      throw error;
    }
  }

  async generateOpenRouterTTS(text, outputPath) {
    this.logger.info(
      `Generating TTS with OpenRouter: ${this.openRouterTTSModel} / ${this.openRouterTTSVoice}`
    );

    const response = await axios({
      method: 'POST',
      url: `${this.openRouterBaseURL}/audio/speech`,
      headers: {
        Authorization: `Bearer ${this.openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer':
          'https://github.com/julianscunha/youtube-automation-agent',
        'X-Title': 'YouTube Automation Agent',
      },
      data: {
        model: this.openRouterTTSModel,
        input: text,
        voice: this.openRouterTTSVoice,
        response_format: 'pcm',
      },
      responseType: 'arraybuffer',
      validateStatus: () => true,
    });

    if (response.status < 200 || response.status >= 300) {
      let errorMessage;

      try {
        errorMessage = Buffer.from(
          response.data
        ).toString('utf8');
      } catch {
        errorMessage = 'Unknown OpenRouter TTS error';
      }

      throw new Error(
        `OpenRouter TTS HTTP ${response.status}: ${errorMessage}`
      );
    }

    const audioBuffer = Buffer.from(
      response.data
    );

    if (!audioBuffer.length) {
      throw new Error(
        'OpenRouter TTS returned empty audio data'
      );
    }

    const pcmPath = `${outputPath}.pcm`;

    await fs.writeFile(
      pcmPath,
      audioBuffer
    );

    try {
      // Gemini TTS returns PCM:
      // 24 kHz / mono / signed 16-bit little-endian
      await runFFmpeg([
        '-y',
        '-f',
        's16le',
        '-ar',
        '24000',
        '-ac',
        '1',
        '-i',
        pcmPath,
        '-c:a',
        'aac',
        '-b:a',
        '192k',
        outputPath,
      ]);
    } finally {
      await fs.unlink(pcmPath).catch(() => {});
    }

    const stats = await fs.stat(outputPath);

    if (!stats.isFile() || stats.size === 0) {
      throw new Error(
        'OpenRouter TTS did not produce a valid audio file'
      );
    }

    this.logger.info(
      `OpenRouter TTS generation complete: ${outputPath}`
    );

    return outputPath;
  }

  async generateElevenLabsTTS(text, outputPath) {
    const url =
      `https://api.elevenlabs.io/v1/text-to-speech/${this.elevenLabsVoiceId}`;

    const data = {
      text,
      model_id: 'eleven_v3',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.0,
        use_speaker_boost: true,
      },
    };

    const response = await axios({
      method: 'POST',
      url,
      data,
      headers: {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.elevenLabsApiKey,
      },
      responseType: 'stream',
    });

    const writer =
      require('fs').createWriteStream(outputPath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        this.logger.info(
          'ElevenLabs TTS generation complete'
        );

        resolve(outputPath);
      });

      writer.on('error', reject);
    });
  }

  async generateOpenAITTS(text, outputPath) {
    const response =
      await this.openai.audio.speech.create({
        model: 'gpt-4o-mini-tts',
        voice: 'coral',
        input: text,
        speed: 1.0,
      });

    const buffer = Buffer.from(
      await response.arrayBuffer()
    );

    await fs.writeFile(
      outputPath,
      buffer
    );

    this.logger.info(
      'OpenAI TTS generation complete'
    );

    return outputPath;
  }

  async generateGeminiTTS(text, outputPath) {
    const model =
      process.env.GEMINI_TTS_MODEL ||
      'gemini-3.1-flash-tts-preview';

    const voiceName =
      process.env.GEMINI_TTS_VOICE ||
      'Kore';

    const response =
      await this.gemini.models.generateContent({
        model,
        contents: [
          {
            parts: [{ text }],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName,
              },
            },
          },
        },
      });

    const audioData =
      response.candidates?.[0]
        ?.content?.parts?.[0]
        ?.inlineData?.data;

    if (!audioData) {
      throw new Error(
        'Gemini TTS returned no audio data'
      );
    }

    const pcmPath =
      `${outputPath}.pcm`;

    await fs.writeFile(
      pcmPath,
      Buffer.from(audioData, 'base64')
    );

    try {
      await runFFmpeg([
        '-y',
        '-f',
        's16le',
        '-ar',
        '24000',
        '-ac',
        '1',
        '-i',
        pcmPath,
        '-c:a',
        'aac',
        '-b:a',
        '192k',
        outputPath,
      ]);
    } finally {
      await fs.unlink(pcmPath).catch(() => {});
    }

    this.logger.info(
      'Gemini TTS generation complete'
    );

    return outputPath;
  }

  // ============================================================
  // IMAGE GENERATION
  // ============================================================

  async generateVisualAssets(
    prompt,
    style = 'ethereal',
    count = 1
  ) {
    this.logger.info(
      `Generating ${count} visual assets with style: ${style}`
    );

    try {
      if (
        !this.openRouterApiKey &&
        !this.openai &&
        !this.gemini
      ) {
        return await this.simulateVisualAssets(
          prompt,
          style,
          count
        );
      }

      const enhancedPrompt =
        this.enhanceVisualPrompt(
          prompt,
          style
        );

      const localPaths = [];

      for (let i = 0; i < count; i++) {
        const imagePath = path.join(
          __dirname,
          '..',
          'data',
          'assets',
          `visual_${Date.now()}_${i}.png`
        );

        await this.generateImage(
          enhancedPrompt,
          imagePath
        );

        localPaths.push(imagePath);
      }

      this.logger.info(
        `Generated ${localPaths.length} visual assets`
      );

      return localPaths;
    } catch (error) {
      this.logger.error(
        `Visual asset generation failed: ${error.message}`
      );

      return await this.simulateVisualAssets(
        prompt,
        style,
        count
      );
    }
  }

  async generateImage(prompt, imagePath) {
    await fs.mkdir(
      path.dirname(imagePath),
      { recursive: true }
    );

    // OpenRouter first
    if (this.openRouterApiKey) {
      return await this.generateOpenRouterImage(
        prompt,
        imagePath
      );
    }

    // OpenAI fallback
    if (this.openai) {
      return await this.generateOpenAIImage(
        prompt,
        imagePath
      );
    }

    // Direct Gemini fallback
    if (this.gemini) {
      return await this.generateGeminiImage(
        prompt,
        imagePath
      );
    }

    throw new Error(
      'No image generation provider configured'
    );
  }

  async generateOpenRouterImage(
    prompt,
    imagePath
  ) {
    this.logger.info(
      `Generating image with OpenRouter: ${this.openRouterImageModel}`
    );

    const response = await axios({
      method: 'POST',
      url: `${this.openRouterBaseURL}/images`,
      headers: {
        Authorization: `Bearer ${this.openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer':
          'https://github.com/julianscunha/youtube-automation-agent',
        'X-Title': 'YouTube Automation Agent',
      },
      data: {
        model: this.openRouterImageModel,
        prompt,
        n: 1,
        resolution: '2K',
        aspect_ratio: '16:9',
        quality: 'high',
        output_format: 'png',
      },
      responseType: 'json',
      validateStatus: () => true,
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `OpenRouter image API HTTP ${response.status}: ${JSON.stringify(response.data)}`
      );
    }

    const data = response.data?.data;

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(
        `OpenRouter image API returned no images: ${JSON.stringify(response.data)}`
      );
    }

    const image = data[0];

    if (!image?.b64_json) {
      throw new Error(
        `OpenRouter image API returned no b64_json image data: ${JSON.stringify(image)}`
      );
    }

    const buffer = Buffer.from(
      image.b64_json,
      'base64'
    );

    if (!buffer.length) {
      throw new Error(
        'OpenRouter returned an empty image'
      );
    }

    await fs.writeFile(
      imagePath,
      buffer
    );

    const stats = await fs.stat(
      imagePath
    );

    if (!stats.isFile() || stats.size === 0) {
      throw new Error(
        'OpenRouter image generation produced an invalid file'
      );
    }

    this.logger.info(
      `OpenRouter image generated successfully: ${imagePath} (${stats.size} bytes)`
    );

    return imagePath;
  }

  async generateOpenAIImage(prompt, imagePath) {
    const response =
      await this.openai.images.generate({
        model: 'gpt-image-2',
        prompt,
        n: 1,
        size: '1536x1024',
        quality: 'high',
      });

    if (
      response.data?.[0]?.b64_json
    ) {
      const buffer = Buffer.from(
        response.data[0].b64_json,
        'base64'
      );

      await fs.writeFile(
        imagePath,
        buffer
      );
    } else if (
      response.data?.[0]?.url
    ) {
      await this.downloadImage(
        response.data[0].url,
        imagePath
      );
    } else {
      throw new Error(
        'OpenAI image generation returned no image data'
      );
    }

    return imagePath;
  }

  async generateGeminiImage(
    prompt,
    imagePath
  ) {
    const model =
      process.env.GEMINI_IMAGE_MODEL ||
      'gemini-3.1-flash-image';

    const response =
      await this.gemini.models.generateContent({
        model,
        contents: prompt,
      });

    const parts =
      response.candidates?.[0]
        ?.content?.parts || [];

    const imagePart =
      parts.find(
        part => part.inlineData?.data
      );

    if (!imagePart) {
      throw new Error(
        'Gemini image generation returned no image data'
      );
    }

    await fs.writeFile(
      imagePath,
      Buffer.from(
        imagePart.inlineData.data,
        'base64'
      )
    );

    return imagePath;
  }

  enhanceVisualPrompt(
    prompt,
    style
  ) {
    const styleEnhancements = {
      ethereal:
        'ethereal, dreamy, mystical, soft lighting, floating particles, cosmic background',
      modern:
        'modern, clean, minimalist, professional, sleek design, contemporary',
      animated:
        'animated style, cartoon, vibrant colors, expressive, dynamic',
      cinematic:
        'cinematic lighting, dramatic, movie poster style, high contrast',
      abstract:
        'abstract art, geometric shapes, gradient colors, artistic composition',
    };

    const enhancement =
      styleEnhancements[style] ||
      styleEnhancements.ethereal;

    return `${prompt}, ${enhancement}, high quality, cinematic composition, 16:9 aspect ratio, digital art`;
  }

  async downloadImage(
    url,
    outputPath
  ) {
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'stream',
    });

    const writer =
      require('fs').createWriteStream(
        outputPath
      );

    response.data.pipe(writer);

    return new Promise(
      (resolve, reject) => {
        writer.on(
          'finish',
          resolve
        );

        writer.on(
          'error',
          reject
        );
      }
    );
  }

  // ============================================================
  // VIDEO GENERATION
  // ============================================================

  async generateVideo(
    script,
    visualAssets,
    audioPath,
    outputPath
  ) {
    this.logger.info(
      'Generating video from assets...'
    );

    try {
      // Replicate first if configured
      if (
        this.replicate &&
        this.replicate.auth
      ) {
        return await this.generateReplicateVideo(
          script,
          visualAssets,
          audioPath,
          outputPath
        );
      }

      // Otherwise use local FFmpeg slideshow
      return await this.generateSlideshowVideo(
        script,
        visualAssets,
        audioPath,
        outputPath
      );
    } catch (error) {
      this.logger.error(
        `Video generation failed: ${error.message}`
      );

      return await this.simulateVideoGeneration(
        script,
        visualAssets,
        audioPath,
        outputPath
      );
    }
  }

  async generateReplicateVideo(
    script,
    visualAssets,
    audioPath,
    outputPath
  ) {
    if (
      !visualAssets ||
      visualAssets.length === 0
    ) {
      throw new Error(
        'No visual assets available for Replicate video generation'
      );
    }

    const output =
      await this.replicate.run(
        'wan-video/wan-2.7-i2v',
        {
          input: {
            image: visualAssets[0],
            prompt:
              script.title ||
              'smooth cinematic motion',
            duration: 5,
            resolution: '720p',
          },
        }
      );

    if (
      output &&
      output.length > 0
    ) {
      await this.downloadVideo(
        output[0],
        outputPath
      );

      await this.addAudioToVideo(
        outputPath,
        audioPath,
        outputPath
      );
    } else {
      throw new Error(
        'Replicate returned no video'
      );
    }

    return outputPath;
  }

  async generateSlideshowVideo(
    script,
    visualAssets,
    audioPath,
    outputPath
  ) {
    this.logger.info(
      'Creating slideshow video...'
    );

    if (!(await checkFFmpeg())) {
      throw new Error(
        ffmpegInstallHint()
      );
    }

    const { chromium } =
      require('playwright');

    const browser =
      await chromium.launch();

    const slidesDir =
      path.join(
        path.dirname(outputPath),
        'slides'
      );

    try {
      const page =
        await browser.newPage();

      await page.setViewportSize({
        width: 1920,
        height: 1080,
      });

      const imageAssets =
        await this.filterImageAssets(
          visualAssets
        );

      if (imageAssets.length === 0) {
        throw new Error(
          'No real image assets available for slideshow'
        );
      }

      await page.setContent(
        this.createSlideshowHTML(
          script,
          imageAssets
        )
      );

      await page.addStyleTag({
        content:
          '* { transition: none !important; animation: none !important; }',
      });

      await page.waitForTimeout(
        1000
      );

      const slideCount =
        await page.evaluate(
          () =>
            document.querySelectorAll(
              '.slide'
            ).length
        );

      await fs.mkdir(
        slidesDir,
        { recursive: true }
      );

      const stills = [];

      for (
        let i = 0;
        i < slideCount;
        i++
      ) {
        await page.evaluate(
          index => {
            document
              .querySelectorAll(
                '.slide'
              )
              .forEach(
                (slide, s) => {
                  slide.classList.toggle(
                    'active',
                    s === index
                  );
                }
              );
          },
          i
        );

        const stillPath =
          path.join(
            slidesDir,
            `slide_${String(i).padStart(
              3,
              '0'
            )}.png`
          );

        await page.screenshot({
          path: stillPath,
        });

        stills.push(
          stillPath
        );
      }

      const videoPath =
        outputPath.replace(
          '.mp4',
          '_visual.mp4'
        );

      const duration =
        this.calculateScriptDuration(
          script
        );

      await this.renderSlidesToVideo(
        stills,
        duration,
        videoPath
      );

      await this.addAudioToVideo(
        videoPath,
        audioPath,
        outputPath
      );

      return outputPath;
    } finally {
      await browser.close().catch(
        () => {}
      );

      await this.cleanupDirectory(
        slidesDir
      );
    }
  }

  async renderSlidesToVideo(
    stills,
    totalDuration,
    videoPath
  ) {
    if (
      stills.length === 0
    ) {
      throw new Error(
        'No slides to render'
      );
    }

    const fade = 0.5;

    const perSlide =
      Math.max(
        2,
        totalDuration /
          stills.length
      );

    const args = ['-y'];

    for (
      const still of stills
    ) {
      args.push(
        '-loop',
        '1',
        '-t',
        perSlide.toFixed(2),
        '-framerate',
        '30',
        '-i',
        still
      );
    }

    if (
      stills.length === 1
    ) {
      args.push(
        '-vf',
        'format=yuv420p',
        '-c:v',
        'libx264',
        '-pix_fmt',
        'yuv420p',
        videoPath
      );

      await runFFmpeg(args);

      return videoPath;
    }

    const filters = [];

    let prev = '[0:v]';

    for (
      let i = 1;
      i < stills.length;
      i++
    ) {
      const out =
        `[v${i}]`;

      const offset =
        (
          i *
          (perSlide - fade)
        ).toFixed(2);

      filters.push(
        `${prev}[${i}:v]xfade=transition=fade:duration=${fade}:offset=${offset}${out}`
      );

      prev = out;
    }

    filters.push(
      `${prev}format=yuv420p[vfinal]`
    );

    args.push(
      '-filter_complex',
      filters.join(';'),
      '-map',
      '[vfinal]',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-r',
      '30',
      videoPath
    );

    await runFFmpeg(args);

    return videoPath;
  }

  async filterImageAssets(
    visualAssets = []
  ) {
    const imageExtensions =
      new Set([
        '.png',
        '.jpg',
        '.jpeg',
        '.webp',
      ]);

    const images = [];

    for (
      const asset of visualAssets
    ) {
      if (
        typeof asset !== 'string' ||
        !imageExtensions.has(
          path
            .extname(asset)
            .toLowerCase()
        )
      ) {
        continue;
      }

      try {
        await fs.access(
          asset
        );

        images.push(
          pathToFileURL(
            asset
          ).href
        );
      } catch {
        // Ignore missing files
      }
    }

    return images;
  }

  createSlideshowHTML(
    script,
    visualAssets
  ) {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 1920px;
            height: 1080px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Arial', sans-serif;
            overflow: hidden;
        }

        .slide {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 2s ease-in-out;
        }

        .slide.active {
            opacity: 1;
        }

        .content {
            text-align: center;
            color: white;
            max-width: 80%;
        }

        h1 {
            font-size: 72px;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        h2 {
            font-size: 48px;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        p {
            font-size: 36px;
            line-height: 1.4;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .background-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.3;
            z-index: -1;
        }

        .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: -1;
        }

        .particle {
            position: absolute;
            background: rgba(255,255,255,0.8);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }

            50% {
                transform: translateY(-20px);
            }
        }
    </style>
</head>

<body>
    <div class="particles"></div>

    <div class="slide active">
        ${
          visualAssets[0]
            ? `<img class="background-image" src="${visualAssets[0]}" />`
            : ''
        }

        <div class="content">
            <h1>${script.title}</h1>
            <p>Ethereal Dreamscript</p>
        </div>
    </div>

    ${this.generateContentSlides(
      script,
      visualAssets
    ).join('')}

    <div class="slide">
        <div class="content">
            <h2>✨ Subscribe for More Stories ✨</h2>
            <p>New content daily at 2:00 PM</p>
        </div>
    </div>

    <script>
        function createParticles() {
            const container =
                document.querySelector('.particles');

            for (let i = 0; i < 20; i++) {
                const particle =
                    document.createElement('div');

                particle.className = 'particle';

                particle.style.left =
                    Math.random() * 100 + '%';

                particle.style.top =
                    Math.random() * 100 + '%';

                particle.style.width =
                    (Math.random() * 4 + 2) + 'px';

                particle.style.height =
                    particle.style.width;

                particle.style.animationDelay =
                    Math.random() * 6 + 's';

                container.appendChild(
                    particle
                );
            }
        }

        let currentSlide = 0;

        const slides =
            document.querySelectorAll('.slide');

        function advanceAnimation() {
            slides[currentSlide]
                .classList.remove('active');

            currentSlide =
                (currentSlide + 1) % slides.length;

            slides[currentSlide]
                .classList.add('active');
        }

        window.advanceAnimation =
            advanceAnimation;

        createParticles();
    </script>
</body>
</html>`;
  }

  generateContentSlides(
    script,
    visualAssets
  ) {
    const slides = [];

    if (
      script.mainContent &&
      script.mainContent.sections
    ) {
      script.mainContent.sections.forEach(
        (section, index) => {
          const assetIndex =
            Math.min(
              index + 1,
              visualAssets.length - 1
            );

          slides.push(`
        <div class="slide">
            ${
              visualAssets[assetIndex]
                ? `<img class="background-image" src="${visualAssets[assetIndex]}" />`
                : ''
            }

            <div class="content">
                <h2>${section.title}</h2>
                ${this.formatSectionContent(
                  section
                )}
            </div>
        </div>`);
        }
      );
    }

    return slides;
  }

  formatSectionContent(
    section
  ) {
    if (
      section.items &&
      Array.isArray(section.items)
    ) {
      return section.items
        .slice(0, 3)
        .map(
          item =>
            `<p>${item.number}. ${item.title}</p>`
        )
        .join('');
    }

    if (
      section.steps &&
      Array.isArray(section.steps)
    ) {
      return section.steps
        .slice(0, 3)
        .map(
          step =>
            `<p>${step.title}</p>`
        )
        .join('');
    }

    if (
      typeof section.content ===
      'string'
    ) {
      return `<p>${section.content.slice(
        0,
        200
      )}${
        section.content.length > 200
          ? '...'
          : ''
      }</p>`;
    }

    return '<p>Content coming soon...</p>';
  }

  calculateScriptDuration(
    script
  ) {
    let totalWords = 0;

    if (script.hook) {
      totalWords +=
        script.hook.text
          .split(/\s+/)
          .length;
    }

    if (script.introduction) {
      totalWords +=
        (
          script.introduction.greeting ||
          ''
        ).split(/\s+/).length;

      totalWords +=
        (
          script.introduction.topicIntro ||
          ''
        ).split(/\s+/).length;
    }

    if (
      script.mainContent &&
      script.mainContent.sections
    ) {
      script.mainContent.sections.forEach(
        section => {
          if (
            typeof section.content ===
            'string'
          ) {
            totalWords +=
              section.content
                .split(/\s+/)
                .length;
          }

          if (
            Array.isArray(
              section.items
            )
          ) {
            section.items.forEach(
              item => {
                totalWords +=
                  (
                    (item.title || '') +
                    ' ' +
                    (item.description || '')
                  )
                    .split(/\s+/)
                    .length;
              }
            );
          }

          if (
            Array.isArray(
              section.steps
            )
          ) {
            section.steps.forEach(
              step => {
                totalWords +=
                  (
                    (step.title || '') +
                    ' ' +
                    (step.description || '')
                  )
                    .split(/\s+/)
                    .length;
              }
            );
          }
        }
      );
    }

    if (script.conclusion) {
      totalWords +=
        (
          script.conclusion.finalThought ||
          ''
        )
          .split(/\s+/)
          .length;
    }

    return Math.max(
      30,
      Math.ceil(
        (totalWords / 150) * 60
      )
    );
  }

  async addAudioToVideo(
    videoPath,
    audioPath,
    outputPath
  ) {
    const hasRealAudio =
      await this.isUsableAudioFile(
        audioPath
      );

    if (!hasRealAudio) {
      this.logger.warn(
        'No narration audio available — producing silent video.'
      );

      if (
        videoPath !== outputPath
      ) {
        await fs.copyFile(
          videoPath,
          outputPath
        );
      }

      return outputPath;
    }

    const muxPath =
      outputPath === videoPath
        ? outputPath.replace(
            /\.mp4$/i,
            '_muxed.mp4'
          )
        : outputPath;

    await runFFmpeg([
      '-y',
      '-i',
      videoPath,
      '-i',
      audioPath,
      '-c:v',
      'copy',
      '-c:a',
      'aac',
      '-shortest',
      muxPath,
    ]);

    if (
      muxPath !== outputPath
    ) {
      await fs.rename(
        muxPath,
        outputPath
      );
    }

    this.logger.info(
      'Audio added to video successfully'
    );

    return outputPath;
  }

  async isUsableAudioFile(
    audioPath
  ) {
    if (
      typeof audioPath !==
        'string' ||
      audioPath.endsWith(
        '.info'
      )
    ) {
      return false;
    }

    try {
      const stats =
        await fs.stat(
          audioPath
        );

      return (
        stats.isFile() &&
        stats.size > 0
      );
    } catch {
      return false;
    }
  }

  async downloadVideo(
    url,
    outputPath
  ) {
    const response =
      await axios({
        method: 'GET',
        url,
        responseType: 'stream',
      });

    const writer =
      require('fs').createWriteStream(
        outputPath
      );

    response.data.pipe(writer);

    return new Promise(
      (resolve, reject) => {
        writer.on(
          'finish',
          resolve
        );

        writer.on(
          'error',
          reject
        );
      }
    );
  }

  async cleanupDirectory(
    dirPath
  ) {
    try {
      const files =
        await fs.readdir(
          dirPath
        );

      for (
        const file of files
      ) {
        await fs.unlink(
          path.join(
            dirPath,
            file
          )
        );
      }

      await fs.rmdir(
        dirPath
      );
    } catch (error) {
      this.logger.warn(
        'Cleanup failed:',
        error.message
      );
    }
  }

  // ============================================================
  // THUMBNAIL
  // ============================================================

  async generateThumbnail(
    script,
    style = 'ethereal'
  ) {
    this.logger.info(
      'Generating custom thumbnail...'
    );

    try {
      if (
        !this.openRouterApiKey &&
        !this.openai &&
        !this.gemini
      ) {
        return await this.simulateThumbnailGeneration(
          script,
          style
        );
      }

      const prompt =
        `YouTube thumbnail for "${script.title}", ${style} style, eye-catching, high contrast, professional composition, clickable, engaging, no unnecessary small text`;

      const thumbnailPath =
        path.join(
          __dirname,
          '..',
          'uploads',
          'thumbnails',
          `thumbnail_${Date.now()}.png`
        );

      await this.generateImage(
        prompt,
        thumbnailPath
      );

      return {
        path: thumbnailPath,
        dimensions: {
          width: 1920,
          height: 1080,
        },
        fileSize:
          await this.getFileSize(
            thumbnailPath
          ),
        simulated: false,
      };
    } catch (error) {
      this.logger.error(
        `Thumbnail generation failed: ${error.message}`
      );

      return await this.simulateThumbnailGeneration(
        script,
        style
      );
    }
  }

  async getFileSize(
    filePath
  ) {
    const stats =
      await fs.stat(
        filePath
      );

    return stats.size;
  }

  // ============================================================
  // SIMULATION FALLBACKS
  // ============================================================

  async simulateTTSGeneration(
    text,
    outputPath
  ) {
    this.logger.info(
      'Simulating TTS generation...'
    );

    const infoPath =
      `${outputPath}.info`;

    await fs.writeFile(
      infoPath,
      JSON.stringify(
        {
          message:
            'AI TTS audio would be generated here',
          text:
            text.substring(0, 100) +
            '...',
          timestamp:
            new Date().toISOString(),
        },
        null,
        2
      )
    );

    return infoPath;
  }

  async simulateVisualAssets(
    prompt,
    style,
    count
  ) {
    this.logger.info(
      `Simulating ${count} visual assets...`
    );

    const paths = [];

    await fs.mkdir(
      path.join(
        __dirname,
        '..',
        'data',
        'assets'
      ),
      { recursive: true }
    );

    for (
      let i = 0;
      i < count;
      i++
    ) {
      const assetPath =
        path.join(
          __dirname,
          '..',
          'data',
          'assets',
          `visual_sim_${Date.now()}_${i}.info`
        );

      await fs.writeFile(
        assetPath,
        JSON.stringify(
          {
            message:
              'AI visual asset would be generated here',
            prompt,
            style,
            timestamp:
              new Date().toISOString(),
          },
          null,
          2
        )
      );

      paths.push(
        assetPath
      );
    }

    return paths;
  }

  async simulateVideoGeneration(
    script,
    visualAssets,
    audioPath,
    outputPath
  ) {
    this.logger.info(
      'Simulating video generation...'
    );

    const infoPath =
      `${outputPath}.info`;

    await fs.writeFile(
      infoPath,
      JSON.stringify(
        {
          message:
            'AI video would be generated here',
          script: script.title,
          visualAssets:
            visualAssets.length,
          audioPath,
          timestamp:
            new Date().toISOString(),
        },
        null,
        2
      )
    );

    return infoPath;
  }

  async simulateThumbnailGeneration(
    script,
    style
  ) {
    this.logger.info(
      'Simulating thumbnail generation...'
    );

    const thumbnailPath =
      path.join(
        __dirname,
        '..',
        'uploads',
        'thumbnails',
        `thumbnail_sim_${Date.now()}.info`
      );

    await fs.mkdir(
      path.dirname(
        thumbnailPath
      ),
      { recursive: true }
    );

    await fs.writeFile(
      thumbnailPath,
      JSON.stringify(
        {
          message:
            'AI thumbnail would be generated here',
          title:
            script.title,
          style,
          timestamp:
            new Date().toISOString(),
        },
        null,
        2
      )
    );

    return {
      path: thumbnailPath,
      dimensions: {
        width: 1792,
        height: 1024,
      },
      fileSize: 1024,
      simulated: true,
    };
  }
}

module.exports = {
  AIVideoGenerator,
};