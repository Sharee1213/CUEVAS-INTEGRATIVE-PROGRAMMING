document.addEventListener("DOMContentLoaded", () => {
    initPasswordValidation();
    initEntranceAnimations();
    initSmoothScroll();
    initAdminLogic();
    initUserSearch();
});

// 1. Unified Entrance Animations (Staggered)
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

    document.querySelectorAll(".driver-card, .stat-box, .section-title, .fact-card, .admin-table tr")
        .forEach((el) => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
            appearanceObserver.observe(el);
        });
}

// 2. Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) target.scrollIntoView({ behavior: "smooth" });
        });
    });
}

// 3. Admin & Manage User Logic
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

// 4. Existing Features
function expandProfile(button) {
    const card = button.closest(".driver-card");
    card.classList.toggle("expanded");
    button.textContent = card.classList.contains("expanded") ? "Close Profile" : "View Profile";
    button.style.background = card.classList.contains("expanded") 
        ? "linear-gradient(135deg, #cc0000 0%, #990000 100%)" 
        : "linear-gradient(135deg, #0066cc 0%, #0099ff 100%)";
}

function initPasswordValidation() {
    const form = document.getElementById("registrationForm");
    const passInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirm_password");
    if (!form || !passInput) return;

    const validate = () => {
        const isLong = passInput.value.length >= 8;
        const isMatch = passInput.value === confirmInput.value && passInput.value !== "";
        document.getElementById("length-note").style.color = isLong ? "#0ce71e" : "#ff4d4d";
        document.getElementById("match-note").style.color = isMatch ? "#0ce71e" : "#ff4d4d";
        return isLong && isMatch;
    };

    passInput.addEventListener("input", validate);
    confirmInput.addEventListener("input", validate);
    form.onsubmit = (e) => { if (!validate()) e.preventDefault(); };
}

window.toggleVisibility = function (id) {
    const input = document.getElementById(id);
    const icon = input.nextElementSibling;
    input.type = input.type === "password" ? "text" : "password";
    icon.textContent = input.type === "password" ? "👁️" : "🙈";
};