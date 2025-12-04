# Planning Guide

An AI-powered expense tracker with fund management that parses natural language entries into structured transaction data, supporting both personal and shared fund tracking for effortless collaborative finance management.

**Experience Qualities**:
1. **Intelligent** - The app understands natural language expense entries and extracts structured data automatically
2. **Collaborative** - Shared funds enable multiple users to track expenses together with per-user analytics
3. **Organized** - Multiple fund support allows users to separate personal, shared, and project-specific finances

**Complexity Level**: Light Application (multiple features with basic state)
  - Combines AI text parsing with CRUD operations, multi-fund management, and local persistence for a comprehensive expense management experience

## Essential Features

### User Authentication
- **Functionality**: Mock login system with two demo accounts (Minh Quân and Tuệ Minh), session management
- **Purpose**: Associates transactions with specific users and enables shared fund collaboration
- **Trigger**: App load shows login screen, user enters email or clicks demo account
- **Progression**: Enter email → Validate against mock users → Set session → Create default personal fund if needed → Redirect to main app
- **Success criteria**: Only two demo users available, persists user context during session, logout clears session, automatically creates default personal fund on first login

### Fund Management
- **Functionality**: Users can create and manage multiple funds - each fund is either personal (single user) or shared (multiple users). Default "Cá nhân" fund created automatically for each user. Funds have foreign key relationships with both users and transactions.
- **Purpose**: Organize finances by context (personal, shared projects, group events) and enable collaborative expense tracking
- **Trigger**: Fund selector dropdown in main interface, "Tạo quỹ" button
- **Progression**: Click create fund → Enter fund name → Select type (personal/shared) → If shared, select member users → Save → Auto-select new fund
- **Success criteria**: Users can switch between funds, create unlimited funds, shared funds show all members' transactions, personal funds show only owner's expenses, fund data persists between sessions

### AI-Powered Expense Parsing
- **Functionality**: Accepts free-form text like "bánh tráng trộn 35" (no longer requires user name since it's from logged-in user) and extracts amount (in thousands) and description, associating with current fund. Validates prompt before API call. Distinguishes between system errors (API down) and invalid prompts (unclear input).
- **Purpose**: Eliminates tedious form-filling by understanding natural language and using session context, with intelligent error handling
- **Trigger**: User types text and presses enter or clicks add button
- **Progression**: Input text → Validate prompt format → Send to Gemini API → Parse JSON response → Retry up to 2 times if system error → Associate with current user and selected fund → Display success/error → Store transaction with fundId foreign key OR save as pending prompt
- **Success criteria**: Correctly extracts amount in thousands (without zeros) and content description from Vietnamese/English text, automatically tags with current user's name, ID, and selected fund ID. For system errors, saves as pending prompt. For invalid prompts, requests user to revise without saving.

### Transaction Management
- **Functionality**: Display all transactions for current fund with amount, type (spend/earn), content, user name, and timestamp. Pending prompts are shown as notes with special styling and excluded from statistics. Transactions are filtered by fundId.
- **Purpose**: Provides clear overview of fund's financial activity, with distinction between valid transactions and pending prompts. In shared funds, shows who made each transaction.
- **Trigger**: Automatic on page load, fund selection change, and after adding transactions
- **Progression**: Load from KV storage → Filter by fundId → Render list showing userName for each transaction → Allow edit/delete actions → Highlight pending prompts
- **Success criteria**: All transactions persist between sessions with userId and fundId foreign keys, support inline editing, isolated per fund. User name displayed for each transaction. Pending prompts are visually distinct and can be reprocessed later

### Pending Prompt Management
- **Functionality**: When API fails due to system errors, saves the prompt text with timestamp for later processing. User can edit and reprocess prompts when ready. Saved with current fundId.
- **Purpose**: Prevents data loss during system outages and allows users to quickly note expenses even when busy
- **Trigger**: API system error (not invalid prompt), or user manually retries pending prompt
- **Progression**: API fails → Save prompt with isPendingPrompt flag, fundId, and original timestamp → Display in list as note → User clicks reprocess → Edit prompt if needed → Process with API → Update to valid transaction with original timestamp and fundId
- **Success criteria**: Pending prompts preserve the original expense time (promptCreatedAt) and fundId, are excluded from statistics, appear distinctly in list, and can be converted to valid transactions

### Manual Transaction Editing
- **Functionality**: Click any transaction to edit fields directly
- **Purpose**: Allows correction of AI parsing errors or manual updates
- **Trigger**: User clicks edit icon on transaction row
- **Progression**: Click edit → Show editable fields → Save changes → Update storage → Refresh display
- **Success criteria**: All fields editable without data loss
### Statistics Overview & Fund Analytics
- **Functionality**: Show total spend, total earn, and net balance for valid transactions only (excluding pending prompts). Time-based filtering (day/week/month/year/all). For shared funds, show per-user breakdown of spending with individual totals.
- **Purpose**: Provides accurate financial snapshot of fund activity. In shared funds, enables tracking of who spent how much during different time periods for fair expense splitting.
- **Trigger**: Automatic calculation when transactions change, fund selection changes, or time filter changes
- **Progression**: Filter transactions by fundId → Apply time filter → Filter out pending prompts → Calculate total spend/earn → Calculate net balance → If shared fund, group by userId and calculate per-user totals → Display metrics and optional per-user breakdown
- **Success criteria**: Real-time updates as transactions are added/edited/deleted, only includes successfully parsed transactions, time filtering works accurately, shared fund per-user statistics show correct totals, statistics isolate by fund

## Edge Case Handling

- **API System Failures**: Retry logic for transient errors, save as pending prompt after failures, show system error toast with explanation, allow later reprocessing
- **Invalid Prompts**: Validate prompt length and format before API call, distinguish from system errors, request user to revise prompt without saving
- **Malformed AI Response**: JSON validation with retry mechanism for system issues, save as pending prompt if parsing fails
- **Empty Input**: Disable submit button and show placeholder guidance, disable when no fund selected
- **Unauthorized Access**: Login screen on app load, redirect to login on logout, persist session state
- **User Data Isolation**: Transactions filtered by fundId, users only see funds they have access to
- **Fund Data Isolation**: Transactions belong to specific funds via fundId foreign key, switching funds filters transactions
- **No Fund Selected**: Disable transaction input until user selects a fund
- **First-Time User**: Automatically create default "Cá nhân" personal fund on first login
- **Shared Fund Access**: Users can only see and add transactions to funds where they are members
- **Pending Prompt Statistics**: Exclude pending prompts from financial calculations, show only as notes in list
- **Timestamp Preservation**: When processing pending prompts, use original creation time (promptCreatedAt) not processing time
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
  - Dialog for editing transactions and creating funds (shadcn Dialog)
  - Select dropdown for fund selection (shadcn Select)
  - Radio group for fund type selection (shadcn RadioGroup)
  - Checkbox for shared fund member selection (shadcn Checkbox)
  - Toast for notifications (sonner)
  - Badge for transaction types (shadcn Badge)
  - Skeleton loaders during API calls (shadcn Skeleton)

- **Customizations**: 
  - Custom transaction list item with inline edit capability
  - AI parsing status indicator with animated states
  - Vietnamese currency formatter (thousands with 'k' suffix)
  - Fund selector with type indicators (personal/shared)
  - Per-user statistics breakdown for shared funds
  - Time-based filtering UI (day/week/month/year/all)

- **States**: 
  - Input: default, focused (teal ring), disabled during API call or no fund selected, error (red ring)
  - Buttons: primary (teal), secondary (slate), destructive (red), all with hover lift and active press
  - Transaction rows: default, hover (subtle background), editing (highlighted border)
  - Fund selector: shows fund type icon, member count for shared funds

- **Icon Selection**: 
  - Plus (add transaction, create fund)
  - PencilSimple (edit)
  - Trash (delete)
  - SpinnerGap (loading)
  - CheckCircle (success)
  - Warning (error/retry)
  - TrendUp/TrendDown (earnings/spending)
  - SignIn/SignOut (authentication)
  - Sparkle (branding, AI magic)
  - ArrowClockwise (reprocess pending prompt)
  - NotePencil (pending prompt indicator)
  - Users (shared fund icon)
  - User (personal fund icon)
  - Wallet (balance)
  - ChartBar (view per-user statistics)

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
  - Fund selector adapts to full width on mobile

- **Mobile**: 
  - Stack statistics cards vertically on mobile
  - Full-width input on small screens
  - Simplified transaction list (hide timestamps, show on tap)
  - Bottom-fixed input bar for easy thumb access
  - Responsive table → card layout transformation below 640px
