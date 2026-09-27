# Firebase Security Specification for PHILOSTORYA Moroccan Streetwear

## Data Invariants
1. **User Invariant**: User profiles in `/users/{userId}` can only be created or modified by the authenticated user matching `userId`.
2. **Order Invariant**: Orders in `/orders/{orderId}` must contain valid Moroccan shipping details (full name, phone, city, address), item list within size boundaries (1 to 50 items), valid payment method ('cod' | 'card'), and cannot be modified or deleted by clients once placed.
3. **Cart & Wishlist Invariant**: Active cart and wishlist states in `/user_carts/{userId}` and `/user_wishlists/{userId}` are strictly scoped to the authenticated owner `request.auth.uid == userId`.
4. **Customer Reviews Invariant**: Reviews in `/reviews/{reviewId}` must have valid ratings (1-5), author name <= 128 characters, and comment length <= 1000 characters.
5. **Newsletter Invariant**: Subscribers in `/newsletter_subscribers/{subscriberId}` can only be created with valid email format, and cannot be listed or scraped by arbitrary clients.

## Dirty Dozen Payloads Test Matrix
1. **Unauthenticated Cart Write**: Writing to `/user_carts/user123` with `request.auth == null` -> **PERMISSION_DENIED**.
2. **Cross-User Cart Tampering**: User A (`auth.uid: userA`) attempting to read or write `/user_carts/userB` -> **PERMISSION_DENIED**.
3. **Ghost Field in User Profile**: Updating `/users/userA` with `{ role: 'admin', isSuperuser: true }` -> **PERMISSION_DENIED**.
4. **Order Status Tampering**: Updating `/orders/order123` to change `status: 'delivered'` or `totalMAD: 0` -> **PERMISSION_DENIED**.
5. **Orphaned Cart Query**: Attempting blanket listing on `/user_carts` without owner predicate -> **PERMISSION_DENIED**.
6. **Malicious Review Rating**: Submitting a review with `rating: 99` or `rating: -5` -> **PERMISSION_DENIED**.
7. **Junk ID Poisoning**: Creating an order with a 2048-character invalid document ID -> **PERMISSION_DENIED**.
8. **PII Scraping on Newsletter**: Querying all `/newsletter_subscribers` -> **PERMISSION_DENIED**.
9. **Fake Order without Address**: Creating an order missing `shippingDetails.address` or `phone` -> **PERMISSION_DENIED**.
10. **Arbitrary Write to Test Doc**: Writing to unmapped collection `/arbitrary_test` -> **PERMISSION_DENIED**.
11. **User Profile Deletion by Stranger**: Sending delete request to `/users/userA` from `userB` -> **PERMISSION_DENIED**.
12. **Oversized Review Payload**: Submitting a 50KB string inside `comment` -> **PERMISSION_DENIED**.
