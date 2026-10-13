# Architecture decisions

- Store learner-saved lessons in a user-scoped Cloud table with row-level access policies, so favorites persist across devices without exposing another learner's list.