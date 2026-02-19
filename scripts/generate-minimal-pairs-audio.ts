/**
 * Generate minimal-pairs audio files using ElevenLabs API.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=your_key_here npx tsx scripts/generate-minimal-pairs-audio.ts
 *
 * Optional:
 *   ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM npx tsx scripts/generate-minimal-pairs-audio.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { getAllMinimalPairWords } from '../src/lib/minimal-pairs-data';

const API_KEY = process.env.ELEVENLABS_API_KEY;
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel - clear American English
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? DEFAULT_VOICE_ID;
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'audio', 'minimal-pairs');

if (!API_KEY) {
  console.error('Missing ELEVENLABS_API_KEY environment variable.');
  console.error('Run: ELEVENLABS_API_KEY=your_key_here npx tsx scripts/generate-minimal-pairs-audio.ts');
  process.exit(1);
}

async function generateAudio(text: string, outputPath: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY!,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
          style: 0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`API error for "${text}": ${response.status} - ${error}`);
      return false;
    }

    const audioBuffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
    return true;
  } catch (error) {
    console.error(`Failed to generate "${text}":`, error);
    return false;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const words = getAllMinimalPairWords();

  console.log('ElevenLabs Minimal Pairs Audio Generator');
  console.log('========================================');
  console.log(`Voice ID: ${VOICE_ID}`);
  console.log(`Total words: ${words.length}`);
  console.log('');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created: ${OUTPUT_DIR}`);
  }

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i]!;
    const outputPath = path.join(OUTPUT_DIR, `${word.toLowerCase()}.mp3`);

    if (fs.existsSync(outputPath)) {
      console.log(`[${i + 1}/${words.length}] Skip ${word} (already exists)`);
      skipped++;
      continue;
    }

    console.log(`[${i + 1}/${words.length}] Generate ${word}`);
    const success = await generateAudio(word, outputPath);
    if (success) {
      generated++;
    } else {
      failed++;
    }

    if (i < words.length - 1) {
      await sleep(500);
    }
  }

  console.log('');
  console.log('Summary');
  console.log('=======');
  console.log(`Generated: ${generated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

main().catch(console.error);
