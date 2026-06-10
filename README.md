# FrontendAutomation

UI, API, and load testing suite for the AcmeAI legal document search application.

## Tech Stack

| Layer | Tool |
|---|---|
| **UI Automation** | Playwright + TypeScript |
| **API Testing** | Postman Collection |
| **Load Testing** | K6 |
| **CI/CD** | GitHub Actions |

## Project Structure

```
FrontendAutomation/
├── pages/
│   └── Mainpage.ts                       # Page Object Model
├── tests/
│   └── mainPageTest.spec.ts              # UI test suite (10 tests)
├── API test with Postman/
│   └── AcmeAI.postman_collection.json    # API tests (7 requests)
├── Load Test/
│   └── loadTest.js                       # K6 load test script
├── playwright.config.ts                  # Playwright configuration
├── package.json
└── .github/workflows/playwright.yml      # CI pipeline
```

## Setup

```bash
npm install
npx playwright install
```

## Running Tests

### UI Tests (Playwright)

```bash
npx playwright test          # headless
npx playwright test --ui     # interactive UI mode
npx playwright test --headed # visible browser
```

### API Tests (Postman)

Import `API test with Postman/AcmeAI.postman_collection.json` into Postman and run against `http://localhost:8000`.

To generate an HTML report locally:
```bash
npm install -g newman-reporter-htmlextra
newman run "API test with Postman/AcmeAI.postman_collection.json" -r htmlextra --reporter-htmlextra-export "newman-report/report.html"
```

![Newman Report Preview](newman-report/report-preview.png)

### Load Test (K6)

```bash
k6 run "Load Test/loadTest.js"
```

### CI

GitHub Actions runs UI tests (with HTML report artifact) and validates the K6 load script via `--dry-run` on push/PR to `main`/`master`.

## Test Coverage

### UI Tests — 10 test cases

| Scenario | Input | Assertion |
|---|---|---|
| Correct page title | — | Title equals `Vite + React + TS` |
| Empty search | `"  "` | Shows "No documents found matching" |
| Non-existing doc (special chars) | `"@#$"` | Shows "No documents found matching" |
| Non-existing doc (text) | `"No Document"` | Shows "No documents found matching" |
| Existing document | `"Contract"` | Returns 1+ results |
| Leading/trailing spaces | `"  law  "` | Returns 1+ results, result rendered |
| Mixed case | `"CoNTracT"` | Returns 1+ results |
| Partial name | `"ney"` | Returns 1+ results |
| SQL injection | `"admin' --"` | Shows "No documents found matching" |
| Button disabled state | empty → `"case"` | Button disabled when empty, enabled after input |

### API Tests (Postman) — 7 requests

| Endpoint | Method | Validates |
|---|---|---|
| `/generate` (empty body) | POST | 400 status |
| `/generate` (special chars) | POST | 200 + no-result summary |
| `/generate` (GET all) | GET | 200 + valid JSON |
| `/generate` (partial name) | POST | 200 + matched docs |
| `/generate` (by title) | POST | 200 + success/message/data structure |
| `/generate` (by content) | POST | 200 + valid doc schema (id, title, content) |
| `/generate` (substring) | POST | 200 + valid response |
| `/generate` (SQL injection) | POST | 200 + safe response |

### Load Test (K6) — 4-stage ramp

| Stage | Duration | Target Users |
|---|---|---|
| Ramp-up | 30s | 0 → 50 |
| Ramp-up | 1m | 50 → 100 |
| Sustain | 2m | 100 |
| Ramp-down | 30s | 100 → 0 |

**Thresholds:**
- Error rate < 2%
- p(95) response time < 1500ms

Requests are randomly chosen from 12 legal search terms posted to `/generate`.

---

**Author:** Kizar Akib Ayon  
**Framework:** Playwright ^1.60.0 + TypeScript
