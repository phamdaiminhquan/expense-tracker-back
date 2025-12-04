# Planning Guide

An AI-powered expense tracker that parses natural language entries into structured transaction data, making personal finance tracking effortless and intuitive.

**Experience Qualities**:
1. **Intelligent** - The app understands natural language expense entries and extracts structured data automatically
2. **Effortless** - Single text input creates complete transaction records without forms or dropdowns
3. **Trustworthy** - Clear feedback on parsing results with manual edit capabilities for confidence

**Complexity Level**: Light Application (multiple features with basic state)
  - Combines AI text parsing with CRUD operations and local persistence for a streamlined expense management experience

## Essential Features

### AI-Powered Expense Parsing
- **Functionality**: Accepts free-form text like "Minh Quân bánh tráng trộn 35" and extracts user, amount (in thousands), and description
- **Purpose**: Eliminates tedious form-filling by understanding natural language
- **Trigger**: User types text and presses enter or clicks add button
- **Progression**: Input text → Send to Gemini API → Parse JSON response → Retry up to 3 times if malformed → Display success/error → Store transaction
- **Success criteria**: Correctly extracts user name, amount in thousands (without zeros), and content description from Vietnamese/English text

### Transaction Management
- **Functionality**: Display all transactions with user, amount, type (spend/earn), content, and timestamp
- **Purpose**: Provides clear overview of financial activity
- **Trigger**: Automatic on page load and after adding transactions
- **Progression**: Load from KV storage → Render list → Allow edit/delete actions
- **Success criteria**: All transactions persist between sessions and support inline editing

### Manual Transaction Editing
- **Functionality**: Click any transaction to edit fields directly
- **Purpose**: Allows correction of AI parsing errors or manual updates
- **Trigger**: User clicks edit icon on transaction row
- **Progression**: Click edit → Show editable fields → Save changes → Update storage → Refresh display
- **Success criteria**: All fields editable without data loss

### Statistics Overview
- **Functionality**: Show total spend, total earn, and net balance
- **Purpose**: Provides quick financial snapshot
- **Trigger**: Automatic calculation when transactions change
- **Progression**: Sum all spend amounts → Sum all earn amounts → Calculate difference → Display metrics
- **Success criteria**: Real-time updates as transactions are added/edited/deleted

## Edge Case Handling

- **API Failures**: Retry logic with exponential backoff, show error toast after 3 failed attempts, allow manual entry
- **Malformed AI Response**: JSON validation with retry mechanism, fallback to manual input form
- **Empty Input**: Disable submit button and show placeholder guidance
- **Ambiguous Amounts**: AI should default to "spend" type unless keywords like "nhận", "thu", "earn" are present
- **Missing Fields**: AI should return null for optional fields (earn/spend), validation ensures required fields exist

## Design Direction

The design should feel modern, efficient, and intelligent - like a smart assistant handling your finances. Vietnamese-first with clean typography, clear data hierarchy, and subtle AI-powered interactions that feel magical but trustworthy.

## Color Selection

A professional yet warm palette that balances financial seriousness with approachability, using teal as the primary brand color with warm orange accents.

- **Primary Color**: Deep Teal (oklch(0.45 0.12 200)) - Represents trust, intelligence, and financial stability
- **Secondary Colors**: Soft slate backgrounds (oklch(0.96 0.01 220)) for cards, muted purple (oklch(0.65 0.08 280)) for secondary actions
- **Accent Color**: Warm Orange (oklch(0.68 0.15 45)) for CTAs, success states, and positive earnings
- **Foreground/Background Pairings**: 
  - Background (White oklch(1 0 0)): Dark Slate Text (oklch(0.25 0.02 220)) - Ratio 12.5:1 ✓
  - Primary (Teal oklch(0.45 0.12 200)): White Text (oklch(1 0 0)) - Ratio 6.8:1 ✓
  - Accent (Orange oklch(0.68 0.15 45)): White Text (oklch(1 0 0)) - Ratio 4.9:1 ✓
  - Card (Soft Slate oklch(0.96 0.01 220)): Dark Slate Text (oklch(0.25 0.02 220)) - Ratio 11.8:1 ✓

## Font Selection

Typography should convey modernity and precision, balancing Vietnamese character support with readability for financial data.

- **Primary Font**: Be Vietnam Pro (Vietnamese-optimized, clean geometric sans-serif)
- **Monospace Numbers**: JetBrains Mono for amounts and timestamps

- **Typographic Hierarchy**:
  - H1 (App Title): Be Vietnam Pro Bold/32px/tight letter spacing
  - H2 (Statistics): Be Vietnam Pro Semibold/24px/normal spacing
  - Transaction Amount: JetBrains Mono Bold/18px/tabular numbers
  - Body Text: Be Vietnam Pro Regular/15px/relaxed line height (1.6)
  - Labels: Be Vietnam Pro Medium/13px/uppercase with wide spacing

## Animations

Subtle, purposeful animations that reinforce the AI's intelligence: smooth transitions when parsing text, gentle pulse on API calls, satisfying checkmarks on successful additions, and fluid list updates. All animations under 300ms to maintain snappy responsiveness.

## Component Selection

- **Components**: 
  - Input with Button for text entry (shadcn Input + Button)
  - Card components for statistics display (shadcn Card)
  - Table or custom list for transactions (shadcn Table)
  - Dialog for editing transactions (shadcn Dialog)
  - Toast for notifications (sonner)
  - Badge for transaction types (shadcn Badge)
  - Skeleton loaders during API calls (shadcn Skeleton)

- **Customizations**: 
  - Custom transaction list item with inline edit capability
  - AI parsing status indicator with animated states
  - Vietnamese currency formatter (thousands with 'k' suffix)

- **States**: 
  - Input: default, focused (teal ring), disabled during API call, error (red ring)
  - Buttons: primary (teal), secondary (slate), destructive (red), all with hover lift and active press
  - Transaction rows: default, hover (subtle background), editing (highlighted border)

- **Icon Selection**: 
  - Plus (add transaction)
  - PencilSimple (edit)
  - Trash (delete)
  - SpinnerGap (loading)
  - CheckCircle (success)
  - Warning (error/retry)
  - TrendUp/TrendDown (earnings/spending)

- **Spacing**: 
  - Container padding: p-6
  - Card padding: p-4
  - Section gaps: gap-6
  - List item gaps: gap-3
  - Inline element gaps: gap-2

- **Mobile**: 
  - Stack statistics cards vertically on mobile
  - Full-width input on small screens
  - Simplified transaction list (hide timestamps, show on tap)
  - Bottom-fixed input bar for easy thumb access
  - Responsive table → card layout transformation below 640px
