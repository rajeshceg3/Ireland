from playwright.sync_api import sync_playwright
import time
import os

def run():
    # Ensure directory exists
    os.makedirs("/home/jules/verification", exist_ok=True)

    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to app...")
        try:
            page.goto("http://localhost:3000", timeout=60000)
        except Exception as e:
            print(f"Navigation failed: {e}")
            browser.close()
            return

        print("Waiting for app to load...")
        # Wait for loading to finish (the spinner I added)
        try:
            # First expect loading text
            # page.wait_for_selector("text=Loading attractions...", timeout=5000)
            # Then expect it to go away
            page.wait_for_selector("text=Loading attractions...", state="detached", timeout=20000)
        except Exception as e:
            print(f"Loading state timeout: {e}")
            # Continue anyway to see what's there

        print("Taking main screenshot...")
        page.screenshot(path="/home/jules/verification/verification_main.png")

        # Test 1: Check for aria-labels in header
        try:
            page.get_by_label("Search attractions").click()
            print("Found search input by label")

            # Use a regex for the theme toggle as it changes based on state, but default is light -> switch to dark
            # Or just check for partial match if supported, or exact string "Switch to dark mode"
            expect_dark = page.get_by_label("Switch to dark mode")
            if expect_dark.is_visible():
                print("Found theme toggle (Switch to dark mode)")
            else:
                print("Could not find theme toggle with 'Switch to dark mode'")

        except Exception as e:
            print(f"Accessibility check failed: {e}")

        # Test 2: Search for non-existent attraction to trigger "No attractions found"
        print("Testing empty state...")
        try:
            page.get_by_label("Search attractions").fill("NonExistentAttractionXYZ")

            # Wait for the "No attractions found" message
            page.wait_for_selector("text=No attractions found", timeout=5000)

            print("Found 'No attractions found' message")

            # Take a screenshot of the empty state overlay
            page.screenshot(path="/home/jules/verification/verification_empty_state.png")
        except Exception as e:
            print(f"Empty state check failed: {e}")
            page.screenshot(path="/home/jules/verification/verification_failed.png")

        browser.close()

if __name__ == "__main__":
    run()
