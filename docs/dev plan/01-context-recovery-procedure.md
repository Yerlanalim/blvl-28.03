# Context Recovery Procedure

## When to Use This Procedure

Use this procedure whenever Cursor loses context about the project or when starting a new development session:

1. At the beginning of each new development session
2. When switching between different parts of the project
3. When Cursor seems confused about project structure or requirements
4. Before starting a new task

## Context Recovery Steps

Execute these steps in order:

```
1. Review the project structure

# Get a directory listing
find . -type f -not -path "*/node_modules/*" -not -path "*/\.git/*" -not -path "*/\.next/*" | sort

2. Review the current project status

# Open the status.md file to check current progress
cat status.md

3. Review the project description

# Open the project description document
cat docs/project-description.md

4. Check recent changes (if Git is initialized)

# Get recent commits
git log --oneline -n 5

# Check recent file changes
git diff --name-only HEAD~1 HEAD
```

## Feature-Specific Context Recovery

If working on a specific feature, also check:

1. Type definitions related to the feature:
```bash
cat types/[FeatureName].ts
```

2. Components related to the feature:
```bash
ls -la components/features/[feature-name]
```

3. Hooks related to the feature:
```bash
cat hooks/use[FeatureName].ts
```

4. Context providers related to the feature:
```bash
cat context/[FeatureName]Context.tsx
```

5. Feature documentation (if available):
```bash
cat docs/features/[feature-name].md
```

## After Context Recovery

Once context is restored:

1. Summarize your understanding of the current project state
2. Identify the next task to be performed
3. Confirm the task details from the development plan
4. Proceed with the task instructions
