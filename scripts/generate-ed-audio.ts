/**
 * Generate -ed pronunciation audio files using ElevenLabs API
 *
 * Usage:
 *   1. Get your API key from https://elevenlabs.io (Profile → API Keys)
 *   2. Run: ELEVENLABS_API_KEY=your_key_here npx tsx scripts/generate-ed-audio.ts
 *
 * This will create MP3 files in public/audio/verbs/
 */

import * as fs from 'fs';
import * as path from 'path';

const API_KEY = process.env.ELEVENLABS_API_KEY;

if (!API_KEY) {
  console.error('❌ Missing ELEVENLABS_API_KEY environment variable');
  console.error('');
  console.error('Get your API key from: https://elevenlabs.io');
  console.error('Then run:');
  console.error('  ELEVENLABS_API_KEY=your_key_here npx tsx scripts/generate-ed-audio.ts');
  process.exit(1);
}

// ElevenLabs voice IDs - American English voices
// You can find more at: https://api.elevenlabs.io/v1/voices
const VOICE_OPTIONS = {
  rachel: '21m00Tcm4TlvDq8ikWAM', // Rachel - clear American female
  josh: 'TxGEqnHWrfWFTfGW9XjX',   // Josh - American male
  elli: 'MF3mGyEYCl7XYWbV9V6O',   // Elli - young American female
  adam: 'pNInz6obpgDQGcFmaJgB',   // Adam - deep American male
};

// Use Rachel by default (clear pronunciation)
const VOICE_ID = VOICE_OPTIONS.rachel;

// All verbs from ed-pronunciation-data.ts
import { ED_VERBS } from '../src/lib/ed-pronunciation-data';

// All verbs from ed-pronunciation-data.ts
const VERBS = ED_VERBS.map(v => ({ base: v.base, past: v.past }));

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'audio', 'verbs');

async function generateAudio(text: string, outputPath: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY!,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5',  // Free tier compatible model
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
            style: 0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error(`  ❌ API error for "${text}": ${response.status} - ${error}`);
      return false;
    }

    const audioBuffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
    return true;
  } catch (error) {
    console.error(`  ❌ Failed to generate "${text}":`, error);
    return false;
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🎙️  ElevenLabs -ed Pronunciation Audio Generator');
  console.log('================================================\n');

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created directory: ${OUTPUT_DIR}\n`);
  }

  // Collect all words to generate
  const words: string[] = [];
  for (const verb of VERBS) {
    words.push(verb.base);
    words.push(verb.past);
  }

  console.log(`📝 Total words to generate: ${words.length}`);
  console.log(`🎤 Using voice: Rachel (American English)\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const outputPath = path.join(OUTPUT_DIR, `${word}.mp3`);

    // Skip if file already exists
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  [${i + 1}/${words.length}] Skipping "${word}" (already exists)`);
      skipped++;
      continue;
    }

    console.log(`🔊 [${i + 1}/${words.length}] Generating "${word}"...`);

    const success = await generateAudio(word, outputPath);

    if (success) {
      console.log(`  ✅ Saved: ${word}.mp3`);
      generated++;
    } else {
      failed++;
    }

    // Rate limiting - ElevenLabs free tier has limits
    // Wait 500ms between requests to be safe
    if (i < words.length - 1) {
      await sleep(500);
    }
  }

  console.log('\n================================================');
  console.log('📊 Summary:');
  console.log(`   ✅ Generated: ${generated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`\n📁 Audio files saved to: ${OUTPUT_DIR}`);

  if (generated > 0) {
    console.log('\n🎉 Done! The game will now use these audio files.');
  }
}

main().catch(console.error);
