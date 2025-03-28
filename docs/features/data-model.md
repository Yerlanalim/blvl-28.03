# Data Model

## Overview
This document describes the core data types used throughout the BizLevel application.

## Types Hierarchy
- User-related types: Authentication, profiles, and business information
- Level-related types: Learning content, videos, tests, and artifacts
- Progress-related types: User progress, skill development, and achievements
- Artifact-related types: Downloadable resources and interaction tracking
- Chat-related types: Chat messages, history, and AI interactions

## Key Relationships
- Users have a UserProgress record tracking their journey
- Levels contain Videos, Tests, and Artifacts
- UserProgress tracks completed Levels, Videos, Tests, and Artifacts
- Skill development is calculated based on Level completion
   
## Type Definitions
Detailed type definitions can be found in the `/types` directory. 