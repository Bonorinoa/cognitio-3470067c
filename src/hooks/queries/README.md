# `src/hooks/queries/`

**Single source of truth for all Supabase data access.**

Every Supabase query/mutation used by a component should live in a typed hook here, named `useXxx` (queries) or `useSaveXxx` / `useDeleteXxx` (mutations). Components import the hook; they never call `supabase.from(...)` directly.

## Why

- One place to fix when a table or column changes.
- Consistent cache keys → consistent invalidation.
- Components stay focused on presentation.
- Easier to mock in tests (mock the hook, not Supabase).

## Pattern

```ts
// src/hooks/queries/useInstructorServices.ts
const QUERY_KEY = "instructor-services" as const;

export const useInstructorServices = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEY, user?.id],
    queryFn: async (): Promise<InstructorService[]> => { ... },
    enabled: !!user,
  });
};

export const useSaveInstructorService = (editingId: string | null) => { ... };
export const useDeleteInstructorService = () => { ... };
```

Mutations should:
1. Use the matching `QUERY_KEY` for invalidation.
2. Show toast on success/error so callers don't have to.
3. Let the caller pass `onSuccess` for navigation/dialog-close logic.

## Migration status

| Domain                 | Hook file                          | Status |
| ---------------------- | ---------------------------------- | ------ |
| Instructor services    | `useInstructorServices.ts`         | ✅      |
| Courses (catalog)      | _todo_                             | ⏳      |
| Enrolled courses       | _todo_                             | ⏳      |
| Chapters / resources   | _todo_                             | ⏳      |
| Discussions            | _todo_ (currently in `useDiscussions.ts`) | partial |
| AI generations         | _todo_                             | ⏳      |
