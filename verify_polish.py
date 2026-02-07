from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 800})
    page = context.new_page()

    print("Navigating to http://localhost:3000")
    try:
        page.goto("http://localhost:3000", timeout=60000)
    except Exception as e:
        print(f"Failed to load page: {e}")
        browser.close()
        return

    # Wait for the header to be visible
    print("Waiting for header...")
    try:
        page.wait_for_selector("header", timeout=30000)
    except Exception as e:
        print(f"Header not found: {e}")
        page.screenshot(path="/home/jules/verification/failed_load.png")
        browser.close()
        return

    # Wait a bit for animations to finish
    time.sleep(3)

    # Hover over a category to see the effect
    print("Hovering over category...")
    try:
        page.hover("button:has-text('Natural Site')")
        time.sleep(1)
    except Exception as e:
        print(f"Could not hover: {e}")

    # Take a screenshot
    print("Taking screenshot...")
    page.screenshot(path="/home/jules/verification/polished_ui.png", full_page=True)

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
