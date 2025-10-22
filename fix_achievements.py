#!/usr/bin/env python3
"""
Fix missing closing braces in achievementsData.js
"""

import re

# Read the file
with open('achievementsData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix pattern: reward: {  }, (missing closing brace for achievement object)
# Should be: reward: {  } },
content = re.sub(r"reward: \{  \},\s*$", r"reward: {  } },", content, flags=re.MULTILINE)
content = re.sub(r"reward: \{   \},\s*$", r"reward: {   } },", content, flags=re.MULTILINE)

# Write back
with open('achievementsData.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fixed all missing closing braces in achievementsData.js")
