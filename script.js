document.addEventListener("DOMContentLoaded", () => {
    // 1. SECURITY: Check access immediately before anything else runs
    checkAdminAccess();

    // 2. INITIALIZE UI COMPONENTS
    initPasswordValidation();
    initEntranceAnimations();
    initSmoothScroll();
    initAdminLogic();
    initUserSearch();
    fetchStandings();
});

// --- 1. ACCESS CONTROL & AUTHENTICATION ---

/**
 * Prevents unauthorized users from staying on admin.html
 */
function checkAdminAccess() {
    // Get current filename (e.g., 'admin.html')
    const path = window.location.pathname;
    const page = path.split("/").pop();
    const userRole = localStorage.getItem("userRole");

    // Logic: If on admin page and NOT an admin, boot them to login
    if (page === "admin.html") {
        if (userRole !== "admin") {
            alert("Restricted Area: Admin login required.");
            window.location.href = "login.html"; // Ensure this matches your login file name
        }
    }
}

/**
 * Handles the login process and sets the role in storage
 * This should be called by your Login Form's submit event
 */
window.handleLogin = function(email, password) {
    // Clear any previous session data for safety
    localStorage.removeItem("userRole");

    if (email === "admin@williams.com" && password === "racing2026") {
        localStorage.setItem("userRole", "admin");
        window.location.href = "admin.html";
    } else {
        localStorage.setItem("userRole", "fan");
        window.location.href = "index.html";
    }
};

/**
 * Logs the user out by clearing storage
 */
window.handleLogout = function() {
    localStorage.removeItem("userRole");
    window.location.href = "login.html";
};

// --- 2. ENTRANCE & UI ANIMATIONS ---

function initEntranceAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const appearanceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }, index * 100);
                appearanceObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target elements for the fade-in effect
    document.querySelectorAll(".driver-card, .stat-box, .section-title, .fact-card, .admin-table tr")
        .forEach((el) => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
            appearanceObserver.observe(el);
        });
}

// --- 3. NAVIGATION & INTERFACE UTILITIES ---

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) target.scrollIntoView({ behavior: "smooth" });
        });
    });
}

window.toggleVisibility = function (id) {
    const input = document.getElementById(id);
    if (!input) return;
    const icon = input.nextElementSibling;
    input.type = input.type === "password" ? "text" : "password";
    if (icon) icon.textContent = input.type === "password" ? "👁️" : "🙈";
};

window.expandProfile = function(button) {
    const card = button.closest(".driver-card");
    if (!card) return;
    card.classList.toggle("expanded");
    button.textContent = card.classList.contains("expanded") ? "Close Profile" : "View Profile";
    button.style.background = card.classList.contains("expanded") 
        ? "linear-gradient(135deg, #cc0000 0%, #990000 100%)" 
        : "linear-gradient(135deg, #0066cc 0%, #0099ff 100%)";
};

// --- 4. ADMIN PANEL DATA MANAGEMENT ---

function initAdminLogic() {
    const addForm = document.getElementById("addDataForm");
    const tableBody = document.getElementById("userTableBody");

    if (addForm && tableBody) {
        addForm.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById("newName").value;
            const email = document.getElementById("newEmail").value;
            const role = document.getElementById("newRole").value;
            const id = tableBody.rows.length + 1;

            const newRow = `<tr>
                <td>${id}</td>
                <td>${name}</td>
                <td>${email}</td>
                <td>${role}</td>
                <td><button class="delete-btn" onclick="deleteRow(this)">Delete</button></td>
            </tr>`;
            tableBody.insertAdjacentHTML('beforeend', newRow);
            addForm.reset();
        };
    }
}

function initUserSearch() {
    const searchInput = document.getElementById('userSearch');
    if (!searchInput) return;

    searchInput.addEventListener('keyup', () => {
        const filter = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll('#userTableBody tr');
        rows.forEach(row => {
            const text = row.innerText.toLowerCase();
            row.style.display = text.includes(filter) ? "" : "none";
        });
    });
}

window.deleteRow = function(btn) {
    if (confirm("Remove this entry from the grid?")) {
        const row = btn.closest("tr");
        row.style.opacity = "0";
        row.style.transform = "translateX(50px)";
        setTimeout(() => row.remove(), 400);
    }
};

// --- 5. REGISTRATION VALIDATION ---

function initPasswordValidation() {
    const form = document.getElementById("registrationForm");
    const passInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirm_password");
    
    if (!form || !passInput || !confirmInput) return;

    const lengthNote = document.getElementById("length-note");
    const matchNote = document.getElementById("match-note");

    const validate = () => {
        const isLong = passInput.value.length >= 8;
        const isMatch = passInput.value === confirmInput.value && passInput.value !== "";
        
        if (lengthNote) lengthNote.style.color = isLong ? "#0ce71e" : "#ff4d4d";
        if (matchNote) matchNote.style.color = isMatch ? "#0ce71e" : "#ff4d4d";
        
        return isLong && isMatch;
    };

    passInput.addEventListener("input", validate);
    confirmInput.addEventListener("input", validate);
    
    form.onsubmit = (e) => { 
        if (!validate()) {
            e.preventDefault();
            alert("Please ensure passwords meet requirements.");
        }
    };
}

/**
 * Security Gatekeeper: Checks if the user is authorized for the admin page
 */
function checkAdminAccess() {
    const page = window.location.pathname.split("/").pop();
    const userRole = localStorage.getItem("userRole");

    if (page === "admin.html" && userRole !== "admin") {
        window.location.href = "login.html";
    }
}

/**
 * Logout Function: Clears the session and sends user to login
 */
window.handleLogout = function() {
    localStorage.removeItem("userRole");
    window.location.href = "login.html";
};

function toggleVisibility(id) {
    const input = document.getElementById(id);
    const icon = event.target;
    if (input.type === "password") {
        input.type = "text";
        icon.textContent = "🙈"; // Change icon when visible
    } else {
        input.type = "password";
        icon.textContent = "👁️";
    }
}

function handleLogin(email, password) {
    // 1. Clean the input (removes accidental spaces)
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    console.log("Attempting login with:", cleanEmail); // Debugging

    // 2. The Admin Check
    if (cleanEmail === "admin@williams.com" && cleanPass === "pitwall2026") {
        console.log("Admin Match Found!");
        localStorage.setItem("userRole", "admin");
        window.location.href = "admin.html";
        return; // Stop here so it doesn't run the code below
    } 

    // 3. The Fan Check (The "Else")
    console.log("Standard Fan Login");
    localStorage.setItem("userRole", "fan");
    window.location.href = "index.html";
}

// --- UNIFIED LOGIN & DOMAIN VALIDATION LOGIC ---
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById("loginEmail");
const emailError = document.getElementById("loginError");

// Strict pattern for allowed domains
const domainRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|williams\.com)$/i;

if (loginForm) {
    loginForm.reset();
    // 1. Real-time visual feedback as the user types
    emailInput.addEventListener("input", () => {
        const value = emailInput.value.trim();
        if (value === "") {
            emailInput.classList.remove("error-border", "success-border");
            if(emailError) emailError.style.display = "none";
        } else if (domainRegex.test(value)) {
            emailInput.classList.add("success-border");
            emailInput.classList.remove("error-border");
            if(emailError) emailError.style.display = "none";
        } else {
            emailInput.classList.add("error-border");
            emailInput.classList.remove("success-border");
            if(emailError) emailError.style.display = "block";
        }
    });

    // 2. Single Submit Handler
    loginForm.addEventListener('submit', function(event) {
        const emailValue = emailInput.value.trim().toLowerCase();
        const passValue = document.getElementById('loginPass').value.trim();

        // STEP A: Validate Domain First
        if (!domainRegex.test(emailValue)) {
            event.preventDefault(); // Stop the redirect
            alert("Invalid Domain! Only Williams, Gmail, and Yahoo accounts are permitted.");
            
            // Reset fields
            emailInput.value = "";
            document.getElementById('loginPass').value = "";
            emailInput.classList.remove("success-border", "error-border");
            if(emailError) emailError.style.display = "none";
            emailInput.focus();
            return; // EXIT - do not run the code below
        }

        // STEP B: If domain is valid, check credentials
        event.preventDefault(); // Prevent default browser submission

        if (emailValue === "admin@williams.com" && passValue === "pitwall2026") {
            localStorage.setItem("userRole", "admin");
            window.location.href = "admin.html";
        } else {
            localStorage.setItem("userRole", "fan");
            window.location.href = "index.html";
        }
    });
}

// --- SIGNUP VALIDATION LOGIC (MATCHING LOGIN STYLE) ---
const registrationForm = document.getElementById('registrationForm');
const signupEmail = document.getElementById('emailInput');
const signupError = document.getElementById('emailError');

if (registrationForm) {
    registrationForm.reset();

    // 1. Real-time visual feedback as the user types
    signupEmail.addEventListener("input", () => {
        const value = signupEmail.value.trim();
        if (value === "") {
            signupEmail.classList.remove("error-border", "success-border");
            if(signupError) signupError.style.display = "none";
        } else if (domainRegex.test(value)) {
            signupEmail.classList.add("success-border");
            signupEmail.classList.remove("error-border");
            if(signupError) signupError.style.display = "none";
        } else {
            signupEmail.classList.add("error-border");
            signupEmail.classList.remove("success-border");
            if(signupError) signupError.style.display = "block";
        }
    });

    // 2. Single Submit Handler (Step A & Step B)
    registrationForm.addEventListener('submit', function(event) {
        const emailValue = signupEmail.value.trim().toLowerCase();
        const passValue = document.getElementById('password').value.trim();
        const confirmPassValue = document.getElementById('confirm_password').value.trim();

        // STEP A: Validate Domain First
        if (!domainRegex.test(emailValue)) {
            event.preventDefault(); // Stop the registration
            alert("Invalid Domain! Only Williams, Gmail, and Yahoo accounts are permitted.");
            
            // Reset fields
            signupEmail.value = "";
            document.getElementById('password').value = "";
            document.getElementById('confirm_password').value = "";
            signupEmail.classList.remove("success-border", "error-border");
            if(signupError) signupError.style.display = "none";
            signupEmail.focus();
            return; // EXIT
        }

        // STEP B: If domain is valid, finalize registration
        event.preventDefault(); // Prevent default browser submission

        // Note: Your inline HTML script handles the password matching check.
        // If those pass, we set the role and enter the track.
        localStorage.setItem("userRole", "fan");
        alert("Welcome to the team! Your Fan account is ready.");
        window.location.href = "index.html";
    });
}

// --- DYNAMIC NAVBAR & LOGOUT LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    const guestLinks = document.getElementById('guest-links');
    const logoutBtn = document.getElementById('logoutBtn');
    const userRole = localStorage.getItem("userRole");

    // 1. Check if user is logged in
    if (userRole) {
        // User is logged in: Hide Login/Signup, Show Logout
        if (guestLinks) guestLinks.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
    }

    // 2. Handle Logout Click
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Clear the session
            localStorage.removeItem("userRole");
            
            // Optional: Confirm with a popup
            alert("Exiting the Paddock. See you next race!");
            
            // Redirect to login
            window.location.href = "login.html";
        });
    }
});

// ==========================================
// --- 6. F1 CALENDAR API INTEGRATION ---
// ==========================================
// We use a global variable to store races so the search bar can filter them
let f1Races = []; 

// This ensures the API logic only runs when the "apiF1calendar.html" page is loaded
document.addEventListener("DOMContentLoaded", () => {
    const fetchBtn = document.getElementById('fetchBtn');
    const searchInput = document.getElementById('circuitSearch');

    if (fetchBtn) {
        fetchBtn.addEventListener('click', fetchF1Calendar);
    }

    if (searchInput) {
        searchInput.addEventListener('keyup', filterF1Circuits);
    }
});

/**
 * Fetches data from the API and handles the response
 */
async function fetchF1Calendar() {
    const grid = document.getElementById('calendarGrid');
    
    // 1. UI: Show loading state
    if (grid) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 20px;">
                <p>📡 Connecting to the Pit Wall... Please wait.</p>
            </div>
        `;
    }

    try {
        // 2. API REQUEST: No Key required, safe for GitHub Pages
        const response = await fetch('https://api.jolpi.ca/ergast/f1/2026.json');

        // 3. ERROR HANDLING: Check if the server responded correctly
        if (!response.ok) {
            throw new Error("The F1 server is currently unavailable.");
        }

        const data = await response.json();
        f1Races = data.MRData.RaceTable.Races;

        // 4. PROCESS & DISPLAY: Send data to the display function
        displayF1Races(f1Races);

    } catch (error) {
        // 5. ERROR HANDLING: Display a friendly error message if the API fails
        if (grid) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; color: #ff4d4d; border: 1px solid #ff4d4d; padding: 15px; border-radius: 8px;">
                    <p>⚠️ <strong>System Error:</strong> ${error.message}</p>
                    <p>Try checking your internet connection or the API status.</p>
                </div>
            `;
        }
        console.error("API Error:", error);
    }
}

/**
 * Dynamically creates HTML cards for each race
 */
/**
 * Updated: Dynamically creates HTML cards for each race with a SAVE button
 */
function displayF1Races(races) {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;

    grid.innerHTML = ""; 

    races.forEach(race => {
        const card = document.createElement('div');
        card.className = 'driver-card'; 
        
        // Prepare the data object to be saved
        const raceData = {
            id: race.round, // Using round as a unique ID
            name: race.raceName,
            circuit: race.Circuit.circuitName,
            location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
            date: race.date
        };

        card.innerHTML = `
            <div class="card-content" style="padding: 15px;">
                <span style="font-size: 12px; font-weight: bold; color: #00A0E2;">ROUND ${race.round}</span>
                <h3 style="margin: 10px 0; color: #fff;">${race.raceName}</h3>
                <p><strong>🏁 Circuit:</strong> ${race.Circuit.circuitName}</p>
                <p><strong>📍 Location:</strong> ${raceData.location}</p>
                <p><strong>📅 Date:</strong> ${new Date(race.date).toDateString()}</p>
                
                <button class="view-btn" style="width: 100%; margin-top: 10px; background: #28a745;" 
                    onclick='saveRace(${JSON.stringify(raceData)})'>
                    ⭐ Save to My Calendar
                </button>

                <a href="${race.url}" target="_blank" class="view-btn" style="display: block; text-align: center; margin-top: 5px; text-decoration: none;">Track Details</a>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

/**
 * Searches through the local f1Races array
 */
function filterF1Circuits() {
    const term = document.getElementById('circuitSearch').value.toLowerCase();
    const filtered = f1Races.filter(race => 
        race.Circuit.Location.country.toLowerCase().includes(term) ||
        race.raceName.toLowerCase().includes(term) ||
        race.Circuit.circuitName.toLowerCase().includes(term)
    );
    displayF1Races(filtered);
}

/**
 * Logic to store race data in localStorage
 */
window.saveRace = function(raceData) {
    // 1. Get existing data from localStorage (parse string to array)
    let savedRaces = JSON.parse(localStorage.getItem("f1SavedRaces")) || [];

    // 2. Prevent Duplicates: Check if the round ID already exists
    const isDuplicate = savedRaces.some(race => race.id === raceData.id);

    if (isDuplicate) {
        alert("🏁 This race is already in your saved list!");
        return;
    }

    // 3. Add new race and save back to localStorage (stringify array to string)
    savedRaces.push(raceData);
    localStorage.setItem("f1SavedRaces", JSON.stringify(savedRaces));

    alert("✅ Race saved to your personal calendar!");
};

/**
 * RELEVANT API INTEGRATION: Fetching Team Standings
 * This supports the "Command Center" purpose by showing real-time rankings.
 */
async function fetchStandings() {
    const container = document.getElementById('standingsList');
    if (!container) return;

    try {
        const response = await fetch('https://api.jolpi.ca/ergast/f1/2026/constructorStandings.json');
        const data = await response.json();
        const standings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

        container.innerHTML = ""; 

        standings.forEach(team => {
            const isWilliams = team.Constructor.constructorId === "williams";
            
            const Row = `
                <div class="stat-box" style="display: flex !important; flex-direction: row !important; align-items: center; justify-content: space-between; padding: 15px 25px; margin-bottom: 8px; border-left: 4px solid ${isWilliams ? '#00a0df' : 'rgba(255,255,255,0.1)'}; background: ${isWilliams ? 'rgba(0, 160, 223, 0.1)' : 'rgba(255,255,255,0.03)'}; border-radius: 8px; min-height: 60px; text-align: left;">
                    <div style="flex: 0 0 50px; font-weight: bold; color: #00a0df; font-size: 1.2em;">P${team.position}</div>
                    <div style="flex: 1; padding-left: 15px;">
                        <span style="font-weight: 600; font-size: 1.1em; color: white;">${team.Constructor.name}</span>
                        ${isWilliams ? '<span style="font-size: 0.6em; background: #00a0df; color: white; padding: 2px 6px; border-radius: 3px; margin-left: 8px; vertical-align: middle;">YOUR TEAM</span>' : ''}
                    </div>
                    <div style="flex: 0 0 100px; text-align: right;">
                        <span style="font-size: 1.3em; font-weight: 800; color: white; display: block; line-height: 1;">${team.points}</span>
                        <span style="font-size: 0.6em; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px;">Points</span>
                    </div>
                </div>`;
            
            container.insertAdjacentHTML('beforeend', Row);
        }); // <-- FIX 1: Closes the .forEach loop

    } catch (error) { // <-- FIX 2: Closes the try block and starts catch
        console.error("API Connection Failed:", error);
        container.innerHTML = `<p style="color: #ff4d4d;">⚠️ Error: Could not connect to the Pit Wall.</p>`;
    } // <-- FIX 3: Closes the catch block
}

// Trigger the function
document.addEventListener("DOMContentLoaded", fetchStandings);

/**
 * ADDITIONAL API: Open-Meteo (No Key Required)
 * Fetches current temperature based on Track Coordinates
 */
async function getTrackWeather(lat, lon) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        return data.current_weather;
    } catch (error) {
        console.error("Weather Fetch Failed:", error);
        return null;
    }
}

/**
 * FINAL INTEGRATED DISPLAY: F1 Data + Weather API + Navigation
 */
async function displayF1Races(races) {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;

    grid.innerHTML = ""; 

    for (const race of races) {
        // 1. Coordinates for the Weather API
        const lat = race.Circuit.Location.lat;
        const lon = race.Circuit.Location.long;
        const city = race.Circuit.Location.locality;
        
        // 2. Fetch the Weather
        const weather = await getTrackWeather(lat, lon);
        
        let weatherHTML = `<p style="color: rgba(255,255,255,0.2); font-size: 0.7em; margin: 10px 0;">Weather unavailable</p>`;
        
        if (weather) {
            const temp = Math.round(weather.temperature);
            const isRaining = weather.weathercode >= 61; 
            
            weatherHTML = `
                <div style="background: rgba(0, 160, 223, 0.1); padding: 12px; border-radius: 8px; margin: 12px 0; border: 1px solid rgba(0, 160, 223, 0.2);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold; color: #fff; font-size: 1.1em;">${temp}°C</span>
                        <span style="font-size: 0.75em; color: #00A0E2; font-weight: 800; letter-spacing: 1px;">
                            ${isRaining ? "🌧️ WET TRACK" : "☀️ DRY TRACK"}
                        </span>
                    </div>
                    <p style="font-size: 0.7em; margin-top: 5px; color: #888; text-transform: uppercase;">
                        Wind: ${weather.windspeed}km/h | Strategy: ${temp > 22 ? 'Hard' : 'Soft'}
                    </p>
                </div>
            `;
        }

        // 3. Combine everything into the card
        const card = document.createElement('div');
        card.className = 'driver-card'; 
        
        // Data object for the Save function
        const raceData = {
            id: race.round,
            name: race.raceName,
            circuit: race.Circuit.circuitName,
            location: `${city}, ${race.Circuit.Location.country}`,
            date: race.date
        };

        card.innerHTML = `
            <div class="card-content" style="padding: 20px;">
                <span style="font-size: 11px; font-weight: bold; color: #00A0E2; letter-spacing: 1px;">ROUND ${race.round}</span>
                <h3 style="margin: 8px 0; color: #fff; font-size: 1.3em; line-height: 1.2;">${race.raceName}</h3>
                <p style="font-size: 0.85em; color: #ccc; margin-bottom: 4px;"><strong>🏁</strong> ${race.Circuit.circuitName}</p>
                <p style="font-size: 0.8em; color: #888;">📅 ${new Date(race.date).toDateString()}</p>
                
                ${weatherHTML}

                <button class="view-btn" style="width: 100%; margin-top: 5px; background: #28a745; border: none; font-weight: bold;" 
                    onclick='saveRace(${JSON.stringify(raceData)})'>
                    ⭐ Save to My Calendar
                </button>

                <a href="${race.url}" target="_blank" class="view-btn" style="display: block; text-align: center; margin-top: 8px; text-decoration: none; background: rgba(255,255,255,0.1); color: white;">
                    Track Details
                </a>
            </div>
        `;
        
        grid.appendChild(card);
    }
}