# Planning Guide

An AI-powered expense tracker with fund management that parses natural language entries into structured message data, featuring a chat-like interface for intuitive expense logging and supporting both personal and shared fund tracking.

**Experience Qualities**:
1. **Conversational** - Chat-style interface makes expense tracking feel natural and effortless, like messaging a friend
2. **Intelligent** - The app understands natural language expense entries and extracts structured data automatically
3. **Organized** - Clear navigation between fund list and message views with persistent, sticky UI elements

**Complexity Level**: Light Application (multiple features with basic state)
  - Combines AI text parsing with CRUD operations, multi-fund management, chat-style UI, and local persistence for a comprehensive expense management experience

## Essential Features

### User Authentication
- **Functionality**: Mock login system with two demo accounts (Minh Quân and Tuệ Minh), session management
- **Purpose**: Associates messages with specific users and enables shared fund collaboration
- **Trigger**: App load shows login screen, user enters email or clicks demo account
- **Progression**: Enter email → Validate against mock users → Set session → Create default personal fund if needed → Redirect to main app
- **Success criteria**: Only two demo users available, persists user context during session, logout clears session, automatically creates default personal fund on first login

### Fund Management
- **Functionality**: Users can create and manage multiple funds. After login, users see a fund list screen with all accessible funds. Each fund is either personal (single user) or shared (multiple users). Default "Cá nhân" fund created automatically. Tapping a fund navigates to its message view. Header contains app title, tagline, create fund button, and logout button.
- **Purpose**: Organize finances by context (personal, shared projects, group events) and enable collaborative expense tracking with clear navigation
- **Trigger**: Fund list shown after login, "Tạo quỹ mới" button in header, back arrow from message view
- **Progression**: Login → Fund list screen → Click fund card → Message view OR Click create fund → Enter details → Save → Return to list
- **Success criteria**: Users can switch between funds, create unlimited funds, clear visual hierarchy, easy navigation back to list, header elements properly positioned

### AI-Powered Expense Parsing
- **Functionality**: Accepts free-form text like "bánh tráng trộn 35" (no longer requires user name since it's from logged-in user) and extracts amount (in thousands), description, and matching category (if available) associating with current fund. Categories are matched based on their descriptions. Validates prompt before API call. Distinguishes between system errors (API down) and invalid prompts (unclear input).
- **Purpose**: Eliminates tedious form-filling by understanding natural language, automatically categorizing expenses, and using session context with intelligent error handling
- **Trigger**: User types text and presses enter or clicks add button
- **Progression**: Input text → Validate prompt format → Send to Gemini API with fund categories → Parse JSON response including categoryId → Retry up to 2 times if system error → Associate with current user, selected fund, and matched category → Display success/error → Store message with fundId and categoryId foreign keys OR save as pending prompt
- **Success criteria**: Correctly extracts amount in thousands (without zeros), content description, and matching category from Vietnamese/English text, automatically tags with current user's name, ID, selected fund ID, and categoryId if match found. For system errors, saves as pending prompt. For invalid prompts, requests user to revise without saving. Can handle messages without matching categories.

### Message Management
- **Functionality**: Chat-style interface with sticky header (fund name, members, back button, category management button, statistics button) and sticky bottom input. Messages displayed as chat bubbles, newest at bottom. Current user's messages align right with primary color, others align left. Scroll up to load more (10 per page). Input has send icon that shows spinner during processing. Messages with categories display a category badge.
- **Purpose**: Provides familiar chat-like experience for natural expense logging with clear visual ownership, smooth pagination, and category organization
- **Trigger**: Select fund from list, scroll to top for pagination, type and send message
- **Progression**: Enter message view → See chat history → Scroll up for older → Type expense → Send → See spinner → Message appears as bubble with category badge if applicable → Auto-scroll to bottom
- **Success criteria**: Sticky header and input, smooth scrolling, pagination loads seamlessly, bubbles styled by user, timestamps formatted contextually (time/yesterday/date), auto-scroll on new messages, category badges visible when present

### Pending Prompt Management
- **Functionality**: When API fails due to system errors, saves the prompt text with timestamp for later processing. User can edit and reprocess prompts when ready. Saved with current fundId.
- **Purpose**: Prevents data loss during system outages and allows users to quickly note expenses even when busy
- **Trigger**: API system error (not invalid prompt), or user manually retries pending prompt
- **Progression**: API fails → Save prompt with isPendingPrompt flag, fundId, and original timestamp → Display in list as note → User clicks reprocess → Edit prompt if needed → Process with API → Update to valid message with original timestamp and fundId
- **Success criteria**: Pending prompts preserve the original expense time (promptCreatedAt) and fundId, are excluded from statistics, appear distinctly in list, and can be converted to valid messages

### Manual Message Editing
- **Functionality**: Click any message to edit fields directly
- **Purpose**: Allows correction of AI parsing errors or manual updates
- **Trigger**: User clicks edit icon on message row
- **Progression**: Click edit → Show editable fields → Save changes → Update storage → Refresh display
- **Success criteria**: All fields editable without data loss
### Statistics Overview & Fund Analytics
- **Functionality**: Dialog popup showing total spend, total earn, net balance for valid messages only. For shared funds, show per-user breakdown with individual totals. Displays category-based breakdown showing spend/earn per category with message counts. Shows uncategorized messages separately. Accessed via chart icon in message view header.
- **Purpose**: Provides accurate financial snapshot in non-intrusive popup, enabling per-user expense tracking in shared funds and category-based spending analysis
- **Trigger**: Click statistics button (chart icon) in message view header
- **Progression**: Click chart icon → Dialog opens → View totals, per-user breakdown, and category breakdown → Close to return
- **Success criteria**: Dialog overlay, clear metrics display, per-user stats for shared funds, category-based breakdown with counts, uncategorized section, excludes pending prompts, clean responsive layout

### Category Management
- **Functionality**: Fund-scoped categories with name and description. Users can create, edit, and delete categories via management dialog. AI uses category descriptions to automatically classify messages. Categories can only be deleted if not used in any messages. Each category belongs to a specific fund.
- **Purpose**: Enables organized expense tracking by type (groceries, dining, transport, etc.) with AI-assisted categorization and detailed reporting
- **Trigger**: Click category management button (tag icon) in message view header, create/edit/delete actions in dialog
- **Progression**: Click tag icon → Dialog opens → Create category (name + description) → AI uses description to match future messages → View/edit existing categories → Delete unused categories → Close dialog
- **Success criteria**: Create categories with name and description, AI automatically assigns categories based on descriptions during expense parsing, categories appear in statistics breakdown, categories displayed as badges on messages, cannot delete categories in use, edit updates category details, categories scoped to specific fund

## Edge Case Handling

- **API System Failures**: Retry logic for transient errors, save as pending prompt after failures, show system error toast, allow later reprocessing
- **Invalid Prompts**: Validate prompt length/format, distinguish from system errors, request user to revise without saving
- **Malformed AI Response**: JSON validation with retry for system issues, save as pending if parsing fails
- **Empty Input**: Disable submit button, show placeholder guidance
- **Unauthorized Access**: Login screen on app load, redirect to login on logout
- **User Data Isolation**: Messages filtered by fundId, users only see accessible funds
- **Fund Data Isolation**: Messages belong to specific funds, switching funds changes view
- **No Fund Selected**: Navigation prevents accessing message view without fund selection
- **First-Time User**: Auto-create default "Cá nhân" personal fund on first login
- **Shared Fund Access**: Users only see/add to funds where they're members
- **Pending Prompt Statistics**: Excluded from calculations, shown as special bubbles in chat
- **Timestamp Preservation**: Pending prompts use original creation time when processed
- **Scroll Pagination**: Loading more messages maintains scroll position, smooth experience
- **Concurrent Messages**: Spinner prevents sending multiple messages simultaneously
- **Long Message Lists**: Pagination (10 items) prevents performance issues
- **Mobile Responsiveness**: Chat bubbles adapt width, header/input remain accessible
- **Category Deletion**: Categories with existing messages cannot be deleted, show error message
- **No Matching Category**: AI assigns null categoryId if no category matches, message still created successfully
- **Category Reprocessing**: Pending prompts processed with current fund categories at time of reprocessing

## Design Direction

The design should feel modern, conversational, and effortless - like a messaging app for your finances. Clean chat-style bubbles, smooth scrolling, and intuitive navigation create a familiar, friendly experience that makes expense tracking feel natural rather than tedious.

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
  - Message Amount: JetBrains Mono Bold/18px/tabular numbers
  - Body Text: Be Vietnam Pro Regular/15px/relaxed line height (1.6)
  - Labels: Be Vietnam Pro Medium/13px/uppercase with wide spacing

## Animations

Purposeful, chat-style animations: smooth message appearance, gentle scroll behavior, satisfying send button transformation to spinner, and fluid navigation transitions. All under 300ms to maintain messaging app responsiveness.

## Component Selection

- **Components**: 
  - Card for fund list items, statistics, and category items (shadcn Card)
  - Dialog for creating funds, viewing statistics, and managing categories (shadcn Dialog)
  - Input with Button for chat-style message entry (shadcn Input + Button)
  - Textarea for category descriptions (shadcn Textarea)
  - Toast for notifications (sonner)
  - Badge for message amounts, pending status, and category tags (shadcn Badge)
  - Spinner icon for loading states (Phosphor Icons)
  - ScrollArea for category list in management dialog (shadcn ScrollArea)
  - Label for form fields (shadcn Label)

- **Customizations**: 
  - Chat bubble layout with right/left alignment based on user
  - Category badges on message bubbles (secondary variant, small size)
  - Sticky header with back, category management, and statistics buttons
  - Sticky bottom input bar with send icon
  - Pagination with "load more" at top of scroll
  - Fund list cards with icons and member info
  - Message bubbles with hover actions (edit/delete)
  - Contextual timestamp formatting (time/yesterday/date)
  - Category management dialog with create/edit inline forms
  - Category cards showing usage count
  - Statistics breakdown by category with uncategorized section
  - Disabled delete button for categories in use

- **States**: 
  - Input: default, focused (primary ring), disabled during API call with spinner
  - Send button: default (paper plane icon), loading (spinner), disabled (no input)
  - Fund cards: default, hover (accent background), active tap
  - Message bubbles: default, hover (show actions)
  - Category badges: secondary variant, small text
  - Back/Statistics/Category buttons: default, hover, active
  - Category management: create mode (inline form), edit mode (inline form), view mode (cards)
  - Delete category button: enabled (red), disabled (gray, when in use)
  - Category cards: default, editing (opacity reduced)

- **Icon Selection**: 
  - PaperPlaneRight (send message/fill variant)
  - CircleNotch (loading spinner)
  - ArrowLeft (back navigation)
  - ChartBar (view statistics)
  - Tag (category management and badges/fill variant)
  - Plus (create fund and category)
  - SignOut (logout)
  - Users/User (fund type indicators/fill variants)
  - CaretRight (fund list navigation hint)
  - PencilSimple (edit message and category)
  - Trash (delete message and category)
  - ArrowClockwise (reprocess pending)
  - NotePencil (pending indicator)
  - TrendUp/TrendDown (statistics earnings/spending)
  - Wallet (balance in statistics)
  - Check/X (save/cancel in forms)

- **Spacing**: 
  - Chat bubble gaps: gap-4 (between messages)
  - Container padding: px-4 py-6
  - Header/Footer padding: px-4 py-4
  - Card padding: p-4
  - Inline element gaps: gap-2 to gap-3
  - Max message width: 85% mobile, 70% desktop

- **Mobile**: 
  - Full-screen chat view (100vh)
  - Sticky header and input work on all devices
  - Chat bubbles stack naturally with responsive widths
  - Fund list cards full-width on mobile
  - Bottom input optimized for thumb access
  - Statistics dialog scrollable on small screens
  - Touch-friendly tap targets (min 44px)
