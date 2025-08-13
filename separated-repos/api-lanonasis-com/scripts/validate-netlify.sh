#!/bin/bash
# Validate netlify.toml before pushing

echo "🔍 Validating netlify.toml..."

# Check if toml is installed
if ! command -v toml &> /dev/null; then
    echo "Installing toml validator..."
    npm install -g @iarna/toml
fi

# Validate TOML syntax
if npx @iarna/toml < netlify.toml > /dev/null 2>&1; then
    echo "✅ netlify.toml syntax is valid!"
else
    echo "❌ netlify.toml has syntax errors:"
    npx @iarna/toml < netlify.toml
    exit 1
fi

# Check for common issues
echo "🔍 Checking for common issues..."

# Check for empty sections
if grep -E '^\[[^\]]+\]$' netlify.toml | while read -r line; do
    section=$(echo "$line" | tr -d '[]')
    # Check if next non-empty, non-comment line is another section
    if awk -v section="$line" '
        $0 == section { found=1; next }
        found && /^[[:space:]]*$/ { next }
        found && /^[[:space:]]*#/ { next }
        found && /^\[/ { exit 1 }
        found { exit 0 }
    ' netlify.toml; then
        echo "⚠️  Warning: Section [$section] might be empty"
    fi
done; then
    :
fi

echo "✅ Validation complete!"