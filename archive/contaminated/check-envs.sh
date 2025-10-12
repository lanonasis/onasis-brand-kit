#!/bin/bash
# Check that all .env files match their corresponding .env.template keys
# Updated for new repo structure with per-app/service templates

set -e
TARGET_DIRS=(apps packages services)
ROOT_TEMPLATE=".env.template"
ERRORS=0

echo "🔍 Checking environment file consistency..."
echo

# Function to get template keys from a file
get_template_keys() {
    local template_file="$1"
    if [ -f "$template_file" ]; then
        grep -v '^#' "$template_file" | grep -v '^$' | cut -d= -f1 | sort
    else
        echo ""
    fi
}

# Function to check .env against template
check_env_file() {
    local env_file="$1"
    local template_file="$2"
    local project_dir="$3"
    
    if [ ! -f "$template_file" ]; then
        echo "⚠️  No template found for $env_file (checked: $template_file)"
        return 1
    fi
    
    echo "Checking $env_file against $template_file"
    
    TEMPLATE_KEYS=$(get_template_keys "$template_file")
    ENV_KEYS=$(grep -v '^#' "$env_file" | grep -v '^$' | cut -d= -f1 | sort)
    
    if ! diff <(echo "$TEMPLATE_KEYS") <(echo "$ENV_KEYS") >/dev/null 2>&1; then
        echo "❌ $env_file does not match $template_file"
        echo "   Missing or extra keys detected"
        return 1
    else
        echo "✅ $env_file matches template"
        return 0
    fi
}

# Check each directory
for dir in "${TARGET_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        continue
    fi
    
    echo "📁 Checking $dir/ directory..."
    
    for project_path in "$dir"/*; do
        if [ ! -d "$project_path" ]; then
            continue
        fi
        
        project_name=$(basename "$project_path")
        
        # Look for .env files in this project
        for env_file in "$project_path"/.env "$project_path"/**/.env; do
            if [ -f "$env_file" ]; then
                # Determine which template to use
                env_dir=$(dirname "$env_file")
                local_template="$env_dir/.env.template"
                project_template="$project_path/.env.template"
                
                # Priority: local template > project template > root template
                if [ -f "$local_template" ]; then
                    template_to_use="$local_template"
                elif [ -f "$project_template" ]; then
                    template_to_use="$project_template"
                elif [ -f "$ROOT_TEMPLATE" ]; then
                    template_to_use="$ROOT_TEMPLATE"
                else
                    echo "❌ No template found for $env_file"
                    ERRORS=$((ERRORS + 1))
                    continue
                fi
                
                if ! check_env_file "$env_file" "$template_to_use" "$project_path"; then
                    ERRORS=$((ERRORS + 1))
                fi
                echo
            fi
        done
    done
done

# Summary
echo "📊 Environment Check Summary:"
if [ $ERRORS -eq 0 ]; then
    echo "✅ All .env files match their templates"
    exit 0
else
    echo "❌ Found $ERRORS environment file(s) with issues"
    echo "💡 Tip: Use .env.template files to define the expected structure"
    exit 1
fi
