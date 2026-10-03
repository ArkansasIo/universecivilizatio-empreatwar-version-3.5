# Security Specification & Test Payloads

## Data Invariants
1. A user's profile and resource documents can only be accessed or modified by the authenticated owner (`request.auth.uid == userId`) or an authenticated administrator.
2. Market orders can be read by any authenticated player, but created only with the caller's verified `sellerId` and positive numerical values.
3. System configurations can only be modified by administrative users (`stephendeline258@gmail.com`).
4. Timestamps and user IDs are immutable upon update.

## The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Profile Read**: Attempting to read `/users/victim_123/profile/main` without auth token -> EXPECT PERMISSION_DENIED.
2. **Identity Spoofing Profile Create**: User `attacker_1` attempts to write `/users/victim_2/profile/main` with `id: victim_2` -> EXPECT PERMISSION_DENIED.
3. **Admin Elevation Attempt**: Non-admin user attempts to write or alter documents in `/system_configs/default` -> EXPECT PERMISSION_DENIED.
4. **Negative Resource Injection**: User attempts to update resources with `naquadah: -5000000` -> EXPECT PERMISSION_DENIED.
5. **Ghost Field Poisoning**: Profile write containing unauthorized property `is_super_admin: true` -> EXPECT PERMISSION_DENIED.
6. **Cross-Tenant Colony Theft**: User `attacker_1` attempts to delete `/users/victim_2/colonies/colony_1` -> EXPECT PERMISSION_DENIED.
7. **Market Spoofing**: User `attacker_1` listing a trade order with `sellerId: victim_2` -> EXPECT PERMISSION_DENIED.
8. **Negative Market Quantity**: Order payload with `amount: -100` -> EXPECT PERMISSION_DENIED.
9. **Zero or Negative Price Exploit**: Order payload with `pricePerUnit: -50` -> EXPECT PERMISSION_DENIED.
10. **Unauthenticated Market List**: Unauthenticated client attempting to scrape market orders -> EXPECT PERMISSION_DENIED.
11. **Immutability Breach**: Updating `/users/user_1/profile/main` while altering `id` to `user_9` -> EXPECT PERMISSION_DENIED.
12. **Oversized String Buffer Attack**: Profile payload with a `username` string greater than 64 characters -> EXPECT PERMISSION_DENIED.
