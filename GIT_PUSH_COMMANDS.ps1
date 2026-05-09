# Git Commands to Push TypeScript Migration PR (Windows PowerShell)
# Copy and paste these commands in your PowerShell terminal

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
# PowerShell Tips
# ============================================
# To run multi-line commit message, use backticks for line continuation:
git commit -m "feat: TypeScript migration - convert .js/.jsx to .ts/.tsx`n`n- Convert all JavaScript files to TypeScript across frontend, admin-dashboard, and server`n- Add TypeScript configuration files (tsconfig.json) for all projects`n- Create shared type definitions (40+ interfaces) for type safety`n- Update package.json with TypeScript and @types/* dependencies`n- Update all import statements to reference .ts/.tsx files`n- Fix critical bugs: remove dead AdminPage code, fix component exports (BannerOrbs→AmbientOrbs), remove non-existent imports (PageFlash)`n- Verify builds: Frontend ✓ (105 modules), Admin ✓ (51 modules), Server ✓`n- Migration Statistics: 88 files renamed, 88+ imports updated, 7 critical fixes applied`n`nBREAKING CHANGE: All application entry points now expect TypeScript-compiled output`n`nFixes: Issue #5"

# ============================================
# STEP 7: Create Pull Request on GitHub
# ============================================
# 1. Visit: https://github.com/YOUR_ORG/NexaSphere/pulls
# 2. Click "New Pull Request"
# 3. Select:
#    - Base: main (or your target branch)
#    - Compare: feat/typescript-migration
# 4. Click "Create Pull Request"
# 5. Copy content from GITHUB_PR_CONTENT.md into PR description

# ============================================
# OPTIONAL: View commit details
# ============================================

# Show full diff
git show --stat

# Show specific file changes
git show feat/typescript-migration:src/App.tsx

# Count total files changed
(git log --name-status feat/typescript-migration..main | Select-String -Pattern "^[AMD]" | Measure-Object).Count

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

# ============================================
# OPTIONAL: Cleanup
# ============================================
# Delete local branch after merge
# git branch -d feat/typescript-migration

# Delete remote branch after PR merged
# git push origin --delete feat/typescript-migration
