#!/usr/bin/env python3
"""Add audioUrl to all article frontmatter."""
import re
from pathlib import Path

POSTS_DIR = Path('/Users/tommybai/workspace-silicon/site/src/content/posts')

def add_audio_url(content, slug):
    audio_zh = f'/audio/{slug}_zh.m4a'
    audio_en = f'/audio/{slug}_en.m4a'
    
    if re.search(r'^audioUrl:', content, re.MULTILINE):
        return content, False
    
    for pattern in [r'^(coverImage:.*)$', r'^(title:.*)$']:
        m = re.search(rf'{pattern}', content, re.MULTILINE)
        if m:
            insert_pos = m.end()
            return content[:insert_pos] + f'\naudioUrl: "{audio_zh}"\naudioUrlEn: "{audio_en}"' + content[insert_pos:], True
    
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if line.startswith('---') and i > 0:
            insert_pos = content.index(lines[i])
            return content[:insert_pos] + f'audioUrl: "{audio_zh}"\naudioUrlEn: "{audio_en}"\n' + content[insert_pos:], True
    
    return content, False

count = 0
for file in sorted(POSTS_DIR.glob('*.md')):
    slug = file.stem
    content = file.read_text(encoding='utf-8')
    new_content, added = add_audio_url(content, slug)
    if added:
        file.write_text(new_content, encoding='utf-8')
        count += 1
        print(f'✅ {slug}: audioUrl added')
    else:
        print(f'⏭️  {slug}: already has audioUrl or no frontmatter')

print(f'\n✅ Added audioUrl to {count} articles')
