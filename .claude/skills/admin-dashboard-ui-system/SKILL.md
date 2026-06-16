---
name: admin-dashboard-ui-system
description: Build any admin dashboard with the exact structural grammar, spacing rhythm, component anatomy, and interaction language of the reference admin panel — but with its own theme and use case. No colors, no tech stack. Pure UI design specification.
---

# Admin Dashboard UI System

Use this skill whenever building an admin dashboard from scratch or redesigning one. Apply every section as a strict blueprint. The goal is to produce a dashboard whose **visual grammar, spatial rhythm, and component hierarchy** feel as polished and considered as the reference system — regardless of domain, color scheme, or technology.

---

## Part 1 — Shell Architecture

### The Three-Region Rule

Every admin dashboard using this system is composed of exactly three fixed regions:

1. **Left Sidebar** — navigation, identity, user context
2. **Top Header** — global search, utility actions, user profile
3. **Scrollable Content Area** — all page content lives here

These three regions never overlap. The content area scrolls freely beneath the fixed header. The sidebar stands fully independent, from viewport top to bottom.

### Desktop Proportions

- Sidebar occupies a **fixed-width column on the left** — wide enough to show icons with labels comfortably, narrow enough to feel structural rather than dominant. The expanded sidebar takes roughly one-fifth of a 1280px viewport. The collapsed sidebar exposes only icons, taking roughly one-sixteenth.
- Header spans the remaining width (right of sidebar), fixed at the top.
- Content area fills all remaining space, with generous horizontal padding framing content on 1280–1440px viewports.
- No visible gutter between sidebar and content. The structural separation comes from shadow/separator treatments, not a gap or hard border.

### The Header–Sidebar Junction

This is the most precise alignment in the entire shell and must be exact:

- Both the sidebar's brand zone and the header are **exactly 80px tall**.
- The header's left edge starts precisely where the sidebar's right edge ends — it uses a **dynamic left offset** that switches between the collapsed-sidebar width and the expanded-sidebar width. There is zero gap and zero overlap.
- The sidebar sits at `z-index: 20`, the header at `z-index: 10`. The sidebar is "in front" at the junction corner — if they ever touch visually, the sidebar wins.
- The header uses a **semi-transparent background with backdrop blur** (80% opacity + blur). This creates a frosted-glass effect as content scrolls under it, but the sidebar behind it is solid — so at the top-left corner the two surfaces sit flush and at the same visual level without blending into each other.
- The result: the top-left of the viewport reads as one unified 80px horizontal bar — brand on the left in solid sidebar, search and actions on the right in frosted header — with no visible crack, gap, or layering artifact between them.

When the sidebar collapses, the header's left offset animates simultaneously with the sidebar width change (`transition-all duration-300`), so they always stay flush.

### Collapse Behavior

The sidebar must support two states: **expanded** (icon + label) and **collapsed** (icon only). A toggle control lives inside the sidebar header itself — not floating elsewhere. In collapsed mode:
- All labels vanish.
- Icons remain centered in the narrower column.
- The user profile footer collapses to an icon-only form.
- The browser native `title` attribute provides the tooltip in collapsed mode — no custom tooltip component needed.

Collapsing and expanding animate width smoothly at 300ms. The header left-offset and content left-margin animate in sync.

### Mobile Shell

On mobile viewports:
- The sidebar is **off-canvas** by default, fully hidden.
- A hamburger icon in the mobile top bar triggers a left-side slide-in overlay.
- A semi-opaque full-viewport backdrop appears behind the open sidebar; tapping it closes it.
- The mobile top bar is its own simpler component — branding + hamburger on the left, a compact icon cluster on the right. It sits at `z-index: 50`.
- The off-canvas sidebar sits at `z-index: 40` — above content, below the mobile bar.
- Sidebar nav semantics, active states, and user zone are identical to desktop.

---

## Part 2 — Sidebar Design Grammar

### Dimensions

- Height: 100% viewport height, fixed position.
- Navigation zone: fills all available space between brand zone and user zone. Scrollable internally if items overflow.

### Three Vertical Zones

The sidebar has exactly three zones, always in this order:

1. **Brand zone** — logo or product name, plus collapse toggle. Fixed height matching the header (80px).
2. **Navigation zone** — flex-1, overflow-y-auto.
3. **User zone** — pinned to the bottom.

Each zone boundary uses a **hairline gradient separator** (see Part 16 for exact mechanics) — never a solid border.

### Brand Zone

- Product wordmark or logo: left-aligned, vertically centered.
- Collapse toggle: far right of the zone, icon-only, ghost style (chevron left / chevron right).
- In collapsed state: monogram or icon mark, centered in the narrower column.
- The 80px height is non-negotiable — it creates the optical alignment with the header across the viewport.

### Navigation Zone

**Item anatomy:**
- Single row: icon (left, 20×20px) + label (right, 14px, medium weight).
- Gap between icon and label: 12px exactly.
- Total item height: minimum 40px (touch-target compliance). Achieved via `py-2` on an `h-auto` container.
- Horizontal padding: 12px both sides.
- Corner radius: `rounded-lg`.
- `transition-all duration-150` on every item.

**Active state:**
- Background: primary color at ~10% opacity.
- Text: primary color, semibold.
- No left border strip. The fill alone is the indicator.
- Sub-routes are recognized as active — a detail page for a record type highlights the same nav item as its parent list page. This requires path-prefix matching (`pathname.startsWith(item.href + '/')`), not just exact match.

**Inactive state:**
- Text: muted foreground (~70% opacity of body text).
- Hover: muted background at 50% opacity + `translate-x-0.5` (2px right shift). The shift is barely perceptible but communicates clickability through motion, not just color.
- Transition: 150ms.

**Section grouping:**
- Nav items with more than 7 entries must be grouped.
- Group labels: 10–11px, all-caps, wide letter-spacing, muted, no interactivity.
- Gap between items within a group: 4px (`space-y-1`).

**Collapsed navigation:**
- Icons only, perfectly centered horizontally.
- Same active/hover logic applied to the icon container.

### User Zone

**Expanded state:**
- Hairline gradient separator above (see Part 16).
- Padding: 16px all sides.
- Layout: flex row — avatar (left) + name/email block (center, flex-1) + logout button (right).
- Avatar: 32×32px, circular, 2px ring in standard border color.
- Name: 14px, medium, truncated.
- Email or role: 12px, muted, truncated, monospace font.
- Logout: ghost variant, small (32px height).

**Collapsed state:**
- Padding: 8px all sides.
- Only the logout icon button, full-width, centered.

---

## Part 3 — Header / Topbar Grammar

### Proportions

- Height: 80px. Non-negotiable (see header–sidebar junction in Part 1).
- Fixed to the top. Background: card/page surface at 80% opacity + backdrop blur.
- Horizontal padding: 24px both sides.
- The bottom edge has a **vanishing gradient separator** (not a solid border-bottom — see Part 16 for exact mechanics).

### Internal Layout (Left to Right)

**Left: Search control**
- Styled input-lookalike. Max width: ~320px.
- Contains: search icon (16×16, muted, left-inset), placeholder text, keyboard shortcut `kbd` hint (hidden on small screens, right side).
- Background: muted at 50% opacity. Border: standard 1px control border.
- Corner radius: `rounded-lg`.
- Shadow: `shadow-rigid-sm`.
- Hover: border brightens to ring-color at 50%, background shifts to full muted.
- On focus or click: opens search or command palette — it is not a plain text input.

**Right: Action cluster**

In this exact left-to-right order:
1. Theme toggle (icon-only, ghost, 32×32px)
2. Settings trigger (icon-only, ghost, 32×32px — hidden below `lg` breakpoint)
3. Notifications dropdown trigger (icon-only, ghost, 32×32px — has badge overlay)
4. Vertical hairline divider (8px tall, 1px wide, muted border color, `mx-4`)
5. User profile chip (avatar + optional name + role)

Gap between items 1–3: 4px. They read as a single visual cluster.

**Notification badge:**
- Absolute position: `-top-0.5 -right-0.5` of the bell icon container.
- 16×16px, circular, fully rounded, destructive-color background.
- Text: 10px, bold, white. Displays the count, capped at "9+".
- Must not require overflow:visible on the icon button — position the badge within the button's natural bounds.

**User profile chip:**
- On hover: muted background tint, `rounded-lg`, `px-2 py-1.5`.
- Avatar: 32×32px, circular, 2px ring.
- Name text (hidden below `lg`): 14px, medium, right-aligned in its column.
- Role label (hidden below `lg`): 12px, muted, below the name.

### Notifications Dropdown

- Anchored right-aligned below the bell button: `top-full mt-2` from the trigger.
- Width: 320px (mobile) / 384px (desktop). Max height: 320px with internal scroll.
- Corner radius: `rounded-xl`.
- Shadow: `shadow-rigid-md`.
- Entrance: fade-in + zoom-in from 95% + slide down 8px. Duration: 200ms.

**Dropdown header:**
- Padding: 12px horizontal, 12px vertical.
- "Notifications" label: 14px, semibold, left side.
- Unread count badge: secondary variant, right side of the label.
- "Mark all read": 12px, muted, far right, underline on hover.
- Hairline separator below this row.

**Each notification item:**
- Padding: 16px horizontal, 12px vertical.
- Hairline separator between items; last item has none.
- Hover: muted background tint.
- Unread item background: muted at 30%.
- Layout: icon (left, aligned to top, 16×16px) + content block (flex-1, margin-left 12px).
  - Title: 14px, semibold if unread / medium if read. Inline unread dot (6×6px, primary color) to the right of the title text.
  - Description: 12px, muted, margin-top 2px.
  - Timestamp: 12px, muted at 60%, margin-top 4px.

---

## Part 4 — Card Anatomy

Cards are the dominant surface. Almost everything lives inside a card — never floating raw on the page background.

### Base Card Proportions

- Corner radius: `rounded-xl`.
- Border: 1px standard border color.
- Background: card surface (visually distinct from — and slightly lighter than — the page background).
- Default shadow: `shadow-rigid` (see shadow system below).
- Vertical internal padding (default): 24px top and bottom, established by the card's own padding shorthand.
- Horizontal padding: 24px, applied per-zone (header, content, footer).

### The Neo-Brutalist Shadow System

This is the most distinctive visual characteristic of this design system. All shadows are **multi-layer, directional, and hard-edged** — not gaussian blurs.

**Layer composition of `shadow-rigid`:**
1. **Hard offset layer** — `5px 5px 0 0` at ~15% opacity. Creates the characteristic bottom-right "weight." This is what makes every card look like it has physical depth.
2. **Soft counter-shadow** — `-2px -2px 4px 0` at ~4% opacity. Balances the hard offset with a subtle lift from the top-left.
3. **Ambient glow** — `0 1px 8px -2px` at ~8% opacity. A soft vertical spread giving the card warmth.
4. **Inner depth** — `inset 0 2px 6px -1px` at ~8% opacity. An inset shadow at the top creates the illusion that the card surface is slightly concave — reinforcing the physical material feel.

**Shadow tiers:**

| Tier | Name | Composition | Used For |
|------|------|-------------|----------|
| 0 | `shadow-rigid-sm` | Scaled-down version of the 4-layer system | Inputs, buttons, inline controls |
| 1 | `shadow-rigid` | Full 4-layer system | Standard content cards |
| 2 | `shadow-rigid-md` | Amplified offset + opacity | Primary cards, dropdowns, elevated surfaces |
| 3 | `card-hover-lift` | `shadow-rigid-md` + `translateY(-2px)` | Stat card hover state |

**Dark mode behavior:** The hard offset layers are replaced with border-emphasis and inner-glow techniques — the characteristic offset shadows become invisible on dark backgrounds and are substituted with a brightened border and inset glow.

**Critical rule:** Never substitute these with standard shadow presets. The character of this system depends entirely on the hard-offset, multi-layer shadow language.

### Card Zones

**CardHeader:**
- Padding: 24px horizontal, 24px vertical.
- Layout: when an action control exists, use a two-column grid — content (flex-1) + action (auto). Otherwise single column.
- Title: semibold, 18–20px.
- Description: 14px, muted, margin-top 4px.
- The CardHeader title area often includes a small **icon tile** (see stat card pattern) on the far left: `p-2 rounded-lg` container + 20×20 icon inside.
- A hairline gradient separator below the header is added when content follows — **not** a solid border.

**CardContent:**
- Padding: 24px horizontal. Top padding removed when immediately following a CardHeader (the header's bottom padding provides the gap).

**CardFooter:**
- Padding: 24px horizontal. Hairline separator above.
- Flex row, items-center. Action buttons sit on the right.
- Pagination lives here, not below the card.

### Stat Cards (Dashboard Metrics)

Three decoration elements in addition to standard card anatomy:

1. **Top accent strip** — `absolute top-0 left-0 right-0 h-[3px]`. A 3px bar spanning the full card width at the top edge. Uses a semantic color at 50% opacity. Positioned inside the card's `overflow-hidden` context.
2. **Decorative dot pair** — Two tiny circles positioned absolute in the upper-right interior of the card.
   - Larger dot: 6×6px, semantic color at 15% opacity. Position: `top-5 right-5`.
   - Smaller dot: 4×4px, semantic color at 10% opacity. Position: `bottom-4 right-10`.
   - These carry zero semantic meaning. They create visual rhythm inside the card surface.
3. **Hover lift** — `translateY(-2px)` + shadow upgrades to `shadow-rigid-md`. Transition: 200ms.

Stat card internal layout:
- Icon tile: `p-2 rounded-lg` container at ~40×40px, semantic tint background, 20×20px icon inside.
- Metric label: 14px, medium, muted. Sits **above** the value.
- Metric value: 24px, bold, high-contrast foreground.
- Optional secondary line: 12px, muted. Trend note or sub-label.

Grid placement: always `grid-cols-2 md:grid-cols-4 gap-4`. Entrance animation staggered left-to-right (50–80ms per card).

---

## Part 5 — Table System

Tables are **dense and administrative**. They pack information efficiently at the cost of whitespace.

### DOM Structure

The overflow container is a `<div>` wrapper — `relative w-full overflow-x-auto` — not the `<table>` element itself. This is intentional: the table always renders at full natural width, and the wrapper clips it with horizontal scroll on narrow viewports.

```
<div class="relative w-full overflow-x-auto">        ← scroll wrapper
  <table class="w-full caption-bottom text-sm">      ← table
    <thead>...</thead>
    <tbody>...</tbody>
  </table>
</div>
```

### Column Headers

This is the most distinctive table detail in the system:

- Background: `bg-muted/30` on the entire header row.
- Bottom border: **2px** (thicker than body row separators which are 1px). This extra weight anchors the header visually above the data.
- Cell text: **11px, all-caps, widest letter-spacing, foreground at 60% opacity**. No bold needed — the uppercase + extreme tracking creates hierarchy without weight.
- Cell height: `h-10` (40px) via `py-3.5` (14px padding per side).
- Horizontal cell padding: 8px (`px-2`).
- `whitespace-nowrap` — headers never wrap.
- Hover state on the header row: none. The `hover:bg-muted/30` rule keeps it static (identical to default).

### Data Rows

- Default cell padding: `p-2` (8px all sides) at the component level. Individual pages commonly override vertical to `py-4` (16px) for a more breathable row height of ~48–52px total.
- `whitespace-nowrap` on all cells — content truncates with ellipsis, never wraps.
- `align-middle` — all cell content is vertically centered.
- Row border: `border-b border-border`. The **last row has no bottom border** — achieved by `[&_tr:last-child]:border-0` on the `<tbody>` wrapper, not on individual rows.
- Row hover: `hover:bg-muted/50`, `transition-colors`.
- Selected row: `data-[state=selected]:bg-muted`.

**Two-line cells:**
- Primary text: 14px, foreground.
- Secondary text below it: 12px, muted, `mt-0.5`.
- Both in a flex-col container within the cell.

**ID / reference cells:**
- Monospace font, 14px.
- Often muted or slightly de-emphasized (secondary foreground) to prevent IDs from dominating visual attention.

**Clickable cells / row links:**
- Primary identifier cell often renders as a link: primary color, hover underline, `hover:text-primary/80`.
- The entire row is not a link — only the identifier cell is.

**Action cells (rightmost column):**
- Header label: blank or "ACTIONS" in the standard all-caps style.
- Cell content: flex row, `gap-1`, `justify-end`.
- Each action: ghost icon button, 32×32px (`size-sm`), 16×16px icon.
- **Invisible at rest, revealed on row hover.** Group the row with CSS hover state to expose the buttons. This prevents visual clutter in dense tables.

**Status badge cells:**
- Always use a pill badge — never raw text.
- Semantic tint variant: light background + matching foreground text. Not a filled opaque badge.

### Pagination

Pagination lives in the **CardFooter** of the same card as the table — never below the card, never in a separate element.

**Layout:** `flex items-center justify-between`, with `border-t border-border pt-6 mt-6` creating a top hairline that visually separates it from the last row.

**Left side:** "Showing X to Y of Z" — 14px, muted foreground.

**Right side:** `flex items-center gap-2`
- Previous button: outline variant, `size="sm"` (32px height). Disabled + 50% opacity when on first page.
- Page number buttons: Up to 5 visible at once, centered around the current page. Scroll the window of visible pages as the user navigates.
  - Active page: **inverted** — foreground-color background, background-color text (`bg-foreground text-background hover:bg-foreground/90`). Visually the strongest element in the pagination row.
  - Inactive pages: outline variant, muted text, standard border.
  - No ellipsis (`...`) in the default implementation — simply show adjacent pages, starting/ending the window at boundaries.
- Next button: same as Previous.

Default page size: 10 rows.

---

## Part 6 — Multi-Page Navigation and Drill-Down Pattern

This is the core interaction pattern of the dashboard: a **list page → detail page** navigation model that keeps the shell (sidebar + header) completely unchanged while swapping only the content area.

### The Shell Is Constant

When navigating from a list page to a detail page of the same entity type:
- The sidebar does not change, reload, or re-animate.
- The header does not change, reload, or re-animate.
- The active nav item in the sidebar **remains highlighted** because active state uses prefix-matching — `/records/abc123` continues to activate the `/records` nav item.
- Only the content area changes.

This consistency makes the shell feel like a stable operating environment, not a collection of separate pages.

### List Page → Detail Page

**Trigger:** Clicking the primary identifier in a table row (rendered as an in-cell link). NOT the entire row — a specific cell.

**Visual response:** The content area fades in the detail view. No full-page flash. No sidebar or header flicker.

**URL pattern:** `/entity-type/[id]` — the list is at `/entity-type`, the detail is at `/entity-type/[id]`. The nav item's `href` is `/entity-type`, and it activates for both.

### Detail Page Structure

A detail page composes its content in this specific order from top to bottom:

**1. Thin Header Card (`rounded-b-none`)**

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back    Record Title / Identifier        [Badge]  [Actions...]   │
└─────────────────────────────────────────────────────────────────────┘
```

- Card variant: standard card, but with **bottom corners removed** (`rounded-b-none`). This creates a visual "cap" appearance — the card looks like a title bar rather than a floating surface.
- Padding: minimal vertical (`py-1.5`), standard horizontal (24px).
- **Back button**: ghost variant, small, left arrow icon + "Back" label or just arrow. Positioned leftmost. Navigates to the parent list page.
- **NO breadcrumbs** — the back button is the sole navigation affordance. This keeps the header clean.
- **Title**: entity name or identifier. 18–20px, semibold.
- **Status badges**: inline, immediately right of the title. Multiple badges possible (e.g., type + status).
- **Action buttons**: far right. Outline or primary variants. `size="sm"`.

**2. Main Body Card**

Positioned directly below the header card with `space-y-4` gap (16px). This is a standard card (all corners rounded).

- Internal layout: `grid grid-cols-1 md:grid-cols-2 gap-6`.
- Left column: primary attributes (most important fields).
- Right column: secondary attributes, metadata, timestamps.
- Each column is itself a card or a bordered section.

**3. Related Section Cards**

Below the 2-column body: additional full-width cards for related data (sub-records, history, timeline, attachments).

- Each in its own card with standard anatomy.
- `space-y-4` gap between them.
- These follow the same header/content/footer structure as list-page cards.

### Field + Value Layout (Inside Detail Cards)

The canonical pattern for displaying a labeled attribute in a detail view is a **horizontal label-value row with a hairline bottom separator**:

```
┌──────────────────────────────────────────────────────┐
│  🔧  Field Label              Field Value             │  ← py-3 + border-b
│  📅  Another Field            Another Value           │  ← py-3 + border-b
│  📍  Last Field               Last Value              │  ← py-3 (no border)
└──────────────────────────────────────────────────────┘
```

**Left side (label):**
- `flex items-center gap-3`.
- Icon: 16×16px, muted color.
- Label text: 14px, medium weight, muted color.
- The icon + label reads as a single muted unit.

**Right side (value):**
- 14px, medium weight, foreground color (full opacity).
- Right-aligned within the row.
- Can contain a badge, a link, or plain text.

**Row container:**
- `flex items-start justify-between py-3 border-b border-border`.
- Last row in each section: no trailing border (`[&>:last-child]:border-0`).
- Hover: none (these are display rows, not interactive rows).

**Card header for detail sub-cards:**
- Icon tile on the far left: `p-2 rounded-lg` container with a 20×20px icon inside, using a semantic tint background.
- Card title: 18px, semibold.
- `pb-3` on CardHeader (tighter than the standard 24px — detail cards are denser).

---

## Part 7 — Form and Dialog Grammar

### Input Fields

- Height: 36px (default), 32px (compact/sm), 40px (large).
- Border: 1px, input border color.
- Corner radius: `rounded-md` (one step softer than cards' `rounded-xl`, one step harder than plain `rounded`).
- Background: transparent, with a subtle dark-mode fill.
- Shadow: `shadow-rigid-sm`.
- Placeholder: muted foreground.
- Focus: border changes to ring color + 3px ring halo (not the standard 2px outline — 3px is deliberately wider for visibility).
- Invalid: border + ring shift to destructive color, with `aria-invalid` attribute driving the style.
- Disabled: 50% opacity, `cursor-not-allowed`.

### Label Anatomy

- 14px, medium weight.
- Gap below label (before input): 8px.
- Auxiliary icon (info, required indicator): inline at 16×16px, 8px gap.
- Required asterisk or "Required" text: always inline in label text, never floated below the input.

### Form Field Spacing

- Vertical gap between label+input groups: 16px on standalone pages, 8–12px inside compact dialogs.
- Logical sections within a form: hairline separator + 24px vertical margin.

### Select Dropdowns

- Trigger: visually identical to an input — same height, border, corner radius, shadow, focus ring.
- Dropdown surface: `rounded-xl`, `shadow-rigid-md`, card background.
- Items: 14px, ~36px height, muted hover tint.

### Modal Base Structure

Every modal in this system — regardless of type — is built from the same four-zone skeleton. This is the base approach. Never improvise a modal structure outside these zones.

```
┌─────────────────────────────────────────────────────┐
│  OVERLAY  (fixed inset-0, black 50%, z-50)          │
│  ┌───────────────────────────────────────────────┐  │
│  │  Modal Box                          [✕]       │  │  ← Header zone
│  │  Title                                        │  │
│  │  Description (muted, optional)                │  │
│  │  ─────────────────────────────────────────── │  │
│  │  Body zone                                    │  │  ← Body zone
│  │  (form fields / confirmation content /        │  │
│  │   scope selectors / import controls)          │  │
│  │  ─────────────────────────────────────────── │  │
│  │         [Cancel]   [Primary Action]           │  │  ← Footer zone
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Overlay:**
- Fixed, full-viewport, black at 50% opacity.
- Fade-in on open, fade-out on close.
- Click-outside closes the modal (tap overlay = dismiss).

**Modal box:**
- Max-width: 448–512px (standard), 640px (wide, for import/preview dialogs).
- Background: card surface.
- Border: 1px standard border.
- Corner radius: `rounded-lg`.
- Padding: 24px all sides.
- Shadow: `shadow-lg` — the one exception to the rigid shadow system. The modal must feel definitively above the overlay; a deeper soft shadow earns that.
- Centered: fixed, `top-50% left-50% translate(-50%, -50%)`.
- Close button: absolute `top-4 right-4`, icon-only, ghost, 70% opacity → 100% on hover. Always present.
- Mobile: `max-w-[calc(100%-2rem)]` prevents edge-to-edge flush.

**Entrance / Exit:** zoom-in from 95% + fade-in. 200ms both ways.

**Header zone:**
- `flex flex-col gap-2`.
- Title: 18px, semibold, `leading-none`.
- Description: 14px, muted, `mt-0` (gap handled by flex).
- Left-aligned on desktop, center-aligned on mobile.
- No separator line between header and body — padding provides the breathing room.

**Footer zone:**
- `flex flex-col-reverse gap-2 sm:flex-row sm:justify-end`.
- On mobile: buttons stack, primary action on top (first visually, last in DOM via `flex-col-reverse`).
- On desktop: buttons sit in a row, right-aligned.
- Canonical button order: **[Cancel] [Primary Action]** — left to right.
- Cancel: always outline variant.
- Primary action: default (primary) variant.
- Destructive primary: destructive variant.

---

### Modal Type 1 — Form Modal

Used for creating or editing a record. The most common modal type.

**Body layout:**
- Single column by default: `space-y-4`.
- Each field: label (14px, medium) above input (full width). Gap: 8px.
- Multi-field grids for tightly related pairs (e.g., city + postal code, start date + end date): `grid grid-cols-2 gap-3`. On mobile these collapse to single column.

**Field section grouping:**
- When a form has distinct logical sections (e.g., basic info + address), separate them with a top border + top padding: `border-t border-border pt-4 mt-4`.
- A small section label appears above the group: 14px, medium, muted. Acts as a visual anchor, not a heading.
- The section label is not interactive.

**Example structure:**
```
Name *              [input]
Phone *             [input]
Language            [select]
──────────────────────────────  ← border-t pt-4 mt-4
Address  (optional)             ← section label, text-sm muted
Street                [input]
City        Postal    [2-col grid]
Country               [input]
```

**Validation feedback:**
- Error messages appear inline, directly below the offending field. 14px, destructive color.
- The submit button is disabled while the form is submitting (`isSubmitting` state).
- On success: modal closes, list refreshes, success toast fires.
- On failure: modal stays open, inline error shown. No toast for form validation errors.

**Footer:** Cancel (outline) + "Save" / "Create [Entity]" (primary).

---

### Modal Type 2 — Confirmation / Destructive Modal

Used for irreversible actions: delete, revoke, permanently remove.

**Header:**
- Icon displayed inline left of the title: the alert-circle or similar warning icon, **destructive color** (not the usual muted icon style).
- Title: 18px, semibold. States the action clearly: "Delete [Record Name]?"
- Description: 14px, muted. One sentence explaining consequences.

**Body — two possible info boxes:**

**Primary target box** (always present):
- `bg-destructive/10 rounded-lg border border-destructive/20 p-3`.
- Shows the entity being deleted: name in 14px, medium, destructive color. Sub-details (ID, type) in 12px, destructive at 80% opacity.
- This is the visual confirmation of what will be destroyed.

**Cascading consequences box** (conditional — only shown when associated data exists):
- `bg-warning/10 rounded-lg border border-warning/30 p-3`.
- Lists counts of related records that will also be affected: "3 records, 2 attachments will also be deleted."
- Closing text: a recommendation to use a non-destructive alternative ("To preserve this data, deactivate instead.").
- This box only renders after an async check completes. During the check: show a spinner + "Checking for associated data…" inside the modal body.

**Footer — three-button pattern:**
- `[Cancel]` — outline, always leftmost.
- `[Deactivate Instead]` — secondary variant, only shown if a soft-delete / deactivate option exists for this record.
- `[Delete Permanently]` — destructive variant, rightmost. **Disabled until the async data check completes.** This prevents accidental immediate deletion.

---

### Modal Type 3 — Export Scope Selector

Used when exporting data to a file. The modal body is a list of scope options, not a form.

**Body structure:**
- `space-y-3 py-4`.
- Each scope is a full-width **tile button**: `w-full flex items-center justify-between p-3 rounded-lg border transition-colors`.
  - **Selected tile:** `border-primary bg-primary/10 text-foreground`.
  - **Unselected tile:** `border-border hover:bg-muted text-foreground`.
- Left side of tile: scope label (14px, medium).
- Right side of tile: secondary-variant badge showing the count of records in that scope.
- Tiles behave like radio buttons — selecting one deselects the others.
- The "Current filtered results" tile only renders if filters are currently active.

**Canonical scopes (in order):**
1. All records
2. Active / current records only
3. Inactive / historical records only
4. Current filtered results *(conditional)*

**Footer:** Cancel (outline) + "Export (N)" where N is the count from the selected tile. The export button label updates dynamically as the selection changes.

---

### Modal Type 4 — Import / Upload Modal

Used for bulk-importing records from a file. Three distinct zones inside the body.

**Body — Zone A: Instructions box**
- `bg-info/10 border border-info/20 rounded-lg p-4`.
- Header row: info icon (16×16, info color) + bold label ("File Requirements" or similar).
- Below: a bulleted list of format requirements (column names, required fields, file type).
- A "Download sample template" link button at the bottom of the box. Ghost variant, small, with download icon.

**Body — Zone B: File input**
- `space-y-2`.
- Label above, standard file input below. Accept: `.xlsx, .xls` (or relevant format).
- On file selected: the file input area is replaced or augmented by a confirmation row — check-circle icon (success color) + file name + file size. This replaces the raw filename shown by browser default.

**Body — Zone C: Progress tracker** *(hidden until import starts)*
- Appears in-place below Zone B once import begins.
- Container: `bg-muted border border-border rounded-lg p-4 space-y-3`.
- Top row: progress label (e.g., "Importing…") left + "X / Total" count right.
- Second row: success count (success color) + failed count (destructive color), side by side.
- Error list (if any failures): `max-h-32 overflow-y-auto`, 12px, destructive color, one error per line.

**Footer:** Cancel (outline) + "Import" (primary, disabled until a file is selected). During import, the Import button shows a spinner and is disabled.

---

### Card-Style Custom Modal

A variant used for high-emphasis creation flows (e.g., creating a new privileged entity). Visually resembles a stat card more than a standard dialog.

**Differences from the base modal:**
- Built with raw fixed positioning rather than the shared Dialog component — fully custom.
- **Top accent bar**: `absolute top-0 left-0 right-0 h-[3px] bg-primary/50`. Same 3px strip as stat cards. Signals importance.
- Header zone uses an **icon-in-box** instead of a plain text title:
  - `p-2 bg-primary rounded-lg` container + 20×20px icon inside (icon uses background foreground color).
  - Title: 20px, bold. Sits to the right of the icon box in a flex row.
  - Close button: absolute top-right, text-muted → text-foreground on hover. Not the standard ghost button — a raw icon.
- Body: `space-y-4`, same field layout as Form Modal Type 1.
- Footer: `flex gap-3 mt-6`. Both Cancel and Submit are `flex-1` (equal width, filling the row). This distinguishes it from the base footer where buttons are auto-width and right-aligned.
- Shadow: `shadow-rigid-md` (the rigid system, not `shadow-lg`).

Use this pattern sparingly — only for the most prominent creation action in the system.

---

## Part 8 — Button Hierarchy

### Variants

| Variant | Fill | Border | Use Case |
|---------|------|--------|----------|
| **Default (Primary)** | Primary color | None | The single most important action on a surface |
| **Destructive** | Destructive color | None | Irreversible negative actions (delete, revoke) |
| **Outline** | Transparent | Yes, standard | Secondary actions, cancel, export |
| **Secondary** | Muted color | None | Tertiary actions |
| **Ghost** | None | None | Nav items, icon-only controls, in-row table actions |
| **Link** | None | None | Inline contextual navigation, text links |

### Sizes

| Size | Height | H. Padding | Use Case |
|------|--------|------------|----------|
| xs | 24px | 8px | Dense table tag controls |
| sm | 32px | 12px | In-card secondary, filter bar actions |
| default | 36px | 16px | Standard page-level actions |
| lg | 40px | 24px | Primary CTA in dialogs, empty states |
| icon-xs | 24×24px | — | Micro icon actions |
| icon-sm | 32×32px | — | Header cluster, in-row table actions |
| icon | 36×36px | — | Standard icon buttons |
| icon-lg | 40×40px | — | Large standalone icon CTAs |

### Rules

- **One primary button per surface.** If a second action exists, it is outline or ghost.
- Icon inside labeled button: 16×16px, left of label, 8px gap. Never right of label.
- Icon-only buttons: perfectly square, icon centered.
- All: `inline-flex items-center justify-center`, 14px, medium weight, `rounded-md`, `transition-all`.
- Focus: 3px ring halo (same as inputs — consistent across the system).
- Shadow: `shadow-rigid-sm` on default, destructive, outline, secondary. Zero on ghost and link.
- SVG icons inside: `pointer-events-none`, `shrink-0`, `size-4`.

---

## Part 9 — Badges and Status Indicators

### Base Badge

- Shape: pill (`rounded-full`).
- Padding: 8px horizontal, 2px vertical.
- Text: 12px, medium weight, `whitespace-nowrap`.
- `inline-flex items-center gap-1`, `w-fit`, `shrink-0`.

### Variants

| Variant | Background | Use Case |
|---------|------------|----------|
| Default | Primary color, full | Count chips, primary labels |
| Secondary | Muted/secondary | Neutral tags, unread counts |
| Destructive | Destructive, full | Error states, blocked status |
| Outline | Transparent + border | Subtle tags |
| Semantic tint | Semantic color at 10% opacity | **Status fields in tables** — the preferred variant for any status value |

The semantic tint variant is the most used in practice. A lightly tinted background with matching text is readable, professional, and not visually aggressive in dense table rows. Never use a fully-filled badge for routine status values.

### Inline Status Dot

- 6×6px circle, `rounded-full`, semantic color, `flex-shrink-0`.
- Used for unread indicators, online status, alerts.
- Positioned inline in content, always immediately adjacent to the item it describes.

### Section Count Chip

- In card headers, shows the current filtered count of items in the card's table.
- Secondary variant, compact padding, 12px.
- Updates when the list filters change.

---

## Part 10 — Page-Level Composition Pattern

Every list/index page follows an identical five-zone vertical stack. Consistency in this composition is what makes the dashboard feel coherent as a system rather than a collection of pages.

### Zone 1 — Page Header (Bare, No Card)

```
[Page Title                                    ] [Primary CTA Button]
[Page subtitle describing the page context     ]
```

- Title: 30px, bold.
- Subtitle: 14–16px, muted, `mt-1`.
- Primary CTA (if any): right-aligned, same row as the title, not below the subtitle.
- No card wrapper. This zone sits directly on the page background.

### Zone 2 — Stat Cards Row

- `grid grid-cols-2 md:grid-cols-4 gap-4`.
- 4 cards, each measuring a different key metric.
- Each uses a different semantic color (info, success, warning, primary or destructive) for visual differentiation without label dependency.
- Stagger entrance animation: each card delays 50–80ms more than the previous.

### Zone 3 — Filter / Search Bar (In a Card)

A card containing a single row of filter controls:

- Search input with leading icon: fills available width (`flex-1`).
- Status filter: fixed-width `<select>`.
- Date range filter: fixed-width `<select>`.
- Clear + Export buttons: `auto` width, right edge.

Layout: `grid md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center`.

The filter card should never grow taller than a single control row. If more filters are needed, hide them behind a "Filters" toggle button that reveals a popover or inline panel.

**Active filter badge:** When any filter is active, the Filters button shows a secondary count badge. Clearing returns to the default state without the badge.

### Zone 4 — Main Data Card(s)

- One or two cards, each containing a table.
- Primary card: `shadow-rigid-md`.
- If two tables exist (e.g., active records and archived records), they are stacked vertically with `space-y-6` gap.
- **CardHeader**: `flex items-center gap-2` — icon tile (20×20 in semantic-tinted `rounded-lg` box) + title + count badge. No action buttons in the table header area.
- **Table** inside CardContent.
- **Pagination** inside CardFooter.

### Zone 5 — State Handling

Every card in Zone 4 must handle three states without layout shift:

**Loading:** Centered spinner (24–32px, animated rotation) vertically and horizontally centered within the card body. Nothing else.

**Empty:**
- `text-center py-16 px-4`.
- Icon container: 56–64px square, `rounded-full`, muted background, centered. Icon inside: 24–28px, muted.
- Title: 16–18px, medium, `mt-4`.
- Description: 14px, muted, `max-w-xs mx-auto mt-2`.
- Optional CTA button below.

**Error:** Same layout as empty, but icon and title use destructive tint.

---

## Part 11 — Login / Auth Page

### Page Layout

The login page is the only full-page exception to the three-region shell. No sidebar, no header. Full-viewport flex centering.

- Background: page background color, typically slightly muted from the main dashboard (or an alternate shade of the same palette).
- `min-h-screen flex items-center justify-center`.

### Login Card

- Max-width: `max-w-md` (448px).
- All standard card properties: `rounded-xl`, border, card background, `shadow-rigid-md`.
- No accent strip, no decorative dots — clean and focused.
- CardHeader + CardContent structure.

**Top to bottom in the card:**
1. Brand mark / logo — centered, `mb-6`. ~40px tall.
2. Card title: 22–24px, semibold. Centered.
3. Card subtitle: 14px, muted. Centered.
4. Form area: left-aligned labels, full-width inputs, `space-y-4`.
5. Primary CTA: full-width, default (primary) variant, `lg` size (40px).
6. Auxiliary link (forgot password, support): 14px, muted, centered, `mt-4`.

### Multi-Step Auth (OTP / Phone)

When authentication is multi-step:
- The card content transitions between steps **in place** — no page reload, no card position change.
- Step 1: single input + CTA.
- Step 2: OTP/code input + CTA + "Resend" text link.
- Back affordance: small ghost button or text link **above** the form, not using browser back.
- Error messages: inline, below the relevant input, 14px, destructive color. **No toasts for auth errors.**

---

## Part 12 — Timeline Component

Timeline is used on detail pages to display sequential history, audit logs, or status changes.

### Structure

A vertically stacked list with a continuous vertical line running through all items:

- Outer container: `relative`, left-padded to make room for the line and dots.
- Vertical line: `absolute left-3 top-0 bottom-0 w-0.5 bg-border`. Exactly 2px wide, runs the full height of the container, muted border color.
- Each item: `relative pl-8` (left padding creates space for the dot).

### Item Dot

- `absolute -left-5 top-1 w-3 h-3 rounded-full border-2 border-background`.
- The `border-background` creates a thin "halo" of the page background color around each dot, making them appear to float on top of the vertical line (not merged with it).
- First/most recent dot: semantic info color (or primary).
- Subsequent dots: muted foreground at 30% opacity.

### Item Content

- Timestamp: 12px, muted, at the top of the item.
- Description: 14px, medium, below the timestamp.
- Optional sub-text: 12px, muted.
- `space-y-4` between items.

---

## Part 13 — Structural Separators

Separators in this system are **never solid colored lines**. Every structural boundary uses a gradient line that fades to transparent at both ends — making it appear to "float" in the middle of its span and vanish at the edges.

### The Vanishing Gradient Technique

All structural separators use a CSS `::after` pseudo-element on a `position: relative` parent. The pseudo-element is `pointer-events: none`, `z-index: 1`, `position: absolute`.

**Header bottom separator (`shadow-rigid-header::after`):**
- Position: `bottom: 0; left: 5%; right: 5%;`
- Size: `height: 1px`
- Gradient: `linear-gradient(to right, transparent 0%, [border-color at 12% opacity] 15%, [border-color at 12% opacity] 85%, transparent 100%)`
- Effect: The line is invisible in the leftmost 15% and rightmost 15% of its span, and fully present in the central 70%. Because the pseudo-element itself starts at 5% and ends at 95% of the parent width, the total fade zone reaches ~20% from each physical edge of the header.
- This makes the separator feel like a soft shadow cast by the header rather than a hard dividing line.

**Sidebar right-edge separator (`shadow-rigid-sidebar::after`):**
- Position: `top: 5%; bottom: 5%; right: 0;`
- Size: `width: 1px`
- Gradient: `linear-gradient(to bottom, transparent 0%, [border-color at 12% opacity] 15%, [border-color at 12% opacity] 85%, transparent 100%)`
- Effect: The vertical line is visible only in the middle 70% of the sidebar's height, fading out near the very top and very bottom.
- The sidebar has `position: relative` and `overflow: hidden` to contain this effect without clipping the sidebar content.

**Internal section separators:**
- `shadow-separator-b::after`: bottom edge, `left: 10%; right: 10%;` (more aggressive margin than the header). Gradient fade at 20%/80%.
- `shadow-separator-t::after`: top edge, same proportions as `shadow-separator-b`.
- Used inside sidebar between zones, inside cards between header and content, inside the notification dropdown header.

**Dark mode:** The color inside the gradient swaps to white at ~8% opacity (instead of the dark foreground color at 12%). The transparency math stays identical.

### Separator Hierarchy

| Separator | Extent | Fade zone | Opacity | Used On |
|-----------|--------|-----------|---------|---------|
| `shadow-rigid-header` | left 5% → right 5% | 15% each end | 12% | Header bottom |
| `shadow-rigid-sidebar` | top 5% → bottom 5% | 15% each end | 12% | Sidebar right edge |
| `shadow-separator-b/t` | left 10% → right 10% | 20% each end | 10% | Internal card/zone dividers |

### The Hard Rule

- **Never** use a solid 1px border as a primary structural separator.
- Solid borders live only inside components: table row separators, card field-row separators, notification item dividers.
- The gradient vanishing line is reserved for structural edges between the three shell regions and between major card zones.
- Background color difference alone is never enough. Both the background differentiation AND the gradient separator are required for proper depth.

---

## Part 14 — Spacing Rhythm

All spacing follows a strict 4px base unit. Every margin, padding, and gap value must be an exact multiple of 4px.

| Multiplier | Value | Examples |
|------------|-------|---------|
| ×1 | 4px | Badge `padding-y`, icon dots gap |
| ×2 | 8px | Label-to-input gap, button icon gap |
| ×3 | 12px | Sidebar item `px`, icon-to-label gap |
| ×4 | 16px | Card section gap, form field spacing |
| ×6 | 24px | Card `px`, between page zones |
| ×8 | 32px | Page body `px` on desktop |
| ×20 | 80px | Header height, sidebar brand zone height |

**Vertical page rhythm:**
- Between major page zones (title → stats → filters → tables): `space-y-6` (24px).
- Between sibling cards in the same zone: `space-y-4` (16px).
- Between items in a list or nav: `space-y-1` (4px).

**Do not use:** 5px, 7px, 10px, 13px, 15px, 18px, 20px, or any non-multiple of 4.

---

## Part 15 — Typography Scale

| Role | Size | Weight | Modifier |
|------|------|--------|----------|
| Page title | 30px | Bold | `text-3xl font-bold` |
| Section / card title | 18–20px | Semibold | `text-xl font-semibold` |
| Body (default) | 14px | Regular | `text-sm` |
| Form label | 14px | Medium | `text-sm font-medium` |
| Small / secondary | 12px | Regular | `text-xs` |
| Table column header | 11px | Medium | `text-[11px] uppercase tracking-widest` |
| Badge / chip | 12px | Medium | `text-xs font-medium` |
| Stat metric value | 24px | Bold | `text-2xl font-bold` |
| Notification title | 14px | Semibold (unread) / Medium (read) | — |
| Timestamp | 12px | Regular | Muted at 60% opacity |

**Monospace font:** IDs, reference numbers, codes, emails. Never mixed with proportional text inside the same text node.

**Muted text rule:** Muted text is never more than 30% de-emphasized from full foreground. If body text is at 100% opacity, muted sits at 70%. At 60% for timestamps and very secondary labels. **Nothing goes below 60%** — it becomes inaccessible.

---

## Part 16 — Icon Grammar

### Context Sizes

| Context | Icon Size | Container |
|---------|-----------|-----------|
| Sidebar nav item | 20×20px | Inline in row |
| Card header title | 20×20px | `p-2 rounded-lg` semantic-tinted box |
| Detail card section header | 20×20px | Same tinted box |
| Button icon (default) | 16×16px | Inside button |
| Small button icon | 14×14px | Inside sm button |
| Header action cluster | 16×16px | Inside `icon-sm` button |
| Table action cell | 16×16px | Inside `icon-sm` ghost button |
| Notification item | 16×16px | Inline |
| Empty state | 24–28px | Inside 56–64px `rounded-full` muted container |
| Loading spinner | 24–32px | Centered, `animate-spin` |

### Rules

- A 14px text label pairs with at most a 16px icon. Never larger.
- Icon-to-text gap: 8–12px always.
- `shrink-0` on every icon in a flex container.
- `pointer-events-none` on every icon — they are never interactive targets.
- One icon library throughout the project. Never mix.
- Use stroke/outline style. Fill icons conflict with the system's airy aesthetic.

---

## Part 17 — Micro-interactions and Feedback

### Toast / Snackbar

- Position: **bottom-right**, floating above all content.
- Shape: card-like — `rounded-lg`, border, card background, subtle shadow.
- Width: 340–380px.
- Success/info: auto-dismiss at 4–5 seconds. Error: persistent, requires explicit dismiss.
- Stack vertically if multiple active.
- Entrance: slide-in from right. Exit: fade-out right.

### Hover Table

| Element | Hover Effect | Duration |
|---------|-------------|----------|
| Sidebar nav item | Muted/50 bg + `translate-x-0.5` | 150ms |
| Table row | Muted/50 bg | 150ms |
| Stat card | `translateY(-2px)` + shadow deepen | 200ms |
| Default button | 90% primary opacity | 150ms |
| Link | Underline appears | Instant |
| In-row action button | Opacity 0 → 1 (group hover) | 150ms |
| Notification item | Muted/50 bg | 150ms |
| User profile chip | Muted/50 bg | 150ms |

### Focus Treatment

Every interactive element uses the same focus system: `outline: none` (removes browser default) + `ring-[3px]` using the ring color token. This is intentionally bolder than the standard 2px browser focus ring — it is part of the brand.

### Loading States

| Context | Pattern |
|---------|---------|
| Full-page data | Centered spinner, `h-[60vh]` container |
| Card data | Spinner centered in card body |
| Button in-progress | Swap leading icon for animated spinner + "..." suffix on label |
| Search input | Replace leading search icon with spinner |
| Page skeleton | Pulse-animated muted placeholder rows (3–5), only on initial page load |

### Entrance Animations

| Trigger | Animation | Duration |
|---------|-----------|----------|
| Page mount | Fade-up: 8px translateY + opacity 0→1 | 400ms, ease-out |
| Card/grid item | Staggered fade-up, 50–80ms per item, max 6 staggered | 350ms, ease-out |
| Dialog open | Zoom-in from 95% + fade | 200ms |
| Slide-over panel | Slide-in from right | 300ms |
| Dropdown open | Fade + zoom from 95% + slide down 8px | 200ms |

**Motion philosophy:** Every animation must feel **invisible in use**. The user perceives the UI as responsive and lively — not as an animation playing. Translate values max 8px. Duration never exceeds 400ms. No spring physics, no bounce, no overshoot.

---

## Part 18 — Tabs

Two mutually exclusive tab styles. Never mix them on the same page.

**Boxed tabs (default style):**
- Purpose: content-level filtering within a page (switch between categories of the same entity type).
- Tab list: `bg-muted rounded-lg p-[3px]` container.
- Tab trigger: `rounded-md px-2 py-1 text-sm gap-1.5`, `transition-all`.
- Active: `bg-background text-foreground shadow-sm`.
- Inactive: transparent background, foreground at 60% opacity. Hover: full opacity.

**Line tabs (underline style):**
- Purpose: top-level section navigation (analytics sections, settings categories).
- Tab list: a plain row of items with a bottom border on the list container.
- Tab trigger: no background, no border.
- Active: 2px bottom border in primary color, full foreground text.
- Inactive: no underline, muted text. Hover: full foreground text.

---

## Part 19 — Settings / Profile Slide-over Panel

A slide-over is a full-height panel that appears from the right edge. It is not a modal.

- Width: max 448px (`max-w-md`), at most 90vw.
- Full viewport height, `fixed inset-y-0 right-0`.
- Background: card surface.
- Entrance: `slide-in-from-right` 300ms.
- Backdrop: semi-transparent overlay, slightly lighter than the modal overlay (panel is informational, not blocking).
- Close: X button in panel header, top-right.

**Panel header:**
- Height: 64px (16px shorter than the app header — intentionally less dominant).
- `flex items-center justify-between px-6 h-16 border-b border-border`.
- Title: 16px, semibold.
- Close button: icon-only, ghost, right side.
- Solid border-bottom here (not a gradient separator — the panel header is compact and needs a stronger boundary).

**Panel body:**
- `overflow-y-auto px-6 py-6 space-y-6`.
- Sections organized in cards or `rounded-lg border` blocks.
- 24px vertical gap between sections.

---

## Part 20 — Analytics and Chart Pages

Analytics pages group related charts in sections navigated by **line-style tabs** (see Part 18). Each tab is lazily loaded.

**Chart card anatomy:**
- Follows all standard card rules.
- The chart SVG/canvas extends **to the card's left and right edges** with zero horizontal padding inside CardContent — charts look better full-bleed than padded.
- Chart height: consistent within a section (300–400px typical).

**Chart tooltips:**
- Must match the card surface: card background, standard border, `rounded-lg`, `shadow-rigid-sm`.
- Never use the chart library's default tooltip if it conflicts visually.
- Typography inside tooltip: 12px labels, 14px values, monospace for numbers.

**Chart colors:**
- Must use the system's semantic palette tokens — never hardcoded hex.
- For multi-series: the chart color tokens (5 defined values) cycle in order.

**Empty chart state:**
- Render the chart axes and grid lines.
- Overlay a centered message: icon + "No data for this period".
- Never hide the chart area entirely — spatial consistency matters even in empty state.

---

## Part 21 — Quality Checklist

Before any dashboard screen is considered complete:

**Shell:**
- [ ] Sidebar, header, and content are three independent non-overlapping regions.
- [ ] Header left-offset matches sidebar width exactly (expanded and collapsed).
- [ ] Both sidebar brand zone and header are exactly 80px tall.
- [ ] Sidebar gradient separator (right edge) vanishes at top 5% and bottom 5%.
- [ ] Header gradient separator (bottom) vanishes at left 5% and right 5%.
- [ ] Sidebar active state uses prefix-matching — detail pages activate their parent list item.

**Cards:**
- [ ] All content inside cards. Nothing raw on the page background.
- [ ] Card shadow is the 4-layer neo-brutalist system — not a standard `shadow-md`.
- [ ] Stat cards have accent strip (3px top), decorative dot pair, hover lift.
- [ ] Detail page header card uses `rounded-b-none`.

**Tables:**
- [ ] Overflow wrapper is a `<div>`, not the `<table>`.
- [ ] Column headers are 11px, all-caps, widest letter-spacing, foreground at 60%, 2px bottom border.
- [ ] Last table row has no bottom border.
- [ ] In-row action buttons are ghost, icon-only, invisible at rest, revealed on row hover.
- [ ] Pagination is in CardFooter; active page uses inverted (foreground-as-bg) styling.

**Detail pages:**
- [ ] Header card is `rounded-b-none` with back button + title + badges + actions.
- [ ] Body below uses 2-column grid (desktop) / 1-column (mobile).
- [ ] Field rows use icon + label (muted left) + value (foreground right) + `border-b` pattern.
- [ ] Last field row has no trailing border.
- [ ] Related cards below body use standard card anatomy.

**Modals and dialogs:**
- [ ] Inputs: correct height, 1px border, `rounded-md`, `shadow-rigid-sm`, 3px focus ring.
- [ ] All modals use the 4-zone base: overlay → box → header / body / footer. No improvised structures.
- [ ] Form modals: single column `space-y-4`, paired fields use `grid-cols-2 gap-3`, sections separated by `border-t pt-4 mt-4`.
- [ ] Confirmation modals: destructive icon in header, `bg-destructive/10` target box, optional `bg-warning/10` cascading-data box, Delete disabled until async check resolves.
- [ ] Export modals: tile-button scope selector (border + tint on active), badge count per tile, footer label updates dynamically with selected count.
- [ ] Import modals: 3 body zones — instructions info box (`bg-info/10`), file input with file-confirmed state, progress tracker (hidden until import starts).
- [ ] Card-style custom modal (high-emphasis creation): accent bar `h-[3px]` at top, icon-in-box header, equal-width `flex-1` footer buttons, `shadow-rigid-md`.
- [ ] Dialog entrance: zoom-in 95% + fade. 200ms. One primary button per surface.

**Typography:**
- [ ] Page title 30px bold. Card titles 18–20px semibold. Body 14px.
- [ ] Table column headers 11px all-caps wide-tracked.
- [ ] Muted text never below 60% opacity.

**Motion:**
- [ ] Page fade-up ≤8px translate, ≤400ms.
- [ ] Card stagger ≤80ms per card.
- [ ] No bounce, spring, or overshoots anywhere.

**States:**
- [ ] Every data surface has loading (spinner), empty (icon+title+desc), and error (destructive icon) states.

---

## Design Critique Rules

Flag these as defects in any review:

1. **Shadow substitution** — Any use of `shadow-md`, `shadow-lg`, or similar instead of the 4-layer rigid system on cards or controls.
2. **Table header style missing** — Column headers without `text-[11px] uppercase tracking-widest` blend with cell content and lose all hierarchy.
3. **Solid structural separator** — A visible solid 1px border between sidebar and content, or under the header, instead of the gradient vanishing line.
4. **Header–sidebar gap or overlap** — Any visible gap, z-fighting, or background bleed at the junction corner.
5. **Multiple primary buttons** — Two filled primary buttons on the same surface. One of them must be demoted.
6. **Unstyled empty or loading states** — A blank div or raw text where a proper state component should be.
7. **Table actions always visible** — Ghost action buttons that are visible at all times in table rows create noise. They must be hover-revealed.
8. **Stat cards without accent strip or dots** — They read as plain summary cards, losing the metric-card identity.
9. **Detail page without back button** — No navigation affordance back to the list page.
10. **Gradient separator with wrong extent** — A separator that runs full-width/full-height (no vanishing at ends) loses the "floating line" effect and looks like a crude divider.
11. **Overanimated entrance** — Any card or element that translates more than 8px, bounces, or takes longer than 400ms on its entrance animation.
12. **Inconsistent icon sizing** — Mixing 18px, 20px, and 24px icons in the same context zone. Pick one size per context and hold it.
13. **Flat confirmation modal** — A delete confirmation that is just text + two buttons, with no destructive info box and no cascading-data warning. The red target box and warning box are not optional decoration — they communicate the irreversibility of the action.
14. **Export modal with static button label** — The export footer button must show the count from the selected scope ("Export (42)"). A static "Export" label is a defect.
15. **Import modal missing progress zone** — If the import body only has a file input and no progress tracker zone, the user has no feedback during the operation. The progress zone is required even if it is hidden until import begins.
16. **Card-style modal using `shadow-lg`** — The high-emphasis card-style custom modal must use `shadow-rigid-md`. Using `shadow-lg` removes it from the design system's shadow language.
