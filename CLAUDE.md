# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a frontend-only project with no build process. Serve the static files using:

```bash
# Python simple server
python -m http.server 8000

# Node.js live-server (if available)
npx live-server

# Any static file server pointing to root directory
```

Access the application at:
- Main page: `http://localhost:8000/index.html`
- Dashboard: `http://localhost:8000/dashboard.html`
- Editor: `http://localhost:8000/editor.html`

## Project Architecture

### Technology Stack
- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS (via CDN)
- **Charts**: Chart.js for dashboard visualizations
- **Icons**: Font Awesome
- **Fonts**: Noto Sans KR (Korean web font)

### Core Components

#### 1. Main Landing Page (`index.html`)
- Hero section with call-to-action
- Course categories (Scratch → Python → Web Development)
- Student project gallery
- Interactive modals and animations
- Managed by `js/main.js`

#### 2. Learning Analytics Dashboard (`dashboard.html`)
- Real-time learning statistics
- Chart.js visualizations (weekly progress, language distribution, monthly trends)
- Achievement system with badges and XP tracking
- Activity feed and project progress
- Managed by `js/dashboard.js`

#### 3. Code Editor (`editor.html`)
- Prepared for Scratch Foundation GUI integration
- CodeKids branding and Korean localization
- Project save/load functionality design
- Managed by integration files

### Data Architecture
- **RESTful API Design**: Ready for 5 core tables (students, learning_sessions, projects, achievements, daily_activities)
- **Client-side Storage**: localStorage for demo data and user preferences
- **Real-time Sync**: Prepared structure for dashboard-main system integration

### Key JavaScript Modules

#### `js/main.js` (754 lines)
- Navigation and smooth scrolling
- Interactive modals for courses and projects
- Animation system with intersection observers
- Mobile responsive menu
- Button ripple effects and hover animations
- Statistics counter animations

#### `js/dashboard.js`
- Chart initialization and data visualization
- Performance monitoring
- Real-time data updates simulation
- Dashboard widgets and statistics

#### Integration Files (Future)
- `js/scratch-api.js`: Project CRUD operations
- `js/scratch-integration.js`: GUI embedding
- `js/scratch-analytics.js`: User behavior tracking

### Styling System

#### CSS Architecture
- `css/style.css`: Main stylesheet with responsive design
- `css/dashboard.css`: Dashboard-specific styles
- CSS Grid and Flexbox for layouts
- Mobile-first responsive design (4 breakpoints)

#### Design System
- **Primary Colors**: #4F46E5 (indigo), #06B6D4 (cyan), #F59E0B (amber)
- **Typography**: Noto Sans KR with responsive scaling using clamp()
- **Animations**: CSS3 transitions with cubic-bezier easing
- **Accessibility**: WCAG 2.1 AA compliance, prefers-reduced-motion support

### Internationalization
- Korean-first content with English fallbacks
- Font optimization for Korean text rendering
- Cultural adaptation for educational content

## Development Patterns

### File Organization
```
/
├── index.html              # Main landing page
├── dashboard.html          # Analytics dashboard
├── editor.html            # Code editor page
├── css/
│   ├── style.css          # Main styles
│   └── dashboard.css      # Dashboard styles
├── js/
│   ├── main.js           # Main page logic
│   ├── dashboard.js      # Dashboard functionality
│   ├── scratch-api.js    # API integration (future)
│   └── scratch-integration.js # Scratch GUI (future)
├── README.md             # Comprehensive project documentation
└── SCRATCH_INTEGRATION.md # Detailed Scratch integration guide
```

### Code Conventions
- ES6+ features with browser compatibility
- Async/await for asynchronous operations
- Event delegation for dynamic elements
- CSS custom properties for theming
- BEM-like class naming for components

### Integration Guidelines
- **Scratch Foundation GUI**: Complete integration roadmap in `SCRATCH_INTEGRATION.md`
- **API Layer**: RESTful endpoints designed for `/tables/` structure
- **Real-time Features**: WebSocket preparation for live collaboration
- **Performance**: Lazy loading, image optimization, debounced scroll handlers

## Educational Platform Features

### Gamification System
- XP points and level progression
- Achievement badges and milestones
- Learning streaks and daily challenges
- Student project showcases

### Target Audience
- **Primary**: Elementary grades 3-6, Middle school 1-3
- **Localization**: Korean educational system alignment
- **Accessibility**: Age-appropriate UI/UX design

### Learning Progression
1. **Beginner**: Scratch block coding (drag-and-drop interface)
2. **Intermediate**: Python text coding (online IDE)
3. **Advanced**: Web development (HTML/CSS/JS editors)

## Future Development Phases

### Phase 1: User System (4 weeks)
- Authentication and user management
- Student/parent dashboards
- Progress tracking implementation

### Phase 2: Learning Content (8 weeks)
- Scratch GUI integration (following SCRATCH_INTEGRATION.md)
- Python online IDE (Monaco Editor)
- HTML/CSS/JS code editors

### Phase 3: Interactive Features (6 weeks)
- Real-time chat/Q&A system
- Code review and peer sharing
- Online coding competitions

### Legacy System Modernization Approach
This project applies mainframe-to-cloud transformation experience to education, emphasizing:
- Modular component design
- API-first architecture
- Cloud-native deployment readiness
- Performance optimization strategies