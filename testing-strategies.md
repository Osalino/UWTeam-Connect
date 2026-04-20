# COM5409 — Web Design and Programming
## Exercise Sheet: Testing Strategies

## Introduction
Up to this point, every time you have checked if your code works, you have done it manually by starting the server, opening the browser or Postman, clicking through the UI, and looking at the results.

Manual testing has two serious problems:
1. It is slow. Every manual check takes 30–60 seconds. Multiply that by dozens of checks across dozens of routes and components, and you lose hours.
2. It is unreliable. You may forget to re-test something after a change, and a bug will slip through.

Automated testing solves both problems:
- You write the check once
- A test runner executes it in milliseconds
- If something breaks, you know immediately

---

## 1. The Testing Pyramid

The testing pyramid is a model that describes how many tests you should have at each level.

| Layer | What it tests | Speed | Confidence | Tools |
|------|--------------|------|-----------|------|
| Unit | Individual functions in isolation | Very fast | Low–Medium | Jest |
| Component | Single React component | Fast | Medium | React Testing Library |
| Integration | API + database | Medium | Medium–High | Jest + Supertest |
| E2E | Full app (user perspective) | Slow | High | Playwright |

### Key Idea
- Many unit tests
- Some component and integration tests
- Few E2E tests

---

## 2. Setting Up Jest (Backend)

### Install dependencies
```bash
npm install --save-dev jest ts-jest @types/jest
```

### Create jest.config.ts
```ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
};
```

### Add scripts to package.json
```json
"scripts": {
  "dev": "tsx watch src/index.ts",
  "test": "jest",
  "test:watch": "jest --watch"
}
```

---

## 3. Unit Testing (Zod Validation)

Unit tests focus on small pieces of logic.

Example:
```ts
import { createBookSchema } from './validateBook';

describe('createBookSchema', () => {
  it('accepts valid input', () => {
    const result = createBookSchema.safeParse({
      title: 'Test',
      authorname: 'Author'
    });

    expect(result.success).toBe(true);
  });

  it('rejects missing title', () => {
    const result = createBookSchema.safeParse({
      authorname: 'Author'
    });

    expect(result.success).toBe(false);
  });
});
```

---

## 4. Test-Driven Development (TDD)

Cycle:
1. Red → write test (fails)
2. Green → write code (passes)
3. Refactor → improve code

Example rule:
- Author name should not contain numbers

---

## 5. Component Testing (React)

### Install
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest ts-jest @types/jest jest-environment-jsdom
```

### jest.config.ts
```ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.tsx'],
};
```

### Example Test
```tsx
import { render, screen } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  it('renders title', () => {
    render(<Component />);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });
});
```

---

## 6. Integration Testing (API)

### Install
```bash
npm install --save-dev supertest @types/supertest
```

### Example
```ts
import request from 'supertest';
import app from '../app';

describe('GET /api/books', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/api/books');
    expect(res.status).toBe(200);
  });
});
```

---

## 7. End-to-End Testing (Playwright)

### Install
```bash
npm init playwright@latest
```

### Example
```ts
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await expect(
    page.getByRole('heading', { name: /app/i })
  ).toBeVisible();
});
```

---

## 8. Common Pitfalls

- Wrong selectors
- Duplicate data
- Not waiting for page load
- Backend/frontend not running

Fixes:
- Use precise selectors
- Use unique values (Date.now())
- Wait for network idle

---

## 9. Summary

- Unit → logic
- Component → UI
- Integration → API
- E2E → full app

Use the testing pyramid for best results.
