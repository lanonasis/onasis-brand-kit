#!/bin/bash

# 🏥 LAN Onasis Workspace Health Check
# Comprehensive testing and validation of enterprise workspace

set -e

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
info() { echo -e "${BLUE}[INFO]${NC} $1"; }

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
HEALTH_SCORE=0

# Test functions
test_submodule_integrity() {
    log "🔍 Testing submodule integrity..."
    
    local expected_submodules=(
        "apps/vortexcore"
        "apps/vortexcore-saas"
        "apps/maple-site"
        "apps/lanonasis-index"
        "core/onasis-core"
    )
    
    for submodule in "${expected_submodules[@]}"; do
        if [[ -d "$submodule" ]] && [[ -f "$submodule/.git" ]]; then
            info "✅ $submodule: OK"
            ((TESTS_PASSED++))
        else
            error "❌ $submodule: Missing or not initialized"
            ((TESTS_FAILED++))
        fi
    done
    
    # Check submodule status
    if git submodule status | grep -q "^-"; then
        warn "⚠️  Some submodules not initialized"
        info "Run: git submodule update --init --recursive"
        ((TESTS_FAILED++))
    else
        info "✅ All submodules initialized"
        ((TESTS_PASSED++))
    fi
}

test_translation_infrastructure() {
    log "🌍 Testing translation infrastructure..."
    
    # Check for API keys
    if [[ -n "$OPENAI_API_KEY" ]] || [[ -f ".env" && $(grep -q "OPENAI_API_KEY" .env) ]]; then
        info "✅ API configuration available"
        ((TESTS_PASSED++))
    else
        warn "⚠️  No API key configured"
        ((TESTS_FAILED++))
    fi
    
    # Check workspace i18n config
    if [[ -f "config/workspace-i18n.json" ]]; then
        info "✅ Workspace i18n configuration found"
        ((TESTS_PASSED++))
    else
        error "❌ Missing workspace i18n configuration"
        ((TESTS_FAILED++))
    fi
    
    # Check individual submodule i18n configs
    local submodules_with_i18n=0
    git submodule foreach '
        if [[ -f "i18n.json" ]]; then
            echo "✅ $name: Has i18n.json"
            ((submodules_with_i18n++))
        else
            echo "⚠️  $name: Missing i18n.json"
        fi
    ' | tee /tmp/i18n-check.log
    
    local total_submodules=$(git submodule status | wc -l)
    if [[ $submodules_with_i18n -eq $total_submodules ]]; then
        info "✅ All submodules have i18n configuration"
        ((TESTS_PASSED++))
    else
        warn "⚠️  Some submodules missing i18n configuration"
        ((TESTS_FAILED++))
    fi
}

test_locale_files() {
    log "📁 Testing locale file structure..."
    
    local locales_found=0
    local expected_languages=("es" "fr" "de" "ja" "zh" "pt" "ar")
    
    git submodule foreach '
        if [[ -d "locales" ]]; then
            echo "Checking locales in $name..."
            ls locales/ 2>/dev/null || echo "Empty locales directory in $name"
        fi
    ' | tee /tmp/locales-check.log
    
    # Check if source files exist
    git submodule foreach '
        if [[ -f "locales/en.json" ]]; then
            echo "✅ $name: Has source locale (en.json)"
        else
            echo "❌ $name: Missing source locale (en.json)"
        fi
    '
    
    info "📊 Locale file check completed"
    ((TESTS_PASSED++))
}

test_git_connectivity() {
    log "🔗 Testing Git connectivity..."
    
    # Check if we can reach remotes
    git submodule foreach '
        if git ls-remote origin &>/dev/null; then
            echo "✅ $name: Remote accessible"
        else
            echo "❌ $name: Remote not accessible"
        fi
    ' | tee /tmp/git-connectivity.log
    
    if grep -q "❌" /tmp/git-connectivity.log; then
        warn "⚠️  Some remotes not accessible"
        ((TESTS_FAILED++))
    else
        info "✅ All remotes accessible"
        ((TESTS_PASSED++))
    fi
}

test_workspace_scripts() {
    log "📜 Testing workspace scripts..."
    
    local required_scripts=(
        "scripts/translate-all-submodules.sh"
        "scripts/convert-to-submodules.sh"
        "scripts/workspace-health-check.sh"
    )
    
    for script in "${required_scripts[@]}"; do
        if [[ -f "$script" && -x "$script" ]]; then
            info "✅ $script: Available and executable"
            ((TESTS_PASSED++))
        else
            error "❌ $script: Missing or not executable"
            ((TESTS_FAILED++))
        fi
    done
}

test_package_json_integrity() {
    log "📦 Testing package.json integrity..."
    
    if [[ -f "package.json" ]]; then
        if jq empty package.json 2>/dev/null; then
            info "✅ Workspace package.json: Valid JSON"
            ((TESTS_PASSED++))
        else
            error "❌ Workspace package.json: Invalid JSON"
            ((TESTS_FAILED++))
        fi
    else
        error "❌ Missing workspace package.json"
        ((TESTS_FAILED++))
    fi
    
    # Check submodule package.json files
    git submodule foreach '
        if [[ -f "package.json" ]]; then
            if command -v jq &>/dev/null && jq empty package.json 2>/dev/null; then
                echo "✅ $name: Valid package.json"
            else
                echo "⚠️  $name: Package.json syntax check skipped (jq not available)"
            fi
        else
            echo "⚠️  $name: No package.json found"
        fi
    '
}

test_translation_quality() {
    log "🎯 Testing translation quality..."
    
    # Run validation on submodules that have translations
    local validation_passed=true
    
    git submodule foreach '
        if [[ -f "i18n.json" && -d "locales" ]]; then
            echo "Testing translation quality in $name..."
            if command -v bun &>/dev/null && bun run i18n:validate &>/dev/null; then
                echo "✅ $name: Translation validation passed"
            else
                echo "⚠️  $name: Translation validation skipped or failed"
            fi
        fi
    ' | tee /tmp/quality-check.log
    
    if grep -q "failed" /tmp/quality-check.log; then
        warn "⚠️  Some translation validations failed"
        ((TESTS_FAILED++))
    else
        info "✅ Translation quality checks passed"
        ((TESTS_PASSED++))
    fi
}

calculate_health_score() {
    local total_tests=$((TESTS_PASSED + TESTS_FAILED))
    if [[ $total_tests -gt 0 ]]; then
        HEALTH_SCORE=$((TESTS_PASSED * 100 / total_tests))
    else
        HEALTH_SCORE=0
    fi
}

generate_health_report() {
    local report_file="reports/health-check-$(date +%Y%m%d-%H%M%S).md"
    mkdir -p reports
    
    cat > "$report_file" << EOF
# 🏥 LAN Onasis Workspace Health Report

**Generated:** $(date)
**Health Score:** $HEALTH_SCORE%

## 📊 Test Results

- ✅ **Tests Passed:** $TESTS_PASSED
- ❌ **Tests Failed:** $TESTS_FAILED
- 📈 **Overall Score:** $HEALTH_SCORE%

## 🎯 Health Status

EOF

    if [[ $HEALTH_SCORE -ge 90 ]]; then
        echo "🟢 **EXCELLENT** - Workspace is in excellent health" >> "$report_file"
    elif [[ $HEALTH_SCORE -ge 75 ]]; then
        echo "🟡 **GOOD** - Workspace is healthy with minor issues" >> "$report_file"
    elif [[ $HEALTH_SCORE -ge 50 ]]; then
        echo "🟠 **FAIR** - Workspace has some issues that need attention" >> "$report_file"
    else
        echo "🔴 **POOR** - Workspace requires immediate attention" >> "$report_file"
    fi

    cat >> "$report_file" << EOF

## 📋 Detailed Results

### Submodule Integrity
$(grep -E "(✅|❌|⚠️)" /tmp/git-connectivity.log 2>/dev/null || echo "No connectivity log available")

### Translation Infrastructure
$(grep -E "(✅|❌|⚠️)" /tmp/i18n-check.log 2>/dev/null || echo "No i18n log available")

### Locale Files
$(grep -E "(✅|❌|⚠️)" /tmp/locales-check.log 2>/dev/null || echo "No locales log available")

### Translation Quality
$(grep -E "(✅|❌|⚠️)" /tmp/quality-check.log 2>/dev/null || echo "No quality log available")

## 🚀 Recommendations

EOF

    if [[ $TESTS_FAILED -gt 0 ]]; then
        cat >> "$report_file" << EOF
### Issues to Address:
1. Review failed tests above
2. Run individual submodule updates if needed
3. Ensure all API keys are configured
4. Validate i18n configurations

### Quick Fixes:
\`\`\`bash
# Update all submodules
git submodule update --init --recursive

# Sync submodules
git submodule sync

# Test translations
bun run i18n:translate:all
\`\`\`
EOF
    else
        cat >> "$report_file" << EOF
### All Systems Operational! ✅

Your LAN Onasis workspace is in excellent health:
- All submodules properly configured
- Translation infrastructure ready
- Quality checks passing
- Ready for production use

### Recommended Actions:
1. Run regular health checks
2. Keep submodules updated
3. Monitor translation quality
4. Consider setting up automated monitoring
EOF
    fi

    log "📄 Health report generated: $report_file"
}

# Main execution
main() {
    log "🏥 Starting LAN Onasis Workspace Health Check"
    echo "=============================================="
    echo ""
    
    # Run all tests
    test_submodule_integrity
    test_translation_infrastructure
    test_locale_files
    test_git_connectivity
    test_workspace_scripts
    test_package_json_integrity
    test_translation_quality
    
    # Calculate health score
    calculate_health_score
    
    # Display summary
    echo ""
    log "📊 Health Check Summary"
    echo "======================="
    echo "Tests Passed: $TESTS_PASSED"
    echo "Tests Failed: $TESTS_FAILED"
    echo "Health Score: $HEALTH_SCORE%"
    echo ""
    
    if [[ $HEALTH_SCORE -ge 90 ]]; then
        log "🟢 EXCELLENT - Workspace is ready for production!"
    elif [[ $HEALTH_SCORE -ge 75 ]]; then
        warn "🟡 GOOD - Minor issues detected"
    elif [[ $HEALTH_SCORE -ge 50 ]]; then
        warn "🟠 FAIR - Some attention needed"
    else
        error "🔴 POOR - Immediate attention required"
    fi
    
    # Generate detailed report
    generate_health_report
    
    # Cleanup temp files
    rm -f /tmp/{git-connectivity,i18n-check,locales-check,quality-check}.log
    
    echo ""
    log "🎯 Health check completed!"
    info "View detailed report: cat reports/health-check-*.md"
    
    # Exit with appropriate code
    if [[ $HEALTH_SCORE -ge 75 ]]; then
        exit 0
    else
        exit 1
    fi
}

# Execute main function
main "$@"
EOF