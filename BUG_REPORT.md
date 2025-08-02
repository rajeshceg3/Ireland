# Bug Report: Ireland Tourist Map Application

## Overview

This report details the findings from a comprehensive static analysis of the Ireland Tourist Map application. The assessment focused on identifying bugs, vulnerabilities, and areas for improvement in performance, accessibility, user experience, and code quality.

Due to environmental constraints, it was not possible to run the application or its test suite. Therefore, this analysis is based entirely on a manual review of the source code.

## High Severity Issues

### 1. Map does not update when filters change (UX/Bug)

*   **Component:** `Map.tsx`
*   **Description:** The map view (`center` and `zoom`) does not change when the user applies category or search filters. If a user filters down to a specific attraction, the map does not pan to that location, forcing the user to manually find it. This significantly reduces the utility of the filtering feature.
*   **Impact:** Critical user experience issue.
*   **Recommendation:**
    1.  Create a new component that is a child of `<MapContainer>`.
    2.  Use the `useMap` hook from `react-leaflet` in this new component to get access to the map instance.
    3.  Pass the `attractionsToDisplay` array to this component.
    4.  Use a `useEffect` hook to listen for changes to `attractionsToDisplay`.
    5.  When the attractions change, use `map.fitBounds()` to adjust the map's view to fit the new set of markers.

### 2. Popup content is not focusable after being opened by keyboard (Accessibility)

*   **Component:** `AttractionMarker.tsx`
*   **Description:** A user can open a marker's popup using the keyboard, but focus is not moved into the popup. The user has to tab through all other markers on the map to reach the content of the popup they just opened.
*   **Impact:** Critical accessibility issue for keyboard-only users.
*   **Recommendation:** When a popup is opened, programmatically move focus to the first focusable element within the popup (the "View More" button). This may require a ref on the button and a way to detect when the popup is opened.

### 3. `useEffect` dependency array violation in `AttractionDetailCard` (Bug/Code Quality)

*   **Component:** `AttractionDetailCard.tsx`
*   **Description:** The `useEffect` that manages the `keydown` event listener for focus trapping and the Escape key has a dependency array that is missing a key function (`handleClose`) that is defined in the component scope. This is a violation of the rules of hooks and can lead to stale closures and bugs. The `handleClose` function is also redefined on every render, causing the effect to be re-run unnecessarily.
*   **Impact:** Potential for bugs, and a clear violation of React best practices.
*   **Recommendation:**
    1.  Wrap the `handleClose` function in `useCallback`.
    2.  Add the memoized `handleClose` function to the `useEffect` dependency array.

## Medium Severity Issues

### 4. Filtering logic is re-calculated on every render (Performance)

*   **Component:** `Map.tsx`
*   **Description:** The list of attractions to display is filtered on every render of the `MapComponent`. While fast for the current dataset size, this is inefficient and could become a performance issue with more data or more complex logic.
*   **Impact:** Potential performance degradation.
*   **Recommendation:** Memoize the result of the filtering logic using the `useMemo` hook. The calculation should only re-run when `attractions`, `activeCategoryFilter`, or `searchTerm` change.

### 5. Hardcoded string truncation cuts words in half (UX/Bug)

*   **Component:** `AttractionMarker.tsx`
*   **Description:** The attraction description in the popup is truncated with `substring(0, 60)`, which does not respect word boundaries and can result in cut-off words.
*   **Impact:** Unprofessional appearance and poor user experience.
*   **Recommendation:** Extract the `truncateAtWordBoundary` function from `App.tsx` into a shared `utils.ts` file and use it in `AttractionMarker.tsx`.

### 6. Missing `aria-pressed` on selected category filter (Accessibility)

*   **Component:** `CategoryFilter.tsx`
*   **Description:** The currently selected category button is visually highlighted, but this state is not conveyed to screen reader users.
*   **Impact:** Medium accessibility issue.
*   **Recommendation:** Add the `aria-pressed={selectedCategory === category}` attribute to the category filter buttons.

### 7. Redundant `aria-label` on "Close" button (Accessibility/Bug)

*   **Component:** `AttractionDetailCard.tsx`
*   **Description:** The main "Close" button at the bottom of the modal has both visible text and an `aria-label`. The `aria-label` overrides the visible text and is redundant.
*   **Impact:** Minor accessibility issue, but shows a misunderstanding of how `aria-label` should be used.
*   **Recommendation:** Remove the `aria-label` from the bottom "Close" button.

## Low Severity Issues

### 8. Direct DOM manipulation in `onError` handler (Code Quality)

*   **Component:** `AttractionDetailCard.tsx` (for thumbnails)
*   **Description:** The `onError` handler for thumbnail images directly manipulates the DOM to hide the broken image. In React, it is better to use state to control rendering.
*   **Impact:** Minor code quality issue.
*   **Recommendation:** This is acceptable for now, but a more "React-way" solution would involve managing the error state for each thumbnail.

### 9. Global modification of Leaflet icon prototype (Code Quality)

*   **Component:** `Map.tsx`
*   **Description:** The code modifies `L.Icon.Default.prototype` at the top level of the module. This global modification is a side effect.
*   **Impact:** Minor code quality issue.
*   **Recommendation:** Move this icon fix into a dedicated setup file (e.g., `leaflet-setup.ts`) to make the modification more explicit and contained.

### 10. Test environment is not functional

*   **Component:** N/A (Project setup)
*   **Description:** The test runner (`npm test`) hangs indefinitely, even with a valid test file present. This prevents any automated testing from being performed.
*   **Impact:** Critical issue for development and maintenance, but treated as a lower severity issue for this report as the focus is on the application code itself.
*   **Recommendation:** The Jest and `react-scripts` configuration needs to be investigated and fixed. This is likely an environment-specific issue.
