# Kliamo Storefront - FAQ Component Documentation

The Frequently Asked Questions (FAQ) module serves as an interactive help center for clients, offering search, topic filters, collapsible answers, and SEO schema validation.

## Directory Structure

```bash
apps/web/app/faq/
├── FAQ_GUIDE.md   # This documentation file
├── layout.tsx     # Next.js Server Layout, exports SEO metadata & JSON-LD FAQPage Schema
└── page.tsx       # Next.js Client Page, handles interactive states, filters, and rendering
```

---

## 1. Features

### Real-Time Keyword Search
Users can query questions and answers instantly. The list filters dynamically as the user types. If no entries match the query, a dedicated empty state displays with a quick-reset action.

### Topic Filter Navigation
Quick-filter navigation tabs permit users to narrow down questions by specific tags:
- **All Topics**: Displays all matching entries.
- **Design Studio & Editor**: Dedicated to custom artwork uploads, canvas layers, and texts.
- **Ordering & Print Quality**: Contains information on wholesale MOQs and DTG printing details.
- **Shipping & Refunds**: Sizing check regulations, transport trackers, and print damage replacements.

### Accordion Toggle Transitions
Collapsible panels hide answers and expand with CSS height thresholds. Chevron indicators rotate dynamically to represent active toggle status.

### Support CTA Callout
A prominent Call-to-Action block at the footer redirects users needing personalized assistance to the `/contact` support channel.

---

## 2. Brand Alignment (Design System)

The UI utilizes colors aligned with the Kliamo storefront design standards:
- **Peach Accents (`#F9A37E` / `#FBD5C1`)**: Applied on active pill tab borders, help icons, and action buttons (`btn-primary`).
- **Cream Backgrounds (`#FDFAF6` / `#F5F0E8`)**: Used for containers and CTA highlights.
- **Charcoal Texts (`#4A453E`)**: Assigned for titles and high-contrast texts.

---

## 3. SEO Integration (JSON-LD Schema)

To maximize indexing compatibility and search visibility, a static **FAQPage** schema is embedded inside [layout.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/faq/layout.tsx):

- Matches the exact list of questions and answers defined in the client page.
- Enables Google Rich Results widgets (collapsible answers directly in Google search result cards).
- Embeds structured **Breadcrumb Schema** (`Home -> FAQ`).

---

## 4. How to Add/Edit FAQs

To add or modify questions in the catalog:

1. Open [page.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/faq/page.tsx).
2. Locate the static `categories` array.
3. Append a new object under the corresponding category:
   ```typescript
   {
     q: "Your new question?",
     a: "Your descriptive answer goes here."
   }
   ```
4. Sync the change by adding the exact question/answer text to the `FAQPage` JSON-LD schema inside [layout.tsx](file:///Users/user228/Desktop/Prosenjit%20Hazra/my-turborepo/apps/web/app/faq/layout.tsx) under the `mainEntity` list.
