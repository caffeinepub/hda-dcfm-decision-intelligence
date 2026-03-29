# elidi — Stable Login Fix

## Current State
- Internet Identity login works
- Profile completion (country + phone required) works
- Admin detection relies on email == "sathishsampath@gmail.com" typed at profile setup — fragile
- Blank page when landing on `/#caffeineAdminToken=...` URL — routing bug
- No persistence UX: returning users see the landing page instead of their dashboard

## Requested Changes (Diff)

### Add
- Backend: `isFirstUser()` query — returns true if no admin exists yet, so the first profile save auto-assigns admin
- Backend: `setSuperAdminByPrincipal(principal)` — callable only when no admin exists (bootstrap)
- Frontend: On app load, if user is already authenticated (session persists), check `hasCompletedProfile()` and redirect to `userDashboard` automatically
- Frontend: Handle `/#caffeineAdminToken=...` URL — after that token is processed by the platform, redirect to `adminDashboard` instead of showing blank page

### Modify
- Backend `saveUserProfile`: keep email-based super admin detection AND add fallback — if no admin exists yet at save time, also assign admin (belt-and-suspenders)
- Frontend App.tsx: on mount, check auth state and auto-navigate logged-in users to their dashboard
- Frontend AuthModal: after successful login+profile, navigate to dashboard (already done) — confirm works on return visits

### Remove
- Nothing removed

## Implementation Plan
1. Fix backend: strengthen admin assignment — email match OR first-user bootstrap
2. Fix App.tsx: on mount detect existing valid session → auto-navigate to userDashboard
3. Fix App.tsx: detect `caffeineAdminToken` in URL hash → after identity loads, navigate to adminDashboard
