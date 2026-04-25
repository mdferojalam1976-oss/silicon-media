#!/usr/bin/env python3
"""Generate TTS audio for articles using macOS say command."""
import os, re, subprocess, time
from pathlib import Path

POSTS_DIR = Path('/Users/tommybai/workspace-silicon/site/src/content/posts')
AUDIO_DIR = Path('/Users/tommybai/workspace-silicon/site/public/audio')
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

ZH_VOICE = 'Mei-Jia'
EN_VOICE = 'Samantha'
TMPFILE = '/tmp/say_input.txt'

def extract_text(content, lang):
    content = re.sub(r'^---\n[\s\S]*?\n---\n', '', content)
    content = re.sub(r'#{1,6}\s+', '', content)
    content = re.sub(r'\*\*(.+?)\*\*', r'\1', content)
    content = re.sub(r'\*(.+?)\*', r'\1', content)
    content = re.sub(r'\[(.+?)\]\(.+?\)', r'\1', content)
    content = re.sub(r'```[\s\S]*?```', '', content)
    content = re.sub(r'`[^`]+`', '', content)
    content = re.sub(r'^>\s+', '', content, flags=re.MULTILINE)
    content = re.sub(r'^[-*+]\s+', '', content, flags=re.MULTILINE)
    
    lines = [l.strip() for l in content.split('\n') if l.strip()]
    
    if lang == 'zh':
        result = []
        for l in lines:
            cjk = sum(1 for c in l if '\u4e00' <= c <= '\u9fff')
            alpha = sum(1 for c in l if c.isalpha())
            if alpha == 0: alpha = 1
            if cjk / alpha > 0.3:
                result.append(l)
        return '\n'.join(result)[:2500]
    else:
        result = []
        for l in lines:
            cjk = sum(1 for c in l if '\u4e00' <= c <= '\u9fff')
            alpha = sum(1 for c in l if c.isalpha())
            if alpha > cjk:
                result.append(l)
        return '\n'.join(result)[:2500]

def generate_audio(text, voice, output_path):
    if not text.strip():
        return False
    with open(TMPFILE, 'w', encoding='utf-8') as f:
        f.write(text)
    try:
        result = subprocess.run(
            ['say', '-v', voice, '-f', TMPFILE, '-o', output_path],
            capture_output=True, timeout=60
        )
        return result.returncode == 0 and os.path.exists(output_path) and os.path.getsize(output_path) > 1000
    except Exception as e:
        print(f'  Error: {e}')
        return False

def main():
    files = sorted(POSTS_DIR.glob('*.md'))
    total = len(files)
    print(f'Found {total} articles')
    print(f'ZH voice: {ZH_VOICE}, EN voice: {EN_VOICE}')
    
    for i, file in enumerate(files, 1):
        slug = file.stem
        
        for lang in ('zh', 'en'):
            out_path = AUDIO_DIR / f'{slug}_{lang}.m4a'
            if out_path.exists():
                continue
            
            content = file.read_text(encoding='utf-8')
            text = extract_text(content, lang)
            
            if not text.strip():
                print(f'[{i}/{total}] ⏭️  {slug} ({lang}): no text')
                continue
            
            voice = ZH_VOICE if lang == 'zh' else EN_VOICE
            print(f'[{i}/{total}] 🔊 {slug} ({lang}, {len(text)}chars)...', end=' ', flush=True)
            
            if generate_audio(text, voice, str(out_path)):
                size = os.path.getsize(out_path)
                print(f'✅ {size//1024}KB')
            else:
                print(f'❌ failed')
            
            time.sleep(0.2)
    
    audio_count = len(list(AUDIO_DIR.glob('*.m4a')))
    print(f'\n🎧 Total audio files: {audio_count}')

if __name__ == '__main__':
    main()
