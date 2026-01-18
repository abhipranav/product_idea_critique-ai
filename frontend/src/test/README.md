# Frontend Tests

This directory contains comprehensive tests for the React frontend of the JIRA Critique Tool.

## Test Setup

### Technologies Used
- **Vitest**: Fast testing framework for Vite projects
- **React Testing Library**: Component testing utilities
- **jsdom**: DOM environment for testing
- **User Event**: Realistic user interaction testing

### Configuration
- `vitest.config.js`: Vitest configuration with jsdom environment
- `src/test/setup.js`: Global test setup with jest-dom matchers
- `package.json`: Test scripts configured

## Test Structure

### API Tests
#### `src/api/analyze.test.js`
Tests for the API client functions:
- ✅ Successful API calls with correct data formatting
- ✅ Error handling for failed requests
- ✅ Different analysis modes (ticket/business) with criteria

### Hook Tests
#### `src/hooks/useTheme.test.js`
Tests for the theme management hook:
- ✅ Initial theme detection (dark/light/system preference)
- ✅ Theme toggling functionality
- ✅ localStorage integration
- ✅ DOM attribute updates

### Component Tests

#### `src/components/Header/Header.test.jsx`
Tests for the header component:
- ✅ Renders title and tagline correctly
- ✅ Theme toggle button functionality
- ✅ Icon display based on theme

#### `src/components/ModeToggle/ModeToggle.test.jsx`
Tests for analysis mode selection:
- ✅ Both mode buttons render
- ✅ Active state highlighting
- ✅ Mode change callbacks
- ✅ Button click interactions

#### `src/components/CriteriaSelector/CriteriaSelector.test.jsx`
Tests for business criteria management:
- ✅ Preset criteria display and selection
- ✅ Custom criteria addition
- ✅ Criteria removal
- ✅ Form validation and input clearing

#### `src/components/AnalysisForm/AnalysisForm.test.jsx`
Tests for the main analysis form:
- ✅ Form element rendering
- ✅ Mode switching (ticket/business)
- ✅ Placeholder text changes
- ✅ Criteria selector visibility
- ✅ Form submission with correct data
- ✅ Button state management (enabled/disabled)
- ✅ Loading state handling

#### `src/components/Results/Results.test.jsx`
Tests for analysis results display:
- ✅ Loading state rendering
- ✅ Error message display
- ✅ Results data visualization
- ✅ Score color coding
- ✅ Risk level display
- ✅ Critiques and blind spots sections

## Running Tests

### Run All Tests
```bash
npm test
# or
npm run test
```

### Run Tests Once (CI mode)
```bash
npm run test:run
```

### Run Tests with UI
```bash
npm run test:ui
```

### Run Specific Test Files
```bash
# Test only API functions
npx vitest src/api/analyze.test.js

# Test only components
npx vitest src/components/
```

### Run with Coverage
```bash
npx vitest --coverage
```

## Test Coverage

The tests cover:
- ✅ **API Integration**: Mocked HTTP requests and responses
- ✅ **User Interactions**: Button clicks, form submissions, input changes
- ✅ **State Management**: Component state changes and prop updates
- ✅ **Error Handling**: API failures, validation errors, edge cases
- ✅ **Accessibility**: Semantic HTML and ARIA attributes
- ✅ **DOM Manipulation**: Theme changes, dynamic content updates

## Mocking Strategy

- **API Calls**: Fully mocked with `vi.mock()` to avoid external dependencies
- **Browser APIs**: localStorage and DOM APIs mocked appropriately
- **External Libraries**: Any third-party dependencies are mocked

## Test Results

Current test status: **47 tests passing** ✅

- API Tests: 3 tests
- Hook Tests: 6 tests
- Component Tests: 38 tests across 6 components

## Adding New Tests

When adding new functionality:

1. **For new components**: Create `ComponentName.test.jsx` in the same directory
2. **For new hooks**: Create `hookName.test.js` in the hooks directory
3. **For API functions**: Add tests to existing API test files
4. **Follow patterns**: Use `describe/it` blocks, proper mocking, and React Testing Library queries

## CI/CD Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run Frontend Tests
  run: |
    cd frontend
    npm ci
    npm run test:run
```

## Best Practices

- **Queries over selectors**: Use `getByRole`, `getByText`, etc. instead of CSS selectors
- **User-centric testing**: Test what users see and interact with
- **Mock external dependencies**: Keep tests fast and reliable
- **Descriptive test names**: Make test failures easy to understand
- **Arrange-Act-Assert**: Structure tests clearly