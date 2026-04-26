#!/bin/bash
# Generate TTS audio for all articles using mmx-cli (MiniMax Token Plan)
# Usage: bash scripts/gen-mmx-audio.sh [en|zh|all]

MODE=${1:-all}
POSTS_DIR="/Users/tommybai/workspace-silicon/site/src/content/posts"
AUDIO_DIR="/Users/tommybai/workspace-silicon/site/public/audio"
mkdir -p "$AUDIO_DIR"

# Choose voices
ZH_VOICE="Chinese (Mandarin)_Lyrical_Voice"
EN_VOICE="English_Gentle-voiced_man"

# Voice mapping
if [ "$ZH_VOICE" = "" ]; then
    ZH_VOICE="Chinese (Mandarin)_Warm_Girl"
fi
if [ "$EN_VOICE" = "" ]; then
    EN_VOICE="English_Trustworthy_Man"
fi

echo "🎧 Silicon Observer Audio Generator (mmx-cli)"
echo "============================================="
echo "ZH voice: $ZH_VOICE"
echo "EN voice: $EN_VOICE"
echo ""

# Check mmx is available
if ! command -v mmx &>/dev/null; then
    echo "❌ mmx-cli not found. Run: npm install -g mmx-cli"
    exit 1
fi

# Count total
total=$(ls "$POSTS_DIR"/*.md 2>/dev/null | wc -l | tr -d ' ')
echo "Found $total articles"
echo ""

count=0
errors=0

for file in $(ls "$POSTS_DIR"/*.md 2>/dev/null | sort); do
    slug=$(basename "$file" .md)
    
    for lang in $([ "$MODE" = "zh" ] && echo "zh" || ([ "$MODE" = "en" ] && echo "en" || echo "zh en")); do
        out="$AUDIO_DIR/${slug}_${lang}.m4a"
        
        # Skip if exists
        if [ -f "$out" ] && [ $(stat -f%z "$out" 2>/dev/null || stat -c%s "$out" 2>/dev/null) -gt 5000 ]; then
            continue
        fi
        
        # Extract text from markdown
        content=$(cat "$file")
        
        # Strip frontmatter
        content=$(echo "$content" | sed '1,/^---$/d' | sed '1,/^---$/d')
        
        # Strip markdown syntax
        content=$(echo "$content" | sed 's/^#\+ .*//' | sed 's/\*\*/\n/g' | sed 's/\*\*/\n/g')
        content=$(echo "$content" | sed 's/\*/ /g' | sed 's/`[^`]*`//g')
        content=$(echo "$content" | sed 's/\[([^\]]*)\]([^\[]*)/\1/g')
        content=$(echo "$content" | sed 's/^> .*//' | sed 's/^- .*//')
        content=$(echo "$content" | sed 's/```/\
/g' | sed 's/```/\
/g')
        
        # Extract by language
        if [ "$lang" = "zh" ]; then
            # Chinese: lines with CJK characters
            text=$(echo "$content" | while IFS= read -r line; do
                cjk=$(echo "$line" | sed 's/[^[:cntrl:][:graph:]]//g' | grep -c '[\x{4e00}-\x{9fff}]' || echo 0)
                alpha=$(echo "$line" | tr -d '[:cntrl:][:space:]' | grep -c '[A-Za-z]' || echo 0)
                [ "$alpha" -eq 0 ] && alpha=1
                ratio=$(echo "scale=2; $cjk / $alpha" | bc 2>/dev/null || echo 0)
                [ "$(echo "$ratio > 0.3" | bc 2>/dev/null || echo 0)" = "1" ] && echo "$line"
            done | head -80 | tr '\n' ' ')
        else
            # English: lines with more alphabetic characters
            text=$(echo "$content" | while IFS= read -r line; do
                cjk=$(echo "$line" | grep -c '[\x{4e00}-\x{9fff}]' || echo 0)
                alpha=$(echo "$line" | tr -d '[:cntrl:][:space:]' | grep -c '[A-Za-z]' || echo 0)
                [ "$cjk" -lt "$alpha" ] && [ "$alpha" -gt 3 ] && echo "$line"
            done | head -80 | tr '\n' ' ')
        fi
        
        # Clean up text
        text=$(echo "$text" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | tr -s '[:space:]' ' ')
        
        if [ ${#text} -lt 20 ]; then
            echo "⏭️  $slug ($lang): insufficient text (${#text} chars)"
            continue
        fi
        
        # Truncate to 8000 chars (mmx limit is 10k for safety)
        text="${text:0:8000}"
        
        # Choose voice
        voice="$ZH_VOICE"
        [ "$lang" = "en" ] && voice="$EN_VOICE"
        
        # Generate
        echo -n "🔊 $slug ($lang, ${#text}chars, voice: $voice)..."
        
        tmp=$(mktemp)
        echo "$text" > "$tmp"
        
        # Try with voice flag, fall back to default
        if mmx speech synthesize --text "$text" --out "$out" --voice "$voice" 2>/dev/null; then
            size=$(stat -f%z "$out" 2>/dev/null || stat -c%s "$out" 2>/dev/null)
            if [ "$size" -gt 5000 ]; then
                echo " ✅ $(numfmt --to=iec $size 2>/dev/null || echo "${size}B")"
                count=$((count + 1))
            else
                echo " ❌ too small (${size}B)"
                rm -f "$out"
                errors=$((errors + 1))
            fi
        else
            # Try without voice
            if mmx speech synthesize --text "$text" --out "$out" 2>/dev/null; then
                size=$(stat -f%z "$out" 2>/dev/null || stat -c%s "$out" 2>/dev/null)
                echo " ✅ (default voice) $(numfmt --to=iec $size 2>/dev/null || echo "${size}B")"
                count=$((count + 1))
            else
                echo " ❌ failed"
                rm -f "$out"
                errors=$((errors + 1))
            fi
        fi
        
        rm -f "$tmp"
        sleep 1  # rate limit
    done
done

total_files=$(ls "$AUDIO_DIR"/*.m4a 2>/dev/null | wc -l | tr -d ' ')
echo ""
echo "============================================="
echo "✅ Generated: $count new files"
echo "❌ Errors: $errors"
echo "📁 Total audio files: $total_files"
