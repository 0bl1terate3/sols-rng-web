import re

# Read the file
with open(r'c:\Users\oblit\sols-rng-game\achievementsData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to match the entire reward object
# Matches from "reward: {" to the closing "}"
pattern = r"reward:\s*\{[^}]*\}"

# Replace all rewards with empty reward object
new_content = re.sub(pattern, "reward: { }", content)

# Write back
with open(r'c:\Users\oblit\sols-rng-game\achievementsData.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ Removed ALL rewards from ALL achievements!")
print("All achievements now have: reward: { }")
print("\nAchievements are now purely for completion/bragging rights!")
