# Proposed Asset Reorganization Plan

## Issues Found:
1. primary-logo.svg, favicon.svg, and brand-redesign-master.svg are all the same 1.9MB design board file
2. These files contain favicon guides and other design elements, not individual logo assets
3. No proper individual SVG logo files exist in the structure

## Proposed Actions:

### 1. Source Folder
- Keep `brand-redesign-master.svg` as the master design file
- Add note that individual assets need to be extracted from this file

### 2. 01_LOGOS Folder
- Remove current `primary-logo.svg` (it's the design board)
- Keep PNG versions for now
- Add TODO to extract clean SVG logos from master file
- Create placeholder files:
  - `primary-logo-extracted.svg` (to be created)
  - `icon-only.svg` (to be created)
  - `wordmark-only.svg` (to be created)

### 3. 02_FAVICONS Folder
- Remove `favicon.svg` (it's the same design board)
- Keep all PNG/ICO favicon files as they are properly sized
- Add TODO to create proper favicon.svg from extracted icon

### 4. Large SVG Files
- Move all multi-MB SVG files to a new `source/design-boards/` folder
- These are clearly design files, not production assets

### 5. Documentation Updates
- Update README files to clarify which files need extraction
- Add extraction instructions to source folder
- Update FILE_MAPPING.md to reflect new structure

## Next Steps:
1. Create backup of current state
2. Apply the moves and deletions
3. Create placeholder files with TODOs
4. Update documentation
5. Commit changes with clear message about the cleanup
