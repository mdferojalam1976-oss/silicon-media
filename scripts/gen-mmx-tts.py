#!/usr/bin/env python3
"""Generate TTS audio for articles using mmx-cli (MiniMax Token Plan)."""
import subprocess, re, os, time
from pathlib import Path

POSTS_DIR = Path('/Users/tommybai/workspace-silicon/site/src/content/posts')
AUDIO_DIR = Path('/Users/tommybai/workspace-silicon/site/public/audio')
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

ZH_VOICE = "Chinese (Mandarin)_Lyrical_Voice"
EN_VOICE = "English_Gentle-voiced_man"
TMPFILE = '/tmp/mmx_tts_input.txt'

def is_cjk(c):
    return '\u4e00' <= c <= '\u9fff'

def extract_text(content, lang):
    content = re.sub(r'^---\n[\s\S]*?\n---\n', '', content)
    content = re.sub(r'^#{1,6}\s+', '', content, flags=re.MULTILINE)
    content = re.sub(r'\*\*(.+?)\*\*', r'\1', content)
    content = re.sub(r'\*(.+?)\*', r'\1', content)
    content = re.sub(r'\[(.+?)\]\(.+?\)', r'\1', content)
    content = re.sub(r'```[\s\S]*?```', '', content)
    content = re.sub(r'`[^`]+`', '', content)
    content = re.sub(r'^>\s*', '', content, flags=re.MULTILINE)
    content = re.sub(r'^[-*+]\s+', '', content, flags=re.MULTILINE)
    lines = [l.strip() for l in content.split('\n') if l.strip()]
    result = []
    for line in lines:
        cjk = sum(1 for c in line if is_cjk(c))
        alpha = sum(1 for c in line if c.isalpha())
        if alpha == 0:
            alpha = 1
        if lang == 'zh':
            if cjk / alpha > 0.3:
                result.append(line)
        else:
            if alpha > cjk and alpha > 3:
                result.append(line)
    return ' '.join(result)[:8000]

def gen_audio(text, voice, output_path):
    if not text.strip():
        return False
    with open(TMPFILE, 'w', encoding='utf-8') as f:
        f.write(text)
    try:
        cmd = ['mmx', 'speech', 'synthesize',
               '--text', text,
               '--out', output_path,
               '--voice', voice]
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        if r.returncode == 0 and os.path.exists(output_path):
            return os.path.getsize(output_path) > 5000
        print(f"  {r.stderr[:100] if r.stderr else r.stdout[:100]}")
        return False
    except Exception as e:
        print(f"  exc: {e}")
        return False

def main():
    files = sorted(POSTS_DIR.glob('*.md'))
    total = len(files)
    print(f"🎧 Silicon Observer Audio (mmx-cli)")
    print(f"Found {total} articles | ZH: {ZH_VOICE} | EN: {EN_VOICE}")
    print()
    gen, skip, err = 0, 0, 0
    for i, file in enumerate(files, 1):
        slug = file.stem
        for lang in ('zh', 'en'):
            out = AUDIO_DIR / f'{slug}_{lang}.m4a'
            if out.exists() and os.path.getsize(out) > 5000:
                skip += 1
                continue
            content = file.read_text(encoding='utf-8')
            text = extract_text(content, lang)
            if len(text) < 20:
                if lang == 'en':
                    # Try titleEn + descriptionEn
                    t = re.search(r'^titleEn:\s*"(.+?)"', content, re.MULTILINE)
                    d = re.search(r'^descriptionEn:\s*"?(.+?)"?\s*$', content, re.MULTILINE)
                    text = '. '.join(x for x in [(t.group(1) if t else ''), (d.group(1) if d else '')] if x)
                if len(text) < 20:
                    print(f"[{i}/{total}] ⏭  {slug} ({lang}): no text")
                    continue
                print(f"[{i}/{total}] → {slug} ({lang}) titleEn only: {len(text)}chars")
            voice = ZH_VOICE if lang == 'zh' else EN_VOICE
            print(f"[{i}/{total}] 🔊 {slug} ({lang}, {len(text)}chars)...", end=' ', flush=True)
            if gen_audio(text, voice, str(out)):
                sz = os.path.getsize(out)
                print(f"✅ {sz//1024}KB")
                gen += 1
            else:
                print(f"❌")
                if out.exists():
                    os.remove(out)
                err += 1
            time.sleep(1)
    cnt = len(list(AUDIO_DIR.glob('*.m4a')))
    print(f"\n✅ {gen} new | ⏭ {skip} exist | ❌ {err} | 📁 total {cnt}")

if __name__ == '__main__':
    main()
