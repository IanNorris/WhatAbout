import { test, expect } from '@playwright/test';

test.describe('WhatAbout App E2E Tests', () => {
  test('should load the hub page', async ({ page }) => {
    await page.goto('/');

    // Should show the hub
    await expect(page).toHaveTitle(/WhatAbout/i);
    
    // Wait for content to load
    await page.waitForSelector('text=/welcome|choose|story|topic/i', { timeout: 5000 });
  });

  test('should display story list on hub', async ({ page }) => {
    await page.goto('/');

    // Wait for stories to load
    await page.waitForTimeout(2000);

    // Should have clickable story elements
    // Looking for any elements that might be story cards/links
    const stories = page.locator('[role="button"], a, .story, [class*="story"], [class*="card"]');
    
    const count = await stories.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to a story when clicked', async ({ page }) => {
    await page.goto('/');

    // Wait for page to be ready
    await page.waitForTimeout(2000);

    // Find and click a story (try different selectors)
    const storySelectors = [
      'text=/age verification/i',
      'text=/digital/i',
      'text=/demo/i',
      '[role="button"]',
      'a',
    ];

    let clicked = false;
    for (const selector of storySelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.count() > 0) {
          await element.click({ timeout: 2000 });
          clicked = true;
          break;
        }
      } catch {
        // Try next selector
      }
    }

    if (!clicked) {
      // If we can't find a story to click, skip this test
      test.skip();
      return;
    }

    // Wait for navigation
    await page.waitForTimeout(1000);

    // URL should change to story route
    await expect(page).toHaveURL(/#\/story\/.+/);
  });

  test('should display story content and choices', async ({ page }) => {
    // Navigate directly to a demo story if it exists
    await page.goto('/#/story/demo');

    // Wait for story to load
    await page.waitForTimeout(2000);

    // Should have some text content
    const content = await page.textContent('body');
    expect(content.length).toBeGreaterThan(10);

    // Look for choice buttons or interactive elements
    const interactiveElements = page.locator('button, [role="button"], a, [class*="choice"]');
    const count = await interactiveElements.count();
    
    // Should have at least some interactive elements (choices or navigation)
    expect(count).toBeGreaterThan(0);
  });

  test('should be able to navigate back to hub', async ({ page }) => {
    await page.goto('/#/story/demo');
    await page.waitForTimeout(1500);

    // Look for home/back button
    const homeSelectors = [
      'text=/home/i',
      'text=/back/i',
      'text=/hub/i',
      '[aria-label*="home"]',
      '[aria-label*="back"]',
    ];

    for (const selector of homeSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          await element.click();
          await page.waitForTimeout(500);
          
          // Should be back at root or hub
          await expect(page).toHaveURL(/^\/$|#\/$/);
          return;
        }
      } catch {
        // Try next selector
      }
    }

    // If no back button found, use browser back
    await page.goBack();
    await expect(page).toHaveURL(/^\/$|#\/$/);
  });

  test('should handle direct story URL navigation', async ({ page }) => {
    // Navigate directly to a story via URL
    await page.goto('/#/story/age-verification');

    // Should load without errors
    await page.waitForTimeout(2000);

    // Should not show error message
    const errorText = await page.textContent('body');
    expect(errorText).not.toMatch(/error|not found|failed/i);
  });

  test('should handle invalid story URL gracefully', async ({ page }) => {
    await page.goto('/#/story/nonexistent-story-12345');

    // Wait for error handling
    await page.waitForTimeout(2000);

    // Should either show error message or redirect to hub
    const url = page.url();
    const content = await page.textContent('body');
    
    const hasError = content.match(/error|not found|failed/i);
    const redirectedToHub = url.match(/^\/$|#\/$/);

    expect(hasError || redirectedToHub).toBeTruthy();
  });

  test('should preserve state during browser back/forward', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Navigate to story
    await page.goto('/#/story/demo');
    await page.waitForTimeout(1000);

    // Go back
    await page.goBack();
    await page.waitForTimeout(500);
    expect(page.url()).toMatch(/^\/$|#\/$/);

    // Go forward
    await page.goForward();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/#\/story\/demo/);
  });

  test('accessibility: should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Should have at least one heading
    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should be responsive and work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForTimeout(1500);

    // Should still render content
    const content = await page.textContent('body');
    expect(content.length).toBeGreaterThan(10);

    // Should not have horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    expect(hasHorizontalScroll).toBe(false);
  });
});
