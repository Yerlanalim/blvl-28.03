# Documentation Guidelines

## Documentation Types and Locations

Follow these guidelines for all project documentation:

### 1. Status Documentation

Always update `status.md` after completing each task with:

```markdown
# BizLevel Project Status

## Last Updated: [YYYY-MM-DD]

## Current Development Focus
- [Current feature or component being developed]

## Recently Completed
- Task X.X: [Brief description of what was accomplished]
- Task X.X: [Brief description of what was accomplished]

## In Progress
- Task X.X: [Current status and next steps]

## Issues and Solutions
- [Problem]: [Solution or workaround]

## Next Milestones
- [Next features to implement]

## Component Status
- Authentication: [Complete/In Progress/Pending]
- Level Map: [Complete/In Progress/Pending]
- [Other components...]
```

### 2. Code Documentation

#### File Headers
Every file should have a header comment:
```typescript
/**
 * @file ComponentName.tsx
 * @description Brief description of the component's purpose
 * @dependencies List key dependencies (Firebase, contexts, etc.)
 */
```

#### Component Documentation
```typescript
/**
 * ComponentName
 * 
 * Description of what this component does.
 * 
 * @example
 * <ComponentName prop1="value" prop2={data} />
 * 
 * @see RelatedComponent - for additional context
 */
```

#### Function Documentation
```typescript
/**
 * functionName
 * 
 * Description of what this function does.
 * 
 * @param param1 - Description of parameter
 * @param param2 - Description of parameter
 * @returns Description of return value
 * @throws Conditions under which this function might throw an error
 */
```

#### Complex Logic Explanations
```typescript
// EXPLANATION:
// This algorithm works by first...
// Then it does...
// Finally it returns...
```

### 3. Feature Documentation

For each completed feature, create a documentation file in `/docs/features/` with this structure:

```markdown
# Feature Name

## Overview
Brief description of the feature

## Components
- ComponentName - Description and responsibility
- ComponentName - Description and responsibility

## Data Flow
1. Data is fetched from [source]
2. It's processed by [component/function]
3. It's displayed in [component]

## User Interactions
- When user clicks X, Y happens
- When form is submitted, Z happens

## Firebase Interactions
- Collection: [collection name]
- Operations: [read/write/update/delete]
- Security rules: [any special considerations]

## Testing
- How to test this feature
- Key edge cases to consider

## Screenshots
[Include relevant screenshots if available]
```

### 4. Snapshot Documentation

For complex components or features, create snapshot files in `/docs/snapshots/` with this structure:

```markdown
# [Component Name] Snapshot

## Purpose
[Brief description of what this component does]

## Key Files
- [List of relevant files]

## State Management
[Description of how state is managed]

## Data Flow
[Description of data inputs and outputs]

## Key Decisions
- [List important implementation decisions]

## Usage Example
```tsx
// Example code showing how to use the component
```

## Known Issues
- [List any known issues or limitations]
```

## Documentation Rules

1. **Keep documentation up-to-date**: Documentation must be updated immediately after completing each task
2. **Document as you go**: Don't wait until a feature is complete to document it
3. **Document decisions**: Record why certain approaches were chosen
4. **Link related documentation**: Reference related documents and components
5. **Use code examples**: Include real code examples whenever possible
6. **Keep documentation concise**: Focus on key information, avoid unnecessary details
7. **Use consistent formatting**: Follow the templates provided above
