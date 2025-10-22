import re

# Read the file
with open(r'c:\Users\oblit\sols-rng-game\achievementsData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove money entries
content = re.sub(r"money:\s*\d+,?\s*", "", content)
content = re.sub(r",?\s*money:\s*\d+", "", content)

# Remove Void Coin entries from items
content = re.sub(r"'Void Coin':\s*\d+,?\s*", "", content)
content = re.sub(r",?\s*'Void Coin':\s*\d+", "", content)

# Fix empty items objects: items: { } -> remove the whole items entry
content = re.sub(r",?\s*items:\s*\{\s*\}", "", content)

# Fix empty reward objects
content = re.sub(r"reward:\s*\{\s*\}", "reward: { }", content)

# Fix trailing commas before closing braces
content = re.sub(r",(\s*\})", r"\1", content)

# Fix double commas
content = re.sub(r",,", ",", content)

# Write back
with open(r'c:\Users\oblit\sols-rng-game\achievementsData.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Removed all money and Void Coin rewards from achievements!")
