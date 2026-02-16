# Specification

## Summary
**Goal:** Add menu management so Mom’s Kitchen can add new dishes and mark dishes as available/unavailable, and ensure unavailable dishes can’t be added to the cart.

**Planned changes:**
- Extend the backend menu item model to include an availability flag and return it from `getMenu` while keeping existing items loading safely.
- Add backend methods to create a new menu item (name, description, price, imageUrl) with a default availability value and to update a menu item’s availability by id (with clear errors for invalid ids).
- Update the Menu page to visually indicate unavailable dishes and prevent adding them to the cart, including an English user-facing message when attempted.
- Add a menu management screen/UI to create dishes and toggle availability using React Query mutations with loading and error states, refreshing the menu list after updates.

**User-visible outcome:** Users can add new dishes, mark dishes as available/unavailable, see which dishes are unavailable on the Menu page, and cannot add unavailable dishes to the cart.
