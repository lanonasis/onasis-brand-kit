# i18n Refactoring Strategy

**Date**: September 10, 2025
**Status**: ✅ Strategy Defined

## 1. Overview

This document outlines the strategy for refactoring the internationalization (i18n) implementation in the monorepo. The current hybrid approach, which combines a centralized `i18n.json` with per-app translation files, has led to inconsistencies and is difficult to maintain.

The new strategy will be a **pure per-app translation architecture**, with a shared translation module for common strings. This will simplify the architecture, reduce complexity, and make the codebase easier to maintain.

## 2. Chosen Library: `i18next`

We will use `i18next` as our primary i18n library. It has been selected for the following reasons:

*   **Framework Agnostic**: It can be used with any JavaScript framework, making it suitable for our diverse monorepo.
*   **Flexibility**: It supports multiple ways of loading translation files, including a shared "namespace" for common strings.
*   **Ecosystem**: It has a rich ecosystem of plugins and tools, including `i18next-parser` for automated string extraction.
*   **Maturity**: It is a well-established and widely used library with a large community and excellent documentation.

## 3. Implementation Plan

The refactoring will be carried out in the following phases:

1.  **Create a Shared Translation Package**: A new package will be created at `packages/shared-i18n` to store common translation strings.
2.  **Pilot Integration**: `i18next` will be integrated into one of the smaller apps (e.g., `apps/dashboard`) as a pilot.
3.  **Automated Extraction**: The `i18next-parser` tool will be used to scan the pilot app and extract all hardcoded strings into JSON files.
4.  **Refactoring**: The pilot app will be refactored to use the `t()` function from `i18next`.
5.  **Validation**: The changes will be thoroughly tested to ensure the app remains fully functional.
6.  **Rollout**: Once the pilot is successful, the same process will be applied to the other applications in the monorepo.
7.  **Cleanup**: The old central `i18n.json` file will be removed.

This phased approach will minimize risk and ensure a smooth transition to the new i18n architecture.