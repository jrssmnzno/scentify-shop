UI/UX Modernization & System Logic Prompt
Task: Redesign and re-engineer the "Scentify" fragrance e-commerce platform. Use the structured grid and filtering logic from the reference image (Ulta style) to modernize the current Scentify UI.

1. Role-Based Architecture
Client View (User):

Landing/Shop: A clean, light-themed interface focusing on product discovery.

Features: Product filtering (by scent profile: "Warm," "Fresh," etc.), a persistent floating cart icon, and a "Favorites" heart toggle on each product card.

Admin Dashboard (Restricted):

Theme: Maintain a professional dark-themed dashboard but with high-contrast accent colors (e.g., Electric Blue or Emerald Green).

Management: Separate tabs for Inventory (Products), Delivery Logistics, and Order Fulfillment.

Analytics: Include metric cards for "Total Sales," "Active Orders," and "Low Stock Alerts."

2. Modern UI & Interaction (Animations/Hovers)
Product Cards: * Hover Effect: On hover, the product image should subtly scale up (1.05x), and the "Add to Cart" button should transition from a ghost button to a solid blue fill with a soft drop shadow.

Loading: Implement "Shimmer" skeleton loaders while product images are fetching.

Global Navigation: * Active States: Navigation links (Shop, Cart, Admin) should have a bottom-border slide-in animation when hovered or active.

Toasts: When a user clicks "Add to Cart," replace the bottom static bar with a floating, semi-transparent toast notification that disappears after 3 seconds.

3. Enhanced Product Detail Modal
Redesign the current "Alpha Scent" modal into a modern "Quick View" overlay:

Split Layout: * Left Side: A high-resolution image gallery with a zoom-on-hover feature.

Right Side: Product name (Bold Header), Price (Large, accent color), a "Scent Notes" list, and a detailed description.

Quantity Selector: Replace the current circles with a sleek, unified counter: [-] 1 [+].

CTA: A full-width "Add to Bag" button that features a loading spinner icon upon clicking.

4. System Logic & Layout Improvements
Header Logic: Implement the filtering "pills" from the reference basis. Clicking a pill (e.g., "Fresh") should trigger a real-time filtered re-render of the product grid without a page refresh.

Cart/Checkout Flow: * Validation: In the "Delivery Details" section, add real-time field validation (e.g., "Contact Number must be 11 digits").

Delivery Integration: The "Find Delivery Services" button should trigger a slide-out drawer showing available couriers and estimated prices based on the address entered.

Admin Efficiency: In the "Existing Products" list, replace simple icons with "Quick Edit" hover actions. Implement a drag-and-drop zone for uploading new product photos in the "Add New Product" form.

Phase 2: Authentication & Role-Based Access Prompt
Task: Design a high-conversion, minimalist Login Page for "Scentify" that handles role-based redirection.

1. Visual Design (UI)
Layout: A split-screen design.

Left Side: A high-quality, atmospheric video loop or image of fragrance mist/bottles with the "Scentify" logo and the tagline: "Your Favorite Fragrance Is Here."

Right Side: A clean white or dark-grey card (matching the system theme) containing the login form.

Input Fields: Use "Floating Labels" for Email and Password. On focus, the border-bottom should animate to the primary "Scentify Blue."

Interactive Elements: * A "Show/Hide Password" eye icon toggle.

A "Remember Me" checkbox with a custom-styled checkmark.

2. Pre-Configured "Quick-Access" Credentials (UX)
To assist with testing and user onboarding, include a "Demo Credentials" section below the login button:

Design: Two small, clickable "pill" buttons or cards that auto-fill the form when clicked.

Admin Access:

Email: admin@scentify.com

Password: admin123

Logic: Upon success, redirect to the Admin Dashboard (/admin) featuring the "Total Products" and "Orders" metrics.

Client Access:

Email: user@scentify.com

Password: user123

Logic: Upon success, redirect to the Shop View (/shop) featuring the product grid and "Add to Cart" functionality.

3. Transition & Security Logic
Auth Guard: Implement a logic-check where the Admin Dashboard is inaccessible if a user is logged in with Client credentials (returning a 403 error or redirecting back to the shop).

Animations: * Entrance: The login card should use a "Fade-in Up" animation on page load.

Error State: If incorrect credentials are entered, the input fields should perform a subtle horizontal "shake" animation with red highlights.

Success State: Upon clicking "Login," the button should transform into a loading spinner before the page slides away to the respective dashboard.