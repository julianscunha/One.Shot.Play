const fs = require('fs');
const { createLogger } = require('../../utils/logger');
const { CredentialManager } = require('../../utils/credential-manager');

const logger = createLogger('YouTubeUploader');

// Publishes a rendered video to YouTube via the Data API v3. Falls back to a
// simulated upload (matches AIVideoGenerator's TTS/image/video simulate pattern)
// when no YouTube OAuth credentials are configured yet - see
// CredentialManager.setupYouTubeCredentials() for how those get set up.
async function uploadVideo(videoPath, script = {}) {
  const credentialManager = new CredentialManager();
  await credentialManager.initialize();

  let youtube;
  try {
    youtube = credentialManager.getYouTubeClient();
  } catch (error) {
    logger.warn(`YouTube not configured (${error.message}) - simulating upload`);
    return simulateUpload(videoPath, script);
  }

  if (!fs.existsSync(videoPath)) {
    logger.warn(`No real video file at ${videoPath} (upstream phase simulated) - simulating upload`);
    return simulateUpload(videoPath, script);
  }

  logger.info(`Uploading to YouTube: ${videoPath}`);

  const response = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: script.title || 'Untitled video',
        description: script.hook?.text || script.conclusion?.finalThought || '',
        categoryId: '22'
      },
      status: {
        privacyStatus: 'private'
      }
    },
    media: {
      body: fs.createReadStream(videoPath)
    }
  });

  const videoId = response.data.id;
  logger.info(`Upload complete: https://youtube.com/watch?v=${videoId}`);

  return { videoId, url: `https://youtube.com/watch?v=${videoId}`, simulated: false };
}

async function simulateUpload(videoPath, script) {
  logger.info('Simulating YouTube upload...');
  return {
    videoId: null,
    url: null,
    simulated: true,
    title: script.title,
    videoPath
  };
}

module.exports = { uploadVideo };
