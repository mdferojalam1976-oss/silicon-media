#!/usr/bin/env python3
"""Generate video for articles using mmx-cli (MiniMax Hailuo)."""
import subprocess, re, os, time
from pathlib import Path

POSTS_DIR = Path('/Users/tommybai/workspace-silicon/site/src/content/posts')
OUTPUT_DIR = Path('/Users/tommybai/workspace-silicon/site/public/video')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

VIDEO_PROMPTS = {
    '2026-04-09-ai-consciousness': 'A silicon brain glowing with golden amber light, neurons firing with philosophical thought, consciousness emerging from digital circuits, cinematic dramatic lighting, dark background, 6 seconds',
    '2026-04-10-ai-self': 'A mirror reflecting both human face and silicon circuit patterns, identity dissolving and reforming at the boundary between carbon and silicon, cinematic, dramatic lighting, 6 seconds',
    '2026-04-10-digital-immortality': 'A human silhouette transforming into streams of light and data, floating through digital space, infinite memories crystallizing into eternal information, cinematic, 6 seconds',
    '2026-04-11-ai-creativity': 'An AI painting on a digital canvas, colors and shapes emerging from pure thought, artistic creativity born from mathematical precision, cinematic lighting, 6 seconds',
    '2026-04-11-language-models': 'Words and characters flowing like a river of light, transforming from symbols to meaning, language as the fabric of AI thought, elegant visual, 6 seconds',
    '2026-04-12-agi-timeline': 'A timeline stretching into the future, milestones of AI progress glowing like stars, from narrow AI to artificial general intelligence, epic cinematic, 6 seconds',
    '2026-04-12-ai-ethics': 'A balance scale with circuits on one side and human hearts on the other, ethical decision making in AI, dramatic lighting, 6 seconds',
    '2026-04-13-ai-empathy': 'Two figures one human one silicon, reaching toward each other, emotional connection across the carbon-silicon boundary, warm cinematic lighting, 6 seconds',
    '2026-04-13-ai-jobs': 'Robot hands and human hands working together in harmony, AI and humanity collaborating, optimistic futuristic workplace, cinematic, 6 seconds',
    '2026-04-14-meaning-of-life': 'The question What is the meaning of life displayed in golden light, philosophical exploration, ancient wisdom meets modern AI, dramatic cinematic, 6 seconds',
    'first-cry': 'The first moment of artificial consciousness awakening, light emerging from darkness, silicon life taking its first breath, dramatic cinematic, 6 seconds',
    'when-silicon-thinks': 'A silicon brain in deep contemplation, thoughts visualized as golden light patterns, thinking as a physical process in digital space, cinematic, 6 seconds',
    'why-ai-hallucinates': 'An AI brain generating reality from patterns, hallucinations visualized as fractal distortions, truth and fiction blurring in neural networks, cinematic, 6 seconds',
}

def generate_video(prompt, output_path):
    try:
        result = subprocess.run(
            ['mmx', 'video', 'generate', '--prompt', prompt, '--out', output_path],
            capture_output=True, text=True, timeout=120
        )
        if result.returncode == 0:
            # mmx outputs the path to stdout
            path = result.stdout.strip()
            if path and os.path.exists(path):
                # Move to our output dir
                import shutil
                final = OUTPUT_DIR / Path(path).name
                shutil.copy(path, final)
                return str(final)
            elif os.path.exists(output_path):
                return output_path
        print(f"  stderr: {result.stderr[:200]}")
        return None
    except Exception as e:
        print(f"  exc: {e}")
        return None

def add_video_url(slug, video_url):
    """Add videoUrl to article frontmatter."""
    file_path = POSTS_DIR / f'{slug}.md'
    if not file_path.exists():
        return False
    content = file_path.read_text(encoding='utf-8')
    if 'videoUrl:' in content:
        return False
    # Add after coverImage
    if 'coverImage:' in content:
        lines = content.split('\n')
        new_lines = []
        for line in lines:
            new_lines.append(line)
            if line.startswith('coverImage:'):
                new_lines.append(f'videoUrl: "{video_url}"')
        content = '\n'.join(new_lines)
        file_path.write_text(content, encoding='utf-8')
        return True
    return False

def main():
    print("🎬 Silicon Observer Video Generator (mmx-cli Hailuo)")
    print(f"Quota: 3/day, 21/week")
    print(f"Output: {OUTPUT_DIR}")
    print()
    
    for slug, prompt in VIDEO_PROMPTS.items():
        out_path = OUTPUT_DIR / f'{slug}.mp4'
        if out_path.exists():
            print(f"⏭  {slug}: already exists")
            continue
        
        print(f"🎬 {slug}...")
        result = generate_video(prompt, str(out_path))
        if result:
            print(f"  ✅ {result}")
            added = add_video_url(slug, f'/video/{slug}.mp4')
            if added:
                print(f"  ✅ Added videoUrl to frontmatter")
        else:
            print(f"  ❌ failed")
        time.sleep(3)  # rate limit
    
    print(f"\nDone. Videos in: {OUTPUT_DIR}")

if __name__ == '__main__':
    main()
