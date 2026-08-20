const fs = require('fs').promises;
const { runFFmpeg } = require('./ffmpeg');

// No ASR/forced-alignment available, so cue timing is estimated from word count
// at ~150 words/minute - the same approximation AIVideoGenerator.calculateScriptDuration()
// already uses for slideshow slide timing, applied per-cue instead of to the whole script.
const WORDS_PER_SECOND = 150 / 60;

function buildCues(script = {}) {
  const cues = [];

  if (script.hook?.text) cues.push(script.hook.text);
  if (script.introduction?.greeting) cues.push(script.introduction.greeting);
  if (script.introduction?.topicIntro) cues.push(script.introduction.topicIntro);

  for (const section of script.mainContent?.sections || []) {
    if (section.title) cues.push(section.title);
    if (typeof section.content === 'string') cues.push(section.content);
  }

  if (script.conclusion?.finalThought) cues.push(script.conclusion.finalThought);

  return cues;
}

function formatTimestamp(seconds) {
  const ms = Math.round((seconds % 1) * 1000);
  const totalSeconds = Math.floor(seconds);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600);
  const pad = (n, len = 2) => String(n).padStart(len, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
}

function generateSRT(script) {
  const cues = buildCues(script);
  let cursor = 0;
  const blocks = cues.map((text, i) => {
    const duration = Math.max(1.5, text.split(/\s+/).length / WORDS_PER_SECOND);
    const start = cursor;
    const end = cursor + duration;
    cursor = end;
    return `${i + 1}\n${formatTimestamp(start)} --> ${formatTimestamp(end)}\n${text}\n`;
  });
  return blocks.join('\n');
}

// Soft-muxes an SRT as a subtitle track (mp4 mov_text) rather than burning it into
// the video frames - avoids needing a font available to ffmpeg's subtitles filter.
async function addCaptionsToVideo(videoPath, script, outputPath) {
  const srtPath = `${videoPath}.srt`;
  await fs.writeFile(srtPath, generateSRT(script), 'utf8');

  try {
    await runFFmpeg([
      '-y',
      '-i', videoPath,
      '-i', srtPath,
      '-map', '0',
      '-map', '1',
      '-c', 'copy',
      '-c:s', 'mov_text',
      outputPath
    ]);
  } finally {
    await fs.unlink(srtPath).catch(() => {});
  }

  return outputPath;
}

module.exports = { generateSRT, addCaptionsToVideo };
