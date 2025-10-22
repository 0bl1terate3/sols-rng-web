import re

# Read the file
with open(r'c:\Users\oblit\sols-rng-game\achievementsData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Function to cap potion count at max 5
def cap_potion_count(match):
    potion_name = match.group(1)
    count = int(match.group(2))
    
    # Cap at maximum 5 potions
    new_count = min(5, count)
    
    return f"'{potion_name}': {new_count}"

# Pattern to match potion entries like 'Potion Name': 10
pattern = r"'([^']+Potion[^']*)':\s*(\d+)"

# Replace all potion counts
new_content = re.sub(pattern, cap_potion_count, content)

# Write back
with open(r'c:\Users\oblit\sols-rng-game\achievementsData.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ Capped all potion amounts at maximum 5!")
print("Examples:")
print("  - 50 potions → 5 potions")
print("  - 500 potions → 5 potions")
print("  - 10 potions → 5 potions")
print("  - 3 potions → 3 potions")
print("  - 1 potion → 1 potion")
