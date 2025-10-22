import re

# Read the file
with open(r'c:\Users\oblit\sols-rng-game\achievementsData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# One-use potions to remove (with various formats)
patterns_to_remove = [
    (r"'Forbidden Potion I': \d+,?\s*", ""),
    (r", 'Forbidden Potion I': \d+", ""),
    (r"'Forbidden Potion II': \d+,?\s*", ""),
    (r", 'Forbidden Potion II': \d+", ""),
    (r"'Forbidden Potion III': \d+,?\s*", ""),
    (r", 'Forbidden Potion III': \d+", ""),
    (r"'Heavenly Potion': \d+,?\s*", ""),
    (r", 'Heavenly Potion': \d+", ""),
    (r"'Godlike Potion': \d+,?\s*", ""),
    (r", 'Godlike Potion': \d+", ""),
    (r"'Pump Kings Blood': \d+,?\s*", ""),
    (r", 'Pump Kings Blood': \d+", ""),
    (r"'All-or-Nothing Brew': \d+,?\s*", ""),
    (r", 'All-or-Nothing Brew': \d+", ""),
    (r"'Gambler\\'s Elixir': \d+,?\s*", ""),
    (r", 'Gambler\\'s Elixir': \d+", ""),
    (r"'Potion of Clarity': \d+,?\s*", ""),
    (r", 'Potion of Clarity': \d+", ""),
    (r"'Potion of Hindsight': \d+,?\s*", ""),
    (r", 'Potion of Hindsight': \d+", ""),
]

# Apply all replacements
for pattern, replacement in patterns_to_remove:
    content = re.sub(pattern, replacement, content)

# Fix empty potions objects: potions: { } -> remove the whole potions entry
content = re.sub(r",?\s*potions:\s*\{\s*\}", "", content)

# Fix trailing commas before closing braces
content = re.sub(r",(\s*\})", r"\1", content)

# Write back
with open(r'c:\Users\oblit\sols-rng-game\achievementsData.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Removed all one-use potions from achievements!")
