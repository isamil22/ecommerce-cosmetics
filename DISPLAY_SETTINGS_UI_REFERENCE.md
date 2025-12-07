# Display Settings UI - Visual Reference Guide

## Create Pack Form - Step 3: Display Settings

### Form Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                  CREATE NEW PACK                                 │
│                Build a product bundle with multiple items        │
│                                                                  │
│  [Clear Draft]                                                   │
├─────────────────────────────────────────────────────────────────┤
│ Step Progress:                                                   │
│ • Step 1: Basic Info       ✓ Completed                          │
│ • Step 2: Pack Items       ✓ Completed                          │
│ • Step 3: Display Settings ● Current                            │
│ • Step 4: Recommendations  ○ Upcoming                           │
│ • Step 5: Review           ○ Upcoming                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│    👁️ Display Settings                                          │
│                                                                  │
│    ┌────────────────────────────────────────────────────────┐   │
│    │ □ 🛍️ Show Purchase Notifications       [Disabled]      │   │
│    │                                                         │   │
│    │ Display notifications when customers buy this pack     │   │
│    └────────────────────────────────────────────────────────┘   │
│                                                                  │
│    ┌────────────────────────────────────────────────────────┐   │
│    │ ☑ ⏱️ Show Countdown Timer              [Enabled]       │   │
│    │                                                         │   │
│    │ Display flash sale countdown timer for urgency         │   │
│    └────────────────────────────────────────────────────────┘   │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  [← Previous]                               [Next →]  [Save]    │
└─────────────────────────────────────────────────────────────────┘
```

### UI Elements Description

#### Section Header
```
👁️ Display Settings
```
- Icon: Eye icon (FiEye) in pink color (#ec4899)
- Text: "Display Settings" in bold gray (text-gray-800)
- Margin bottom: 1rem

#### Toggle Item - Structure

```
┌─ Container ──────────────────────────────────────────────┐
│  Flex, items-center, cursor-pointer, p-4                │
│  border-2 gray-200, rounded-lg, hover:border-pink-300   │
│  transition, bg-gray-50                                 │
│                                                          │
│  ┌─ Checkbox ─────────────────────┐  ┌─ Content ──┐   │
│  │ □ type="checkbox"               │  │ Text info  │   │
│  │   w-5 h-5                       │  │ ml-3 flex- │   │
│  │   text-pink-600                 │  │ 1          │   │
│  │   rounded                       │  └─ Status ──┘   │
│  │   focus:ring-pink-500           │                   │
│  │   cursor-pointer                │                   │
│  └─────────────────────────────────┘                   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### Purchase Notifications Toggle (Example - Unchecked)

```
┌────────────────────────────────────────────────────────────┐
│ □  🛍️ Show Purchase Notifications      [Disabled]         │
│                                                             │
│     Display notifications when customers buy this pack    │
│                                                             │
│     Checkbox: Unchecked (false)                           │
│     Status Badge: Gray background, gray text "Disabled"  │
└────────────────────────────────────────────────────────────┘
```

**Attributes**:
- Icon: 🛍️ (Shopping bag emoji)
- Main Label: "Show Purchase Notifications" (font-semibold, text-gray-800)
- Description: "Display notifications when customers buy this pack" (text-gray-600, text-sm)
- Status Badge: 
  - When enabled: bg-green-100 text-green-700 "Enabled"
  - When disabled: bg-gray-100 text-gray-700 "Disabled"

#### Countdown Timer Toggle (Example - Checked)

```
┌────────────────────────────────────────────────────────────┐
│ ☑  ⏱️ Show Countdown Timer              [Enabled]         │
│                                                             │
│     Display flash sale countdown timer for urgency        │
│                                                             │
│     Checkbox: Checked (true)                              │
│     Status Badge: Green background, green text "Enabled"  │
└────────────────────────────────────────────────────────────┘
```

**Attributes**:
- Icon: ⏱️ (Timer emoji)
- Main Label: "Show Countdown Timer" (font-semibold, text-gray-800)
- Description: "Display flash sale countdown timer for urgency" (text-gray-600, text-sm)
- Status Badge:
  - When enabled: bg-green-100 text-green-700 "Enabled"
  - When disabled: bg-gray-100 text-gray-700 "Disabled"

### Color Scheme

| Element | Color | Tailwind Class |
|---------|-------|-----------------|
| Eye Icon | Pink | text-pink-500 |
| Title Text | Dark Gray | text-gray-800 |
| Container Background | Light Gray | bg-gray-50 |
| Border (default) | Light Gray | border-gray-200 |
| Border (hover) | Light Pink | hover:border-pink-300 |
| Checkbox (checked) | Pink | text-pink-600 |
| Checkbox Focus | Pink | focus:ring-pink-500 |
| Enabled Badge BG | Light Green | bg-green-100 |
| Enabled Badge Text | Dark Green | text-green-700 |
| Disabled Badge BG | Light Gray | bg-gray-100 |
| Disabled Badge Text | Dark Gray | text-gray-700 |
| Description Text | Medium Gray | text-gray-600 |

### Size Specifications

| Element | Size | Unit |
|---------|------|------|
| Eye Icon | w-5 h-5 | Tailwind |
| Checkbox | w-5 h-5 | Tailwind |
| Padding | p-4 | 1rem |
| Border Width | border-2 | 2px |
| Spacing | space-y-4 | 1rem between items |
| Icon Margin | ml-3 | 0.75rem |
| Status Badge Padding | px-3 py-1 | 0.75rem x 0.25rem |
| Status Badge Border | rounded-full | 9999px |
| Status Badge Font | text-xs | 0.75rem |

### State Variations

#### State 1: Both Enabled (Default)
```
☑ 🛍️  Show Purchase Notifications    [🟢 Enabled]
☑ ⏱️  Show Countdown Timer            [🟢 Enabled]
```

#### State 2: Both Disabled
```
□ 🛍️  Show Purchase Notifications    [⚪ Disabled]
□ ⏱️  Show Countdown Timer            [⚪ Disabled]
```

#### State 3: Mixed Settings
```
☑ 🛍️  Show Purchase Notifications    [🟢 Enabled]
□ ⏱️  Show Countdown Timer            [⚪ Disabled]
```

#### State 4: Only Notifications Disabled
```
□ 🛍️  Show Purchase Notifications    [⚪ Disabled]
☑ ⏱️  Show Countdown Timer            [🟢 Enabled]
```

### Responsive Behavior

#### Desktop (>1024px)
- Full width toggle containers
- Side-by-side layout for badges and controls
- Normal padding

#### Tablet (768px - 1023px)
- Slightly reduced padding
- Same layout preserved
- Readable at all angles

#### Mobile (<768px)
- Stack layout maintained
- Touch-friendly checkbox size
- Readable text at reduced size
- Status badge on same line (flex-wrap)

### Interactive States

#### Normal State
```
Background: bg-gray-50
Border: border-gray-200
Cursor: cursor-pointer
Transition: transition (smooth hover effect)
```

#### Hover State
```
Background: bg-gray-50 (unchanged)
Border: hover:border-pink-300 (changes to light pink)
Cursor: cursor-pointer
Shadow: Subtle elevation (implied by border change)
```

#### Checked State (Checkbox)
```
Background: Pink fill
Border: Pink outline
Checkmark: White checkmark visible
```

#### Unchecked State (Checkbox)
```
Background: White
Border: Gray outline
Checkmark: None
```

### Accessibility Features

| Feature | Implementation |
|---------|-----------------|
| Checkbox Label | `<label>` wrapping entire control |
| Focus Ring | focus:ring-pink-500 on checkbox |
| Visual Feedback | Color change from gray to green |
| Text Contrast | High contrast colors |
| Icon Meaning | Emoji + text explanation |
| Description | Smaller gray text below main label |
| Keyboard Navigation | Native checkbox tabbing |

### CSS Classes Reference

```tailwind
/* Container */
flex items-center cursor-pointer p-4 border-2 border-gray-200 
rounded-lg hover:border-pink-300 transition bg-gray-50

/* Checkbox */
w-5 h-5 text-pink-600 rounded focus:ring-pink-500 cursor-pointer

/* Content Wrapper */
ml-3 flex-1

/* Main Label */
block font-semibold text-gray-800

/* Description */
text-sm text-gray-600

/* Status Badge */
ml-2 px-3 py-1 rounded-full text-xs font-semibold
/* Enabled state: bg-green-100 text-green-700 */
/* Disabled state: bg-gray-100 text-gray-700 */

/* Space Between Items */
space-y-4
```

### Component Hierarchy

```
<div className="space-y-4">
  {/* Purchase Notifications */}
  <label>
    <input type="checkbox" />
    <span>
      <span>🛍️ Show Purchase Notifications</span>
      <span>Display notifications...</span>
    </span>
    <span>[Enabled/Disabled Badge]</span>
  </label>

  {/* Countdown Timer */}
  <label>
    <input type="checkbox" />
    <span>
      <span>⏱️ Show Countdown Timer</span>
      <span>Display flash sale...</span>
    </span>
    <span>[Enabled/Disabled Badge]</span>
  </label>
</div>
```

### Animation & Transitions

| Element | Transition | Duration |
|---------|-----------|----------|
| Border Color | border-color | 150ms |
| Background Color | background-color | 150ms |
| All Properties | all | smooth |

### Edit Pack Form - Same UI

The exact same Display Settings step appears in AdminPackEditPage.jsx with identical:
- Layout
- Colors
- Typography
- Styling
- Behavior
- Icons

This ensures consistency across create and edit workflows.

### Example Visual State Timeline

```
User loads Create Pack form
    ↓
Step 1: Fill basic info
    ↓
Step 2: Add pack items
    ↓
Step 3: Display Settings appears
    │
    ├─ Initial state:
    │  ☑ 🛍️  Show Purchase Notifications  [🟢 Enabled]
    │  ☑ ⏱️  Show Countdown Timer          [🟢 Enabled]
    │
    ├─ User clicks Purchase Notifications checkbox
    │  □ 🛍️  Show Purchase Notifications  [⚪ Disabled]  ← Border turns pink on hover
    │  ☑ ⏱️  Show Countdown Timer          [🟢 Enabled]
    │
    ├─ User clicks again to re-enable
    │  ☑ 🛍️  Show Purchase Notifications  [🟢 Enabled]  ← Badge turns green
    │  ☑ ⏱️  Show Countdown Timer          [🟢 Enabled]
    │
    └─ User proceeds to next step
       Settings are saved in packData state
```

---

This Visual Reference Guide provides complete details on the Display Settings UI implementation in both create and edit pack forms.
