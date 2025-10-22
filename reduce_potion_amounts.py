import re

# Read the file
with open(r'c:\Users\oblit\sols-rng-game\achievementsData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Function to reduce potion count
def reduce_potion_count(match):
    potion_name = match.group(1)
    count = int(match.group(2))
    
    # Reduce the count (divide by 2, minimum 1)
    new_count = max(1, count // 2)
    
    return f"'{potion_name}': {new_count}"

# Pattern to match potion entries like 'Potion Name': 10
pattern = r"'([^']+Potion[^']*)':\s*(\d+)"

# Replace all potion counts
new_content = re.sub(pattern, reduce_potion_count, content)

# Write back
with open(r'c:\Users\oblit\sols-rng-game\achievementsData.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ Reduced all potion amounts by 50% (minimum 1)!")
print("Examples:")
print("  - 10 potions → 5 potions")
print("  - 5 potions → 2 potions")
print("  - 3 potions → 1 potion")
print("  - 1 potion → 1 potion (minimum)")
