# Architecture decisions

- Store learner-saved lessons in a user-scoped Cloud table with row-level access policies, so favorites persist across devices without exposing another learner's list.
- Run mood-based lesson recommendations in an authenticated Edge Function, so private learner input and AI credentials stay server-side and results are limited to saved lessons.
- Keep global navigation search scoped to the declared subject taxonomy and lesson catalog, so search results follow the learner-facing information architecture.