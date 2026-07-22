# Kliamo Storefront - Full QA Audit Report (Functional & Design)

This Quality Assurance (QA) report catalogs design inconsistencies, brand color deviations, validation omissions, and user experience issues across the Kliamo storefront (`apps/web`).

---

## 1. Design & Branding Audit (Color Inconsistencies)

### [Issue 1] Indigo Styling Contamination
- **Category**: Branding & Visual Design
- **Description**: Multiple components still utilize default Tailwind `indigo-` colors for text, backgrounds, focus rings, and badges, deviating from the warm peach (`#F9A37E`), sage green (`#A8C69F`), and charcoal brown (`#4A453E`) design system.
- **Affected Files**:
  1. [app/about/page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/about/page.tsx):
     - Line 162: `text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30` used for the page category badge.
     - Line 187: `bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500` applied to stats icons.
     - Line 212: `text-indigo-550 dark:text-indigo-400` applied to timeline milestone year text.
     - Line 226: `group-hover:border-indigo-550` applied to founder profile image hover borders.
  2. [app/contact/page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/contact/page.tsx):
     - Lines 118, 139, 160, 177: Form inputs focus rings use `focus:border-indigo-500`.
     - Lines 231, 245, 253: Contact detail page icons use `text-indigo-500` or hover styling `hover:text-indigo-500`.
  3. [app/profile/page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/profile/page.tsx):
     - Lines 971, 981: Account setting input text box focus rings use `focus:border-indigo-500`.
     - Line 1080: Addresses selection checkboxes use `accent-indigo-600`.
  4. [app/addresses/page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/addresses/page.tsx):
     - Line 40: Icon uses `text-indigo-500`.
     - Lines 70, 80, 91: Address edit form focus rings use `focus:border-indigo-500`.
     - Line 125: Address selection checkboxes use `accent-indigo-600`.
  5. [app/transactions/page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/transactions/page.tsx):
     - Line 27: Icon uses `text-indigo-500`.
     - Line 57: Ledger search box focus border uses `focus:border-indigo-500`.
  6. [app/notifications/page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/notifications/page.tsx):
     - Lines 24, 40: Notifications header icons use `text-indigo-500`.
     - Line 46: "Mark all as read" button uses `text-indigo-600`.
     - Line 63: Unread notification outline container uses `border-indigo-500 shadow-md shadow-indigo-50/20`.
     - Line 79: Action links use `text-indigo-600`.
  7. [app/orders/[id]/page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/orders/%5Bid%5D/page.tsx):
     - Line 113: "Back to Profile" link uses `text-indigo-600`.
     - Line 266: Total order summary cost uses `text-indigo-600 dark:text-indigo-400`.
  8. [app/orders/[id]/track/page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/orders/%5Bid%5D/track/page.tsx):
     - Line 83: Link uses `text-indigo-650`.
  9. [app/thank-you/page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/thank-you/page.tsx):
     - Line 54: Queue status badge uses `text-indigo-500`.
     - Line 78: Redirect link uses `text-indigo-600`.

---

## 2. Functional & UX Audit (Validations & Micro-interactions)

### [Issue 2] Missing Contact Form Client-side Validation
- **Category**: Input Validation
- **Description**: The Contact Us form ([app/contact/page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/contact/page.tsx)) checks only if fields are empty. It lacks email format verification (regex checks) or message length checks, which allows users to submit invalid inputs.
- **Affected File**: [app/contact/page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/contact/page.tsx) (line 90 onwards).

### [Issue 3] Address Book Form Validation Gaps
- **Category**: Input Validation
- **Description**: The Address details editor ([app/addresses/page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/addresses/page.tsx)) lacks:
  - Phone number structure checks (should validate exactly 10 digits).
  - Pincode formatting validation (should validate exactly 6 digits).
  - Proper email address regex validation.
- **Affected File**: [app/addresses/page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/addresses/page.tsx).

### [Issue 4] Canvas Customizer Checkout State Feedback
- **Category**: Feedback & Micro-interactions
- **Description**: Uploading custom designs to Cloudinary can take up to several seconds on slow network connections. The "Add to Cart" button in the Customizer does not change to a loading spinner or disable click events during this network upload window, permitting double clicks and redundant API requests.
- **Affected File**: [app/custom/page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/custom/page.tsx).

---

## 3. UI/Layout Consistency Audit

### [Issue 5] Missing Custom EmptyState Widget Integration
- **Category**: Page Layout
- **Description**: In both the Transactions list and Notifications center, empty states are rendered with plain borders/paragraphs rather than using the premium `EmptyState` component configured on products and categories pages.
- **Affected Files**:
  - [app/transactions/page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/transactions/page.tsx)
  - [app/notifications/page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/notifications/page.tsx)

### [Issue 6] Input Focus Outline Discrepancy
- **Category**: Design Style
- **Description**: The search input box in the FAQ and product catalog pages has a rounded peach glow focus style (`focus:ring-[#F9A37E]/50`), whereas static forms in the Contact and Address pages default to dark outline rings.
- **Affected Files**:
  - [app/contact/page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/contact/page.tsx)
  - [app/addresses/page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/addresses/page.tsx)

---

## 4. Suggested Fixes (Aesthetics & Logic Code Remediation)

1. **Replace Indigo Colors**: Swap out all `indigo-` selectors with equivalent peach color systems:
   - `text-indigo-500` -> `text-[#F9A37E]` (or `text-[#e8855a]`)
   - `bg-indigo-50` -> `bg-[#FBD5C1]/20`
   - `focus:border-indigo-500` -> `focus:border-[#F9A37E] focus:ring-[#F9A37E]/20`
   - `accent-indigo-600` -> `accent-[#F9A37E]`
2. **Apply Form Validation Rules**:
   - Implement regex checker checks for phone (`/^\d{10}$/`) and pincode (`/^\d{6}$/`) inside Address page validations.
   - Implement standard email syntax regex checking inside Contact and Profile page email input handlers.
3. **Upgrade Empty States**: Replace text nodes in Transactions/Notifications with standard `<EmptyState>` components.
