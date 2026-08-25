/* =====================================================
   AGRI SERVICE CONNECT
   Frontend interactions
===================================================== */


/* ---------- Message ---------- */

function showMessage(message) {

    const box = document.getElementById("message-box");
    const text = document.getElementById("message-text");

    text.textContent = message;

    box.classList.add("show");

    setTimeout(() => {
        box.classList.remove("show");
    }, 2500);
}


/* ---------- Login ---------- */

function openLogin() {

    showMessage(
        "Login page will be connected soon."
    );
}


/* ---------- Register ---------- */

function openRegister() {

    showMessage(
        "Registration page will be added next."
    );
}


/* ---------- Service Selection ---------- */

function selectService(serviceName) {

    const descriptions = {
        "Plantation": "Plantation and agricultural labour services.",
        "Tractor & Ploughing": "Find tractor operators and land preparation services.",
        "Irrigation": "Watering and irrigation-related services.",
        "Harvesting": "Get skilled help during harvesting season.",
        "Crop Maintenance": "Regular maintenance and field work for your crops.",
        "Equipment": "Access agricultural equipment and tools."
    };

    document.getElementById("selectedServiceName").innerText = serviceName;

    document.getElementById("selectedServiceDescription").innerText =
        descriptions[serviceName] || "Find reliable agricultural services near you.";

    document.getElementById("serviceOverlay").style.display = "flex";
}

function closeService() {
    document.getElementById("serviceOverlay").style.display = "none";
}

function requestService(workerName) {

    document.getElementById("requestForm").style.display = "block";

    document.getElementById("requestForm").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function submitServiceRequest(event) {

    event.preventDefault();

    const land = document.getElementById("landSelect").value;
    const date = document.getElementById("requiredDate").value;
    const duration = document.getElementById("duration").value;

    if (!land || !date || !duration) {
        alert("Please fill all required fields.");
        return;
    }

    alert(
        "Service request submitted successfully!\n\n" +
        "Your request will be connected to the database later."
    );
}


/* ---------- Mobile Menu ---------- */

function toggleMenu() {

    const nav = document.querySelector(".nav-links");

    if (nav.style.display === "flex") {

        nav.style.display = "none";

    } else {

        nav.style.display = "flex";
        nav.style.flexDirection = "column";
        nav.style.position = "absolute";
        nav.style.top = "76px";
        nav.style.left = "0";
        nav.style.right = "0";
        nav.style.padding = "20px";
        nav.style.background = "white";
        nav.style.borderBottom = "1px solid #e4ebe5";
    }
}


/* ---------- Reviews ---------- */

function previousReview() {

    showMessage(
        "Previous reviews will load from the database."
    );
}


function nextReview() {

    showMessage(
        "More reviews will load from the database."
    );
}

// ================= AUTH =================

const authOverlay = document.getElementById("authOverlay");

function openLogin() {
    authOverlay.style.display = "flex";
    showLogin();
}

function openRegister() {
    authOverlay.style.display = "flex";
    showRegister();
}

function closeAuth() {
    authOverlay.style.display = "none";
}

function showLogin() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registerForm").style.display = "none";
}

function showRegister() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
}

function selectRole(button) {
    document.querySelectorAll(".role-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");
}

function handleLogin(event) {
    event.preventDefault();
    alert("Login will be connected to the database later.");
}

function handleRegister(event) {
    event.preventDefault();
    alert("Registration will be connected to the database later.");
}

function filterServices() {
    const search = document.getElementById("serviceSearch").value.toLowerCase();
    const category = document.getElementById("serviceFilter").value;

    document.querySelectorAll(".service-card").forEach(card => {
        const text = card.innerText.toLowerCase();
        const service = card.querySelector("h3").innerText;

        const searchMatch = text.includes(search);
        const categoryMatch = category === "all" || service === category;

        card.style.display =
            searchMatch && categoryMatch ? "" : "none";
    });
}

// ================= FARMER DASHBOARD =================

function openDashboard() {
    document.getElementById("farmerDashboard").style.display = "block";

    document.getElementById("farmerDashboard").scrollIntoView({
        behavior: "smooth"
    });
}

function closeDashboard() {
    document.getElementById("farmerDashboard").style.display = "none";
}

// ================= ADD LAND =================

function openLandForm() {
    document.getElementById("addLandForm").style.display = "block";
}

function addLand(event) {
    event.preventDefault();

    const location = document.getElementById("landLocation").value;
    const area = document.getElementById("landArea").value;
    const irrigation = document.querySelector(
        'input[name="irrigation"]:checked'
    ).value;

    alert(
        "Land added successfully!\n\n" +
        "Location: " + location +
        "\nArea: " + area + " acres" +
        "\nIrrigation: " + (irrigation === "1" ? "Available" : "Not Available") +
        "\n\nThis will be saved to the database after backend integration."
    );

    document.getElementById("addLandForm").style.display = "none";
    event.target.reset();
}

// ================= PROVIDER DASHBOARD =================

function openProviderDashboard() {
    document.getElementById("providerDashboard").style.display = "block";

    document.getElementById("providerDashboard").scrollIntoView({
        behavior: "smooth"
    });
}

function closeProviderDashboard() {
    document.getElementById("providerDashboard").style.display = "none";
}

function handleRequest(status) {

    if (status === "accepted") {
        alert(
            "Service request accepted!\n\n" +
            "The booking will be created after backend integration."
        );
    } else {
        alert("Service request rejected.");
    }
}