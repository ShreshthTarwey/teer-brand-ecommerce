# Frontend Viva Guide: React Concepts & Routing

This guide serves as your cheat sheet for the presentation. It explains "How it works" and "Which React Hooks are used".

## 1. `Home.jsx` (Landing Page)

### A. Fetching Products from Database
*   **Hook Used:** `useEffect` + `useState`.
*   **Mechanism:** "I use the `useEffect` hook to trigger an API call (`axios.get`) as soon as the page loads. The fetched data is stored in `useState`, which automatically updates the UI to display the products."

### B. Image Slider (Carousel)
*   **Hook Used:** `useEffect` + `useState`.
*   **Mechanism:** "A timer inside `useEffect` runs every 3 seconds to increment the `slides` index stored in `useState`. React detects this state change and re-renders the component to show the next image."

---

## 2. `CountUp.jsx` (Animated Stats)

### A. The Number Animation
*   **Hook Used:** `useRef` + `useEffect`.
*   **Mechanism:** "I use `useRef` to get direct access to the text element. When the user scrolls to the section, `useEffect` triggers a lightweight animation function that rapidly counts up the numbers from 0 to the target value."

---

## 3. Dynamic Routing (Product Details)

**The Question:** "How does clicking a product open its specific page?"

### A. The Setup (`App.jsx`)
*   **Code:** `<Route path="/product/:id" element={<ProductDetails />} />`
*   **Explanation:** "In `App.jsx`, I defined a **Dynamic Route** using a colon `:id`. This tells React that this part of the URL is a variable, not a fixed page name."

### B. The Link (`Home.jsx` / `OnlineStore.jsx`)
*   **Code:** `<Link to={/product/${product._id}}>`
*   **Explanation:** "When a user clicks a product, I don't send them to a hardcoded page. I send them to a dynamic URL like `/product/12345` using the product's unique database ID."

### C. The Receiver (`ProductDetails.jsx`)
*   **Hook Used:** `useParams()` from `react-router-dom`.
*   **Mechanism:**
    1.  **Capture:** "Inside the details page, I use the `useParams()` hook to grab the ID (`12345`) directly from the URL browser bar."
    2.  **Fetch:** "I then pass this captured ID to my API call (`axios.get('/api/products/find/' + id)`) to fetch the details for *that specific product only*."

---

## 4. `ProductGallery.jsx` (Showcase Page)

### A. Hero Animation (Falling Spices)
*   **Library:** `framer-motion` (in `ProductsHero.jsx`).
*   **Mechanism:** "I used the `animate` property to move images from `y: 0` (top) to `y: 800` (bottom) infinitely. I added a **random negative delay** to each item so they appear scattered instantly, rather than falling all at once."

### B. Infinite Scroller (Moving Banner)
*   **Technique:** CSS Animations (No complex hooks).
*   **Mechanism:** "It’s a visual trick. I have **two identical lists** of images side-by-side. I use a CSS `keyframes` animation to slide them to the left. As soon as the first list finishes, the second one instantly takes its place, creating a seamless 'infinite' loop."

### C. Zoom Modal (Click to Enlarge)
*   **Hook Used:** `useState` (`modalImage`).
*   **Mechanism:** "I have a simple state variable called `modalImage`. When you click an image, I set this variable to that image's URL. React then sees this is not `null` and renders the overlay. Clicking 'Close' sets it back to `null`, hiding the overlay."

---

## 5. `ContactUs.jsx` (Contact Page)

### A. Banner & Red Line Animation
*   **Library:** `framer-motion`.
*   **Mechanism:**
    *   **Text:** "I used `initial={{ opacity: 0 }}` and `animate={{ opacity: 1 }}` to make it fade in."
    *   **Red Line:** "The spreading line is just a `<div>` whose `width` I animate from `0` to `100px` using Framer Motion's `animate` prop."
    *   **Particles:** "The floating dots uses `animate={{ y: [0, -30, 0] }}` to loop up and down infinitely."

### B. Mouse-Reactive Background (Parallax Effect)
*   **Hook Used:** `useEffect` (adds Event Listener).
*   **Mechanism:** "I attached a `mousemove` event listener to the section. When the mouse moves, I calculate its distance from the center (X and Y offsets). I then apply a CSS transform (`translate`) to the background layers in the opposite direction, creating a 3D depth effect."

### C. Map Integration
*   **Technique:** Iframe Embedding.
*   **Mechanism:** "The map is simply an HTML `<iframe>` provided by Google Maps. I pasted the embed code inside my JSX and set the `width` to 100% so it fits the container perfectly."

---

## 6. `OnlineStore.jsx` & Cart Logic (Store Page)

### A. Banner Animation (Rising Aromas)
*   **Library:** `framer-motion` (in `AromaAnimation.jsx`).
*   **Mechanism:** "This is the opposite of the falling spices. I animate the Y-position from `0` to `-450px` (upwards). I also add a `sway` animation on the X-axis to make them drift naturally like smoke or aroma."

### B. Search Functionality
*   **Technique:** Client-Side Filtering.
*   **Mechanism:** "I don't call the database every time you type. I fetch all products *once* when the page loads. Then, the search bar simply filters this list in real-time (`products.filter()`) to match the name you type."

### C. "Add to Cart" Logic (`CartContext.jsx`)
*   **Concept:** **Hybrid State Management**.
*   **Scenario 1 (Logged In):** "If the user is logged in, I send an `axios.post` request to save the item directly to their **MongoDB database** document so their cart is saved across devices."
*   **Scenario 2 (Guest):** "If not logged in, I save the cart locally in the browser's **localStorage**. This way, they don't lose their items even if they refresh the page."

### D. Submitting Reviews (`ProductDetails.jsx`)
*   **Method:** REST API Call (`POST`).
*   **Mechanism:**
    1.  **Input:** User selects stars and types a comment.
    2.  **Verification:** I check if `user` exists in localStorage (must be logged in).
    3.  **Transmission:** I call `axios.post` to my backend endpoint (`/api/products/:id/reviews`). importantly, I attach the **User's Token** in the header so the backend knows exactly *who* is posting the review.

---

## 7. Admin Dashboard (`Dashboard.jsx` & `Products.jsx`)

### A. Rendering Charts
*   **Library:** `recharts` (Standard React Charting library).
*   **Mechanism:** "The frontend receives raw data (like 'Total Sales') from the backend API. I pass this data into the `<LineChart>` and `<BarChart>` components provided by the `recharts` library, effectively visualizing the JSON numbers as graphs."

### B. "Download Report" Feature
*   **Technique:** Client-Side CSV Generation.
*   **Mechanism:** "I don't need a backend to generate the CSV. I manually build a comma-separated string from the stats data in JavaScript. Then, I create a hidden `<a>` link with the content as a `data:text/csv` URI and programmatically 'click' it to trigger the browser download."

### C. Instant Stock Update (Optimistic UI)
*   **File:** `Products.jsx`
*   **Scenario:** Changing stock number in the input box.
*   **Mechanism:**
    1.  **Optimistic Update:** "As soon as you type, I update the React state (`setProducts`) instantly so the UI reflects the new number immediately without lag."
    2.  **Persist on Blur:** "When you click away (`onBlur`), I look at the final number and send an `axios.put` request to update the database silently in the background."
