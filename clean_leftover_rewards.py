import re

# Read the file
with open(r'c:\Users\oblit\sols-rng-game\achievementsData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove leftover items/potions that are after reward: { }
# Pattern: }, potions: { ... } or }, items: { ... }
content = re.sub(r"\},\s*potions:\s*\{[^}]*\}\s*\}", " }", content)
content = re.sub(r"\},\s*items:\s*\{[^}]*\}\s*\}", " }", content)
content = re.sub(r"\},\s*buff:\s*'[^']*'\s*\}", " }", content)
content = re.sub(r"\},\s*currency:\s*\{[^}]*\}\s*\}", " }", content)

# Fix any double closing braces
content = re.sub(r"\}\s*\}", " }", content)

# Write back
with open(r'c:\Users\oblit\sols-rng-game\achievementsData.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Cleaned up all leftover reward remnants!")
