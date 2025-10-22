import re

# Read the file
with open(r'c:\Users\oblit\sols-rng-game\achievementsData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix leading commas: { , potions -> { potions
content = re.sub(r"\{\s*,\s*", "{ ", content)

# Fix double commas
content = re.sub(r",,+", ",", content)

# Fix trailing commas before closing braces
content = re.sub(r",\s*\}", " }", content)

# Write back
with open(r'c:\Users\oblit\sols-rng-game\achievementsData.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fixed formatting issues!")
