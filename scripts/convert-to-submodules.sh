#!/bin/bash

# 🚀 LAN Onasis Monorepo to Enterprise Submodule Conversion
# Converts individual repositories to submodules for enterprise coordination

set -e

echo "🏗️  LAN Onasis Enterprise Submodule Conversion"
echo "=============================================="
echo ""

# Configuration
WORKSPACE_NAME="lan-onasis-workspace"
BACKUP_DIR="backups/$(date +%Y%m%d-%H%M%S)"
SUBMODULE_CONFIG_FILE="submodule-config.json"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Create backup directory
create_backup_dir() {
    log "Creating backup directory: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
}

# Backup existing repositories
backup_repository() {
    local repo_path="$1"
    local repo_name="$2"
    
    if [ -d "$repo_path" ]; then
        log "Backing up $repo_name..."
        tar -czf "$BACKUP_DIR/${repo_name}-backup.tar.gz" -C "$(dirname "$repo_path")" "$(basename "$repo_path")"
        info "Backup created: $BACKUP_DIR/${repo_name}-backup.tar.gz"
    else
        warn "Repository not found: $repo_path"
    fi
}

# Create submodule configuration
create_submodule_config() {
    log "Creating submodule configuration..."
    
    cat > "$SUBMODULE_CONFIG_FILE" << 'EOF'
{
  "workspace": {
    "name": "lan-onasis-workspace",
    "description": "Enterprise workspace for LAN Onasis ecosystem with submodule coordination",
    "version": "1.0.0"
  },
  "submodules": {
    "apps/vortexcore": {
      "url": "https://github.com/thefixer3x/vortexcore.git",
      "branch": "main",
      "description": "Personal finance management application"
    },
    "apps/vortexcore-saas": {
      "url": "https://github.com/thefixer3x/vortexcore-saas.git", 
      "branch": "VortexCore",
      "description": "Business finance SaaS platform"
    },
    "apps/maple-site": {
      "url": "https://github.com/thefixer3x/maple-site.git",
      "branch": "main", 
      "description": "Appointment booking platform"
    },
    "apps/lanonasis-index": {
      "url": "https://github.com/thefixer3x/LanOnasisIndex.git",
      "branch": "main",
      "description": "Corporate landing page"
    },
    "core/onasis-core": {
      "url": "https://github.com/thefixer3x/Onasis-CORE.git",
      "branch": "main",
      "description": "Privacy infrastructure and shared components"
    }
  },
  "i18n": {
    "strategy": "incremental",
    "languages": ["es", "fr", "de", "ja", "zh", "pt", "ar"],
    "coordination": "workspace-managed"
  }
}
EOF
    
    info "Submodule configuration created: $SUBMODULE_CONFIG_FILE"
}

# Initialize workspace repository
init_workspace() {
    local workspace_path="../$WORKSPACE_NAME"
    
    log "Initializing enterprise workspace: $WORKSPACE_NAME"
    
    if [ -d "$workspace_path" ]; then
        warn "Workspace already exists: $workspace_path"
        read -p "Do you want to recreate it? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$workspace_path"
        else
            error "Workspace setup cancelled"
            exit 1
        fi
    fi
    
    mkdir -p "$workspace_path"
    cd "$workspace_path"
    
    git init
    git config --local init.defaultBranch main
    
    info "Workspace initialized at: $workspace_path"
}

# Add submodule
add_submodule() {
    local path="$1"
    local url="$2"
    local branch="$3"
    local description="$4"
    
    log "Adding submodule: $path"
    info "  URL: $url"
    info "  Branch: $branch"
    info "  Description: $description"
    
    # Create directory structure
    mkdir -p "$(dirname "$path")"
    
    # Add submodule
    if git submodule add -b "$branch" "$url" "$path"; then
        log "✅ Successfully added submodule: $path"
    else
        error "❌ Failed to add submodule: $path"
        return 1
    fi
    
    # Initialize and update
    git submodule init "$path"
    git submodule update "$path"
}

# Create workspace structure
create_workspace_structure() {
    log "Creating enterprise workspace structure..."
    
    # Create main directories
    mkdir -p {apps,core,packages,docs,scripts,config}
    
    # Copy configuration files from monorepo
    cp "../lan-onasis-monorepo/i18n.json" "config/"
    cp "../lan-onasis-monorepo/package.json" "."
    cp "../lan-onasis-monorepo/.env.example" "."
    cp -r "../lan-onasis-monorepo/scripts" "."
    cp -r "../lan-onasis-monorepo/.github" "."
    
    # Create workspace-specific files
    create_workspace_readme
    create_workspace_package_json
    create_workspace_i18n_config
}

# Create workspace README
create_workspace_readme() {
    cat > "README.md" << 'EOF'
# 🏢 LAN Onasis Enterprise Workspace

## 🎯 Overview

Enterprise coordination workspace for the LAN Onasis ecosystem with automated submodule tracking and incremental translation processing.

## 🏗️ Architecture

```
lan-onasis-workspace/
├── apps/                    # Application submodules
│   ├── vortexcore/         → https://github.com/thefixer3x/vortexcore.git
│   ├── vortexcore-saas/    → https://github.com/thefixer3x/vortexcore-saas.git
│   ├── maple-site/         → https://github.com/thefixer3x/maple-site.git
│   └── lanonasis-index/    → https://github.com/thefixer3x/LanOnasisIndex.git
├── core/                   # Core infrastructure
│   └── onasis-core/        → https://github.com/thefixer3x/Onasis-CORE.git
├── config/                 # Centralized configuration
├── scripts/                # Automation scripts
└── docs/                   # Documentation
```

## 🚀 Quick Start

### 1. Clone with Submodules
```bash
git clone --recursive https://github.com/your-org/lan-onasis-workspace.git
cd lan-onasis-workspace
```

### 2. Update All Submodules
```bash
bun run update:all
```

### 3. Generate Translations
```bash
bun run i18n:translate:all
```

## 📋 Essential Commands

### 🔄 Submodule Management
```bash
# Update all submodules to latest
bun run update:all

# Update specific submodule
bun run update:app vortexcore

# Check submodule status
bun run status:submodules

# Sync all submodules
bun run sync:all
```

### 🌍 Translation Management
```bash
# Generate translations for all projects
bun run i18n:translate:all

# Validate translations across workspace
bun run i18n:validate:all

# Check translation coverage
bun run i18n:coverage:workspace

# Generate comprehensive report
bun run i18n:report:enterprise
```

## 🎯 Benefits

- **🔄 Automatic Tracking**: Changes in individual repos sync automatically
- **💰 Incremental Translation**: Only translate changed files
- **🏢 Enterprise Coordination**: Centralized oversight with team independence
- **📈 Scaling Ready**: Handles growth to 20+ applications
- **🚀 CI/CD Integration**: Coordinated deployments and translations

## 📚 Documentation

- [Submodule Management Guide](docs/submodule-guide.md)
- [Translation Workflow](docs/translation-workflow.md)
- [Enterprise Setup](docs/enterprise-setup.md)

EOF
}

# Create workspace package.json
create_workspace_package_json() {
    cat > "package.json" << 'EOF'
{
  "name": "lan-onasis-workspace",
  "version": "1.0.0",
  "description": "Enterprise workspace for LAN Onasis ecosystem",
  "private": true,
  "type": "module",
  "scripts": {
    "update:all": "git submodule update --remote --merge",
    "update:app": "scripts/update-submodule.sh",
    "sync:all": "git submodule sync && git submodule update --init --recursive",
    "status:submodules": "git submodule status",
    "status:detailed": "git submodule foreach 'echo $name: $(git log -1 --oneline)'",
    
    "i18n:translate:all": "scripts/translate-all-submodules.sh",
    "i18n:validate:all": "scripts/validate-all-translations.sh", 
    "i18n:coverage:workspace": "scripts/workspace-coverage.sh",
    "i18n:report:enterprise": "scripts/enterprise-report.sh",
    "i18n:sync:back": "scripts/sync-translations-back.sh",
    
    "dev:all": "scripts/dev-all.sh",
    "build:all": "scripts/build-all.sh",
    "test:all": "scripts/test-all.sh",
    
    "workspace:health": "scripts/workspace-health-check.sh",
    "workspace:init": "scripts/init-workspace.sh",
    "workspace:backup": "scripts/backup-workspace.sh"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  },
  "workspaces": [
    "apps/*",
    "core/*"
  ]
}
EOF
}

# Create workspace-specific i18n configuration
create_workspace_i18n_config() {
    cat > "config/workspace-i18n.json" << 'EOF'
{
  "version": 2.0,
  "$schema": "https://lingo.dev/schema/workspace-i18n.json",
  "workspace": {
    "name": "lan-onasis-workspace",
    "strategy": "incremental-submodule",
    "coordination": "centralized"
  },
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de", "ja", "zh", "pt", "ar"]
  },
  "submodules": {
    "apps/vortexcore": {
      "include": ["locales/[locale].json"],
      "tracking": "git-diff",
      "priority": "high"
    },
    "apps/vortexcore-saas": {
      "include": ["locales/[locale].json"],
      "tracking": "git-diff", 
      "priority": "high"
    },
    "apps/maple-site": {
      "include": ["locales/[locale].json"],
      "tracking": "git-diff",
      "priority": "medium"
    },
    "apps/lanonasis-index": {
      "include": ["locales/[locale].json"],
      "tracking": "git-diff",
      "priority": "medium"
    },
    "core/onasis-core": {
      "include": [
        "apps/*/locales/[locale].json",
        "services/*/locales/[locale].json",
        "packages/*/locales/[locale].json"
      ],
      "tracking": "git-diff",
      "priority": "critical"
    }
  },
  "incremental": {
    "enabled": true,
    "diffStrategy": "git-diff",
    "changeDetection": "submodule-commit",
    "batchSize": 50
  },
  "prompts": {
    "system": "You are a professional translator for the LAN Onasis fintech, SaaS, and privacy infrastructure ecosystem. Maintain brand consistency, technical accuracy, and professional tone across all applications. Preserve all HTML tags, placeholders like {{variable}}, and technical terms.",
    "context": "This is part of the LAN Onasis ecosystem including VortexCore (finance), Maple Site (appointments), and Onasis-CORE (privacy infrastructure). Maintain consistent terminology for financial terms, privacy concepts, and technical infrastructure across all languages and applications."
  },
  "ai": {
    "temperature": 0.1,
    "maxTokens": 2000,
    "providers": ["openai", "anthropic", "perplexity"]
  }
}
EOF
}

# Main execution
main() {
    log "Starting LAN Onasis Enterprise Submodule Conversion"
    
    # Create backup directory
    create_backup_dir
    
    # Backup existing repositories
    backup_repository "apps/vortexcore" "vortexcore"
    backup_repository "apps/vortexcore-saas" "vortexcore-saas"
    backup_repository "apps/maple-site" "maple-site"
    backup_repository "apps/lanonasis-index" "lanonasis-index"
    backup_repository "packages/onasis-core" "onasis-core"
    
    # Create configuration
    create_submodule_config
    
    # Initialize workspace
    init_workspace
    
    # Create workspace structure
    create_workspace_structure
    
    # Read submodule configuration and add submodules
    log "Adding submodules from configuration..."
    
    # Parse JSON and add submodules (simplified - would use jq in production)
    add_submodule "apps/vortexcore" "https://github.com/thefixer3x/vortexcore.git" "main" "Personal finance management"
    add_submodule "apps/vortexcore-saas" "https://github.com/thefixer3x/vortexcore-saas.git" "VortexCore" "Business finance SaaS"
    add_submodule "apps/maple-site" "https://github.com/thefixer3x/maple-site.git" "main" "Appointment booking"
    add_submodule "apps/lanonasis-index" "https://github.com/thefixer3x/LanOnasisIndex.git" "main" "Corporate landing"
    add_submodule "core/onasis-core" "https://github.com/thefixer3x/Onasis-CORE.git" "main" "Privacy infrastructure"
    
    # Initial commit
    git add .
    git commit -m "feat: initialize LAN Onasis enterprise workspace

- Add submodules for all applications and core infrastructure
- Configure incremental translation system
- Set up enterprise coordination scripts
- Create comprehensive documentation

This enables:
- Automatic tracking of individual repository changes
- Incremental translation processing (cost optimization)
- Enterprise-grade coordination with team independence
- Scalable architecture for future growth

🌍 Ready for professional multi-language ecosystem management"
    
    log "✅ Enterprise workspace conversion complete!"
    info "Workspace location: $(pwd)"
    info "Backups location: $(realpath "$BACKUP_DIR")"
    
    echo ""
    log "🎯 Next Steps:"
    echo "1. Set up remote repository for workspace"
    echo "2. Configure CI/CD for automated translations"
    echo "3. Test incremental translation workflow"
    echo "4. Train teams on submodule commands"
    echo ""
    log "🚀 LAN Onasis is now enterprise-ready!"
}

# Run main function
main "$@"
EOF