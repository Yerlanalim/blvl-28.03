# BizLevel Improvement Plan Tasks

This document outlines the tasks required to address the findings from the project audit conducted on April 1, 2024. These tasks focus on migrating the backend implementation to Firebase Firestore, adopting React Query for data fetching, and refining the codebase.

---

## Task 6.1: Migrate progress-service.ts to Firestore

**Goal:** Replace the current `localStorage`-based persistence in `progress-service.ts` with Firebase Firestore operations to enable persistent user progress tracking according to the project's defined backend stack.

**Key Files:**
- `src/lib/services/progress-service.ts`
- `src/lib/firebase/index.ts` (or `src/lib/firebase/firestore.ts`)
- `src/types/Progress.ts`
- `docs/dev-plan/bizlevel-project-description.md` (for schema reference)

**Detailed Steps:**

1.  **Import Firestore Functions:** Ensure necessary Firestore functions (`doc`, `getDoc`, `setDoc`, `updateDoc`, `arrayUnion`, `increment`, `serverTimestamp`, `writeBatch`, etc.) and the Firestore instance (`db`) are imported from `@/lib/firebase`.
2.  **Update `initializeUserProgress`:**
    *   Remove the `localStorage.setItem` call.
    *   Uncomment or implement the `setDoc` operation to save the `initialProgress` object to the Firestore `userProgress/{userId}` document.
3.  **Update `getUserProgress`:**
    *   Remove the `localStorage.getItem` call.
    *   Uncomment or implement the `getDoc` operation to fetch the document from `userProgress/{userId}`.
    *   Handle the case where the document doesn't exist (`!docSnap.exists()`) by calling `initializeUserProgress` as currently implemented.
    *   Return the document data (`docSnap.data()`) cast to `UserProgress`.
4.  **Update `markVideoWatched`:**
    *   Remove `localStorage.setItem` calls.
    *   Uncomment or implement the `updateDoc` operation for `userProgress/{userId}` using `arrayUnion(videoId)` for the `watchedVideos` field and `serverTimestamp()` for `lastUpdated`.
    *   Remove the separate `videoProgress` logging logic unless a subcollection is explicitly required and documented elsewhere. Update only the main `userProgress` document according to the schema in `bizlevel-project-description.md`.
5.  **Update `markTestCompleted`:**
    *   Remove `localStorage.setItem` calls.
    *   Uncomment or implement `updateDoc` for `userProgress/{userId}` using `arrayUnion(testId)` for `completedTests` and `serverTimestamp()` for `lastUpdated`.
    *   Remove the separate `testProgress` logging logic unless explicitly required.
6.  **Update `markArtifactDownloaded`:**
    *   Remove `localStorage.setItem` call for user progress.
    *   Uncomment or implement `updateDoc` for `userProgress/{userId}` using `arrayUnion(artifactId)` for `downloadedArtifacts` and `serverTimestamp()` for `lastUpdated`.
    *   Uncomment or implement the `updateDoc` operation for the `artifacts/{artifactId}` document using `increment(1)` for the `downloadCount`. Ensure error handling if the artifact document doesn't exist.
7.  **Update `completeLevel`:**
    *   Remove `localStorage.setItem` calls.
    *   Implement the logic to update `userProgress/{userId}`. This should likely include:
        *   Adding `levelId` to the `completedLevels` array (`arrayUnion`).
        *   Potentially updating `currentLevel`.
        *   Calculating updated `skillProgress` by calling `calculateSkillProgress` (from `skill-service`) and updating the map field.
        *   Calling `checkAndAwardBadges` (see Task 6.6) and updating the `badges` array.
        *   Setting `lastUpdated` using `serverTimestamp()`.
    *   Use a Firestore `writeBatch` or `transaction` for atomicity.
8.  **Implement/Update `checkAndAwardBadges` (as part of Task 6.6):**
    *   This function, called by `completeLevel`, determines new badges based on criteria and returns them.
9.  **Update `resetUserProgress`:**
    *   Remove `localStorage` calls.
    *   Implement logic to reset the `userProgress/{userId}` document, likely by calling `initializeUserProgress` and using `setDoc` to overwrite.
10. **Error Handling:** Wrap all Firestore operations in `try...catch` blocks. Log specific errors and re-throw or return appropriate indicators.
11. **Review Types:** Ensure data conforms to TypeScript types.

**Acceptance Criteria:**
- All functions in `progress-service.ts` interact with Firestore.
- User progress is correctly persisted in the Firestore `userProgress/{userId}` document.
- Artifact download counts are updated in the `artifacts/{artifactId}` document.
- Errors are handled.

---

## Task 6.2: Migrate skill-service.ts Data Access to Firestore (If Applicable)

**Goal:** Ensure `skill-service.ts` reads necessary data (e.g., level definitions) from Firestore instead of relying on potentially outdated mocks or parameters, if required for calculations.

**Key Files:**
- `src/lib/services/skill-service.ts`
- `src/lib/firebase/firestore.ts`
- `src/types/Level.ts`

**Detailed Steps:**

1.  **Review Data Dependencies:** Analyze functions like `calculateSkillProgress`, `getSkillRecommendations` to see if they need data from Firestore collections (e.g., `levels`).
2.  **Implement Firestore Reads (If Needed):** If needed:
    *   Import Firestore functions and `db`.
    *   Modify service functions to accept identifiers (e.g., `levelId`).
    *   Implement `getDoc` or `getDocs` to fetch required data (e.g., level data from `levels/{levelId}`).
    *   Handle errors.
3.  **Refactor Calling Functions:** Update callers (e.g., `completeLevel` in `progress-service`) to pass identifiers if the service now fetches its own data.

**Acceptance Criteria:**
- `skill-service.ts` functions fetch prerequisite data directly from Firestore if necessary.
- Skill calculations use potentially live data.

---

## Task 6.3: Migrate Data Fetching Hooks to React Query

**Goal:** Refactor data fetching logic in custom hooks to use React Query (`useQuery`, `useMutation`) for improved state management, caching, and code simplification, aligning with the documented tech stack.

**Key Files:**
- Hooks in `src/hooks/` (e.g., `useProgress`, `useLevels`, `useLevel`, `useArtifacts`, `useChat`, `useSettings`).
- Service files in `src/lib/services/`.
- `src/app/providers.tsx` (or `src/app/layout.tsx`).
- `src/hooks/useAuth.ts`.

**Detailed Steps:**

1.  **Setup React Query:**
    *   Install `@tanstack/react-query`.
    *   Create a `QueryClient`.
    *   Wrap the application layout with `<QueryClientProvider client={queryClient}>`. Consider adding DevTools.
2.  **Refactor `useProgress`:**
    *   Remove manual state (`progress`, `isLoading`, `error`).
    *   Use `useQuery`: `queryKey: ['userProgress', userId]`, `queryFn: () => getUserProgress(userId)`, `enabled: !!userId`.
    *   Use `useMutation` for update operations (`trackVideoWatched`, etc.): `mutationFn: progressServiceFunction`. Implement `onSuccess`/`onError` for cache invalidation (`queryClient.invalidateQueries(['userProgress', userId])`) and user feedback (Task 6.7).
    *   Return React Query state (`data`, `isLoading`, `isError`, `error`) and mutation functions (`mutate`, `isPending`).
3.  **Refactor `useLevels` / `useLevel`:** Adapt to use `useQuery` for fetching level list/details. Ensure service functions fetch from Firestore (Task 6.5). Define query keys (e.g., `['levels']`, `['level', levelId]`).
4.  **Refactor `useArtifacts`:** Adapt to use `useQuery` for fetching artifacts. Define query keys. Ensure service functions fetch from Firestore.
5.  **Refactor `useChat`:** Fetch history using `useQuery`. Use `useMutation` for sending messages.
6.  **Refactor `useSettings`:** Fetch user data (`users/{userId}`) using `useQuery`. Use `useMutation` for updates.
7.  **Update Components:** Modify components to use React Query hook returns (`isLoading`, `data`, `mutate()`, etc.).

**Acceptance Criteria:**
- Data fetching hooks use `useQuery` and `useMutation`.
- Manual fetch logic is removed.
- Data is cached and managed by React Query.
- Components consume data/status correctly.
- `QueryClientProvider` is set up.

---

## Task 6.4: Refactor/Consolidate useProfile Hook

**Goal:** Eliminate redundancy by removing the `useProfile` hook and updating the `ProfilePage` to use data sourced directly from Firestore via React Query hooks.

**Key Files:**
- `src/hooks/useProfile.ts`
- `src/app/(routes)/profile/page.tsx`
- `src/lib/data/user-progress.ts` (to be removed)

**Detailed Steps:**

1.  **Identify `ProfilePage` Data Needs:** List required data (user info, business info, skills, badges, progress).
2.  **Source Data via React Query:** Determine how to get this data using hooks refactored in Task 6.3 (e.g., `useProgress`, a query for `users/{userId}`). Helper functions (`getFormattedSkills`) might stay in `useProgress` or move.
3.  **Update `ProfilePage`:** Remove `useProfile` import/usage. Use refactored React Query hooks. Adapt component to hook returns.
4.  **Delete `useProfile.ts`:** Remove the file.
5.  **Remove Mock Data:** Delete or archive `src/lib/data/user-progress.ts`.

**Acceptance Criteria:**
- `useProfile.ts` is removed.
- `ProfilePage.tsx` uses React Query hooks for data.
- Profile page functions correctly with Firestore data.
- Mock progress data file is removed.

---

## Task 6.5: Migrate Other Data Sources (Levels, Artifacts, etc.) to Firestore

**Goal:** Ensure all application data (Levels, Artifacts) is fetched from Firestore, replacing mock data usage, and align data fetching with React Query.

**Key Files:**
- Service files for levels, artifacts (might need creation in `src/lib/services/`).
- Hooks (`useLevels`, `useLevel`, `useArtifacts`).
- Mock data files in `src/lib/data/`.
- `docs/dev-plan/bizlevel-project-description.md`.

**Detailed Steps:**

1.  **Identify Mock Data Usage:** Locate imports from `src/lib/data/`.
2.  **Create/Update Service Functions:** Create/update service functions (e.g., `getLevels`, `getLevelById`) to fetch data from Firestore collections (`levels`, `artifacts`) using `getDocs`/`getDoc`. Ensure data transformation matches types and handle errors.
3.  **Refactor Hooks:** Modify relevant hooks (`useLevels`, `useArtifacts`) to call the new service functions and use React Query (`useQuery`).
4.  **Update Components:** Ensure components work with React Query hooks.
5.  **Remove Mock Data Files:** Delete corresponding mock files from `src/lib/data/`.

**Acceptance Criteria:**
- Levels and artifacts data is fetched from Firestore.
- Related hooks use React Query and call Firestore-backed services.
- Mock data files are removed.

---

## Task 6.6: Implement Badge Awarding Logic in Firestore Service

**Goal:** Implement the specific service-layer logic to award badges based on defined criteria by updating the user's progress document in Firestore.

**Key Files:**
- `src/lib/services/progress-service.ts` (function `checkAndAwardBadges` or similar, integrated into `completeLevel`).
- `src/types/Progress.ts`.
- Task definition for badge criteria (e.g., `docs/dev-plan/task-4.3-badges-achievements.md`).

**Detailed Steps:**

1.  **Define Badge Criteria:** Refer to task docs for conditions for each badge.
2.  **Implement `checkAndAwardBadges` Logic:**
    *   Accept `UserProgress` as input.
    *   Check criteria against progress.
    *   If criterion met and badge not already achieved, create a new `Badge` object (with `id`, `name`, `description`, `achieved: true`, `achievedAt: serverTimestamp()`).
    *   Return array of newly earned `Badge` objects.
3.  **Integrate into `completeLevel`:**
    *   Call `checkAndAwardBadges` before writing to Firestore.
    *   Merge returned new badges into the `badges` array (handle duplicates).
    *   Include badge updates in the Firestore transaction/batch write for `completeLevel`.

**Acceptance Criteria:**
- Badges are correctly awarded based on criteria.
- `badges` array in Firestore `userProgress` document is updated correctly.
- Logic is integrated into `completeLevel` service function.

---

## Task 6.7: Enhance Error Handling & User Feedback

**Goal:** Implement a consistent and user-friendly error handling and feedback mechanism using UI notifications (toasts).

**Key Files:**
- Hooks performing mutations.
- `src/app/providers.tsx` or `src/app/layout.tsx`.
- Components triggering mutations.

**Detailed Steps:**

1.  **Setup Toast Library:** Choose, install, and configure a toast library (e.g., `react-toastify`, `sonner`, shadcn/ui Toast) via its Provider.
2.  **Integrate with React Query Mutations:**
    *   In `useMutation` options, implement `onSuccess` (show success toast) and `onError` (show error toast with message from `error` object).
3.  **Handle Query Errors:** In components using `useQuery`, check `isError`/`error` to display inline messages or trigger error toasts for critical failures.
4.  **Review Service Errors:** Ensure service functions throw/return meaningful errors for hooks to catch.

**Acceptance Criteria:**
- Toast system is implemented.
- Successful mutations show success toasts.
- Failed mutations/queries show error toasts/messages.
- Error handling is consistent.

---

## Task 6.8: Add Unit/Integration Tests

**Goal:** Improve code quality and reliability by adding unit and integration tests for critical parts of the application.

**Key Files:**
- New `*.test.ts`/`*.test.tsx` files alongside tested files.

**Detailed Steps:**

1.  **Setup Testing Environment:** Install/configure Jest and React Testing Library (or Vitest). Set up mocks (Firebase, React Query).
2.  **Test Service Functions:** Write unit tests for `progress-service.ts`, `skill-service.ts`. Mock Firestore calls. Verify correct arguments and handling of responses/errors.
3.  **Test Hooks:** Write integration tests using `renderHook`. Mock service functions. Verify hook returns and mutation behavior based on mocked responses.
4.  **Test Components:** Write tests for complex components. Render, simulate interactions (`fireEvent`), assert UI updates. Mock children/hooks.
5.  **Establish CI:** Configure CI (e.g., GitHub Actions) to run tests automatically.

**Acceptance Criteria:**
- Testing framework is set up.
- Key services and hooks have tests with good coverage.
- Complex components have basic tests.
- Tests pass in CI.

---

## Task 6.9: Code Cleanup & Documentation Update

**Goal:** Perform final code cleanup, remove unused elements, ensure consistency, and update project documentation to reflect the implemented changes.

**Key Files:**
- Entire codebase (`src/`).
- Documentation files (`README.md`, `status.md`, `docs/**/*.md`).

**Detailed Steps:**

1.  **Remove Unused Code:** Identify and remove unused variables, functions, imports, components, files (e.g., `debug` route if unused).
2.  **Ensure Consistency:** Review formatting (run Prettier), naming conventions, coding patterns.
3.  **Update Comments:** Ensure code comments accurately reflect the implementation.
4.  **Update `README.md`:** Update "Technology Stack" (React Query, Firebase). Update setup/usage instructions if needed.
5.  **Update `status.md`:** Update issues, completed tasks, component status.
6.  **Update Feature/Snapshot Docs:** Review `docs/features/`, `docs/snapshots/` for accuracy regarding data flow (React Query, Firestore).
7.  **Final Review:** Walk through the application to ensure functionality.

**Acceptance Criteria:**
- Unused code removed.
- Code formatting/naming consistent.
- Comments accurate.
- `README.md`, `status.md`, other docs updated.
- Application functions correctly.

--- 