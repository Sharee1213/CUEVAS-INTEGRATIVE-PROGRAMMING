document.addEventListener("DOMContentLoaded", () => {
    // 1. SECURITY: Check access immediately before anything else runs
    checkAdminAccess();

    // 2. INITIALIZE UI COMPONENTS
    initPasswordValidation();
    initEntranceAnimations();
    initSmoothScroll();
    initAdminLogic();
    initUserSearch();
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

// --- ADMIN & USER LOGIN LOGIC ---
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // This stops the page from automatically going to index.html

        const emailValue = document.getElementById('loginEmail').value.trim().toLowerCase();
        const passValue = document.getElementById('loginPass').value.trim();

        // 1. Check for Admin
        if (emailValue === "admin@williams.com" && passValue === "pitwall2026") {
            localStorage.setItem("userRole", "admin"); // Give them the Admin Key
            window.location.href = "admin.html";      // Send to Admin Dashboard
        } 
        // 2. Everything else is a Fan
        else {
            localStorage.setItem("userRole", "fan");
            window.location.href = "index.html";
        }
    });
}