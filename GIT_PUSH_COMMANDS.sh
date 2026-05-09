#!/bin/bash
# Git Commands to Push TypeScript Migration PR
# Copy and paste these commands in your terminal (one at a time or as a batch)

# ============================================
# STEP 1: Create feature branch
# ============================================
git checkout -b feat/typescript-migration

# ============================================
# STEP 2: Stage all changes
# ============================================
git add -A

# ============================================
# STEP 3: View changes before committing
# ============================================
git status

# ============================================
# STEP 4: Commit with descriptive message
# ============================================
git commit -m "feat: TypeScript migration - convert .js/.jsx to .ts/.tsx

- Convert all JavaScript files to TypeScript across frontend, admin-dashboard, and server
- Add TypeScript configuration files (tsconfig.json) for all projects
- Create shared type definitions (40+ interfaces) for type safety
- Update package.json with TypeScript and @types/* dependencies
- Update all import statements to reference .ts/.tsx files
- Fix critical bugs: remove dead AdminPage code, fix component exports (BannerOrbs→AmbientOrbs), remove non-existent imports (PageFlash)
- Verify builds: Frontend ✓ (105 modules), Admin ✓ (51 modules), Server ✓
- Migration Statistics: 88 files renamed, 88+ imports updated, 7 critical fixes applied

BREAKING CHANGE: All application entry points now expect TypeScript-compiled output

Fixes: Issue #5"

# ============================================
# STEP 5: Verify commit
# ============================================
git log -1 --stat

# ============================================
# STEP 6: Push to remote repository
# ============================================
# Option A: Push to feature branch (recommended)
git push origin feat/typescript-migration

# Option B: If pushing to main (use with caution)
# git push origin main

# ============================================
# STEP 7: Create Pull Request on GitHub
# ============================================
# 1. Visit: https://github.com/YOUR_ORG/NexaSphere/pulls
# 2. Click "New Pull Request"
# 3. Select:
#    - Base: main (or your target branch)
#    - Compare: feat/typescript-migration
# 4. Click "Create Pull Request"
# 5. Use the PR content from GITHUB_PR_CONTENT.md

# ============================================
# OPTIONAL: Commands for code review
# ============================================

# Show commit diff
git show --stat

# Show detailed changes in specific file
git show feat/typescript-migration:src/App.tsx

# Count total files changed
git log --oneline --name-status feat/typescript-migration..main | grep -E "^A|^M|^D" | wc -l

# ============================================
# OPTIONAL: Revert if needed
# ============================================
# git reset --hard HEAD~1
# git push origin feat/typescript-migration --force

# ============================================
# OPTIONAL: Merge locally and push main
# ============================================
# git checkout main
# git pull origin main
# git merge feat/typescript-migration
# git push origin main
