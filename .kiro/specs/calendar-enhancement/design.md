# Design Document: Calendar Enhancement

## Overview

本设计文档描述"辰序"日历模块的增强方案，将现有的单一月视图升级为支持年/月/周/日四种视图的完整日历系统，并增加日程管理功能。

设计遵循 HarmonyOS ArkUI 开发规范，采用组件化架构，确保代码可维护性和可扩展性。

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Calendar Module                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │              View Layer (Pages)                      │   │
│  │  ┌──────────┬──────────┬──────────┬──────────┐     │   │
│  │  │ YearView │MonthView │ WeekView │ DayView  │     │   │
│  │  └──────────┴──────────┴──────────┴──────────┘     │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Component Layer (Reusable)                 │   │
│  │  ┌────────────┬─────────────┬──────────────────┐    │   │
│  │  │ DateCell   │ TimelineRow │ EventSheet       │    │   │
│  │  │ ViewTabs   │ EventBlock  │ SmartInputBar    │    │   │
│  │  └────────────┴─────────────┴──────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Service Layer                           │   │
│  │  ┌────────────────┬─────────────────────────────┐   │   │
│  │  │ HolidayService │ EventService                │   │   │
│  │  │ (existing)     │ (new)                       │   │   │
│  │  └────────────────┴─────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Data Layer                              │   │
│  │  ┌────────────────┬─────────────────────────────┐   │   │
│  │  │ Event Model    │ EventRepository (RdbStore)  │   │   │
│  │  └────────────────┴─────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. View Controller

负责管理四种视图的切换和状态同步。

```typescript
// CalendarViewType.ets
export enum CalendarViewType {
  YEAR = 'year',
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day'
}

// CalendarState.ets
interface CalendarState {
  currentView: CalendarViewType;
  selectedDate: Date;
  currentMonth: Date;
  events: CalendarEvent[];
}
```

### 2. Event Model

日程数据模型，支持完整的日程属性。

```typescript
// CalendarEvent.ets
export interface CalendarEvent {
  id: number;
  title: string;
  location: string;
  isAllDay: boolean;
  startTime: Date;
  endTime: Date;
  reminder: ReminderType;
  priority: boolean;
  repeatRule: RepeatRule;
  calendarId: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum ReminderType {
  NONE = 'none',
  AT_TIME = 'at_time',
  FIVE_MIN = '5min',
  TEN_MIN = '10min',
  THIRTY_MIN = '30min',
  ONE_HOUR = '1hour',
  ONE_DAY = '1day'
}

export enum RepeatRule {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}
```

### 3. EventService

日程服务，提供日程的 CRUD 操作。

```typescript
// EventService.ets
export class EventService {
  private static instance: EventService;
  private repository: EventRepository;
  
  static getInstance(): EventService;
  
  // CRUD Operations
  async createEvent(event: CalendarEvent): Promise<number>;
  async updateEvent(event: CalendarEvent): Promise<void>;
  async deleteEvent(id: number): Promise<void>;
  async getEventById(id: number): Promise<CalendarEvent | null>;
  
  // Query Operations
  async getEventsByDate(date: Date): Promise<CalendarEvent[]>;
  async getEventsByDateRange(start: Date, end: Date): Promise<CalendarEvent[]>;
  async searchEvents(keyword: string): Promise<CalendarEvent[]>;
  
  // Reminder Operations
  async scheduleReminder(event: CalendarEvent): Promise<void>;
  async cancelReminder(eventId: number): Promise<void>;
}
```

### 4. EventRepository

数据持久化层，使用 RdbStore 存储日程数据。

```typescript
// EventRepository.ets
export class EventRepository {
  private rdbStore: relationalStore.RdbStore | null = null;
  
  async initialize(context: Context): Promise<void>;
  async insert(event: CalendarEvent): Promise<number>;
  async update(event: CalendarEvent): Promise<void>;
  async delete(id: number): Promise<void>;
  async queryById(id: number): Promise<CalendarEvent | null>;
  async queryByDateRange(start: Date, end: Date): Promise<CalendarEvent[]>;
  async queryByKeyword(keyword: string): Promise<CalendarEvent[]>;
  
  // Serialization
  eventToRow(event: CalendarEvent): ValuesBucket;
  rowToEvent(row: ResultSet): CalendarEvent;
}
```

### 5. SmartParser

智能解析器，解析自然语言输入。

```typescript
// SmartParser.ets
export interface ParsedEvent {
  title: string;
  date: Date | null;
  time: Date | null;
  isAllDay: boolean;
}

export class SmartParser {
  static parse(input: string): ParsedEvent;
  
  private static extractDate(input: string): Date | null;
  private static extractTime(input: string): Date | null;
  private static extractTitle(input: string): string;
}
```

### 6. UI Components

#### ViewTabs Component
```typescript
@Component
export struct ViewTabs {
  @Link currentView: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
}
```

#### DateCell Component
```typescript
@Component
export struct DateCell {
  @Prop date: Date;
  @Prop isCurrentMonth: boolean;
  @Prop isToday: boolean;
  @Prop isSelected: boolean;
  @Prop lunarText: string;
  @Prop eventCount: number;
  @Prop isHoliday: boolean;
  onSelect: (date: Date) => void;
}
```

#### EventSheet Component
```typescript
@Component
export struct EventSheet {
  @Link isVisible: boolean;
  @Prop editingEvent: CalendarEvent | null;
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: number) => void;
}
```

#### TimelineRow Component
```typescript
@Component
export struct TimelineRow {
  @Prop hour: number;
  @Prop events: CalendarEvent[];
  @Prop isCurrentHour: boolean;
}
```

## Data Models

### Database Schema

```sql
CREATE TABLE IF NOT EXISTS calendar_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  location TEXT,
  is_all_day INTEGER DEFAULT 0,
  start_time INTEGER NOT NULL,
  end_time INTEGER NOT NULL,
  reminder TEXT DEFAULT 'none',
  priority INTEGER DEFAULT 0,
  repeat_rule TEXT DEFAULT 'none',
  calendar_id INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_events_end_time ON calendar_events(end_time);
```

### Event Data Flow

```
User Input → SmartParser → CalendarEvent → EventService → EventRepository → RdbStore
                                              ↓
                                        Notification
                                        Scheduler
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: View Switch Preserves Selected Date

*For any* selected date and any view transition (Year↔Month↔Week↔Day), the selected date SHALL remain unchanged after the view switch completes.

**Validates: Requirements 1.3**

### Property 2: Month Grid Row Calculation

*For any* month in any year, the month view grid SHALL have either 5 or 6 rows, calculated correctly based on the first day of the month and the total days in the month.

**Validates: Requirements 3.1**

### Property 3: Date Cell Display Priority

*For any* date, the secondary text in DateCell SHALL follow the priority: festival name (if festival) > solar term (if solar term day) > lunar date (default). The displayed text SHALL never be empty for valid dates.

**Validates: Requirements 3.3**

### Property 4: Event Indicator Consistency

*For any* date with one or more events, the DateCell SHALL display an event indicator. *For any* date with zero events, the DateCell SHALL NOT display an event indicator.

**Validates: Requirements 3.4**

### Property 5: Event Time Slot Rendering

*For any* event with start time T1 and end time T2, the event block in Week/Day view SHALL be positioned at the correct vertical offset corresponding to T1, and SHALL have height proportional to (T2 - T1).

**Validates: Requirements 4.4, 5.4**

### Property 6: Event Persistence Round-Trip

*For any* valid CalendarEvent object, saving to storage then loading from storage SHALL produce an equivalent object with all fields preserved.

**Validates: Requirements 6.4, 12.1, 12.4**

### Property 7: Empty Title Validation

*For any* event creation attempt where the title field is empty or contains only whitespace, the validation SHALL fail and the event SHALL NOT be persisted.

**Validates: Requirements 6.6**

### Property 8: Event Deletion Consistency

*For any* event that is deleted, subsequent queries for that event by ID SHALL return null, and the event SHALL NOT appear in any date range queries.

**Validates: Requirements 7.3**

### Property 9: Smart Parser Extraction

*For any* natural language input containing recognizable date/time patterns (e.g., "明天", "下午3点", "周五"), the SmartParser SHALL extract the correct date and/or time components. *For any* input without recognizable patterns, the entire input SHALL become the event title.

**Validates: Requirements 8.2, 8.4**

### Property 10: Recurring Event Instance Generation

*For any* recurring event with repeat rule R and date range [D1, D2], the number of generated instances SHALL equal the expected count based on the rule. For daily: (D2-D1)/1day, for weekly: (D2-D1)/7days, etc.

**Validates: Requirements 10.2, 10.3**

### Property 11: CRUD Operation Consistency

*For any* sequence of Create, Read, Update, Delete operations on events, the final state of the data store SHALL be consistent with the operations performed. Specifically:
- After Create: event exists and is queryable
- After Update: event reflects new values
- After Delete: event no longer exists

**Validates: Requirements 12.3**

## Error Handling

### Input Validation Errors

| Error Condition | Handling Strategy |
|-----------------|-------------------|
| Empty event title | Show inline error message, prevent save |
| End time before start time | Show error, auto-correct to start time + 1 hour |
| Invalid date selection | Ignore invalid input, keep previous selection |

### Data Layer Errors

| Error Condition | Handling Strategy |
|-----------------|-------------------|
| Database initialization failure | Show error toast, retry on next app launch |
| Query failure | Return empty array, log error |
| Insert/Update failure | Show error toast, keep form data for retry |
| Delete failure | Show error toast, keep event in UI |

### Smart Parser Errors

| Error Condition | Handling Strategy |
|-----------------|-------------------|
| Unrecognized date format | Use current date as default |
| Unrecognized time format | Set isAllDay = true |
| Empty input | Disable save button |

## Testing Strategy

### Unit Tests

Unit tests will cover specific examples and edge cases:

1. **DateCell rendering** - Verify correct display for today, selected, holiday dates
2. **Grid calculation** - Test months with 28, 29, 30, 31 days
3. **SmartParser** - Test specific input patterns
4. **Event validation** - Test boundary conditions

### Property-Based Tests

Property-based tests will use **fast-check** (or equivalent ArkTS-compatible library) to verify universal properties:

1. **View switch invariant** - Generate random dates and view transitions
2. **Grid row calculation** - Generate random year/month combinations
3. **Event persistence round-trip** - Generate random valid events
4. **CRUD consistency** - Generate random operation sequences

**Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with: **Feature: calendar-enhancement, Property {N}: {description}**

### Integration Tests

1. **Full event lifecycle** - Create → Edit → Delete flow
2. **View synchronization** - Event created in one view appears in all views
3. **Data persistence** - Events survive app restart
