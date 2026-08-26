/* =====================================================
   AGRI SERVICE CONNECT
   FRONTEND ↔ BACKEND
===================================================== */

const API = window.AGRI_API_URL || "http://localhost:5000/api";

let currentFarmer =
    JSON.parse(localStorage.getItem("agriFarmer")) || null;

let currentWorker =
    JSON.parse(localStorage.getItem("agriWorker")) || null;

let selectedServiceId = null;
let selectedServiceName = "";
let currentBooking = null;
let selectedRating = 0;


/* =====================================================
   MESSAGE / NOTIFICATION
===================================================== */

function showMessage(message) {

    const box = document.getElementById("message-box");
    const text = document.getElementById("message-text");

    if (!box || !text) {
        alert(message);
        return;
    }

    text.textContent = message;
    box.classList.add("show");

    setTimeout(() => {
        box.classList.remove("show");
    }, 2500);
}


function showNotification(message) {

    const notification =
        document.getElementById("notification");

    if (!notification) {
        showMessage(message);
        return;
    }

    const text =
        document.getElementById("notificationText");

    if (text) {
        text.innerText = message;
    }

    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}


/* =====================================================
   AUTH
===================================================== */

function openLogin() {

    const overlay =
        document.getElementById("authOverlay");

    if (!overlay) {
        alert("Login window not found.");
        return;
    }

    overlay.style.display = "flex";
    showLogin();
}


function openRegister() {

    const overlay =
        document.getElementById("authOverlay");

    if (!overlay) {
        alert("Registration window not found.");
        return;
    }

    overlay.style.display = "flex";
    showRegister();
}


function closeAuth() {

    const overlay =
        document.getElementById("authOverlay");

    if (overlay) {
        overlay.style.display = "none";
    }
}


function showLogin() {

    const login =
        document.getElementById("loginForm");

    const register =
        document.getElementById("registerForm");

    if (login) {
        login.style.display = "block";
    }

    if (register) {
        register.style.display = "none";
    }
}


function showRegister() {

    const login =
        document.getElementById("loginForm");

    const register =
        document.getElementById("registerForm");

    if (login) {
        login.style.display = "none";
    }

    if (register) {
        register.style.display = "block";
    }
}


function selectRole(button) {

    document
        .querySelectorAll(".role-btn")
        .forEach(btn => {
            btn.classList.remove("active");
        });

    button.classList.add("active");
}

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


/* =====================================================
   LOGIN
===================================================== */

async function handleLogin(event) {

    event.preventDefault();

    const form = event.target;

    /*
       Don't depend on input[type="text"].
       This was causing your previous:
       Cannot read properties of null (reading 'value')
    */

    const input = form.querySelector("input");

    if (!input) {
        showMessage("Login input not found.");
        return;
    }

    const contact = input.value.trim();

    if (!contact) {
        showMessage("Please enter your contact number.");
        return;
    }


    /* ---------------------------------------------
       FIND SELECTED ROLE
    --------------------------------------------- */

    const activeRole =
        document.querySelector(".role-btn.active");

    let role = activeRole
        ? activeRole.innerText.trim().toLowerCase()
        : "farmer";


    /*
       We accept different labels:
       Farmer
       Service Provider
       Worker
       Provider
    */

    const isFarmer =
        role.includes("farmer");

    const isWorker =
        role.includes("provider") ||
        role.includes("worker");


    if (!isFarmer && !isWorker) {

        showMessage(
            "Please select Farmer or Service Provider."
        );

        return;
    }


    try {

        /* =========================================
           FARMER LOGIN
        ========================================= */

        if (isFarmer) {

            const response =
                await fetch(
                    `${API}/farmers/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            contact: contact
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Farmer login failed."
                );

                return;
            }


            currentFarmer = data.farmer;
            currentWorker = null;
            localStorage.removeItem("agriWorker");
            closeProviderDashboard();


            localStorage.setItem(
                "agriFarmer",
                JSON.stringify(currentFarmer)
            );


            closeAuth();


            showNotification(
                `Welcome back, ${currentFarmer.name}!`
            );


            await openDashboard();

            return;
        }


        /* =========================================
           WORKER / SERVICE PROVIDER LOGIN
        ========================================= */

        if (isWorker) {

            const response =
                await fetch(
                    `${API}/workers/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            contact: contact
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Service provider login failed."
                );

                return;
            }


            currentWorker =
                data.worker;
            currentFarmer = null;
            localStorage.removeItem("agriFarmer");
            closeDashboard();


            localStorage.setItem(
                "agriWorker",
                JSON.stringify(currentWorker)
            );


            closeAuth();


            showNotification(
                `Welcome, ${currentWorker.name}!`
            );


            await openProviderDashboard();

            return;
        }

    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        showMessage(
            "Cannot connect to backend. Make sure server.js is running."
        );
    }
}


/* =====================================================
   REGISTER FARMER
===================================================== */

async function handleRegister(event) {

    event.preventDefault();

    const form = event.target;

    const name = form.elements.name?.value.trim();
    const contact = form.elements.contact?.value.trim();
    const email = form.elements.email?.value.trim();
    const location = form.elements.location?.value.trim();


    if (!name || !contact || !location) {

        showMessage(
            "Please fill all registration details."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API}/farmers/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        contact: contact,
                        email: email || null,
                        location: location
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                data.message ||
                "Registration failed."
            );

            return;
        }


        showNotification(
            "Registration successful! Please login."
        );


        form.reset();

        showLogin();

    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );

        showMessage(
            "Cannot connect to backend."
        );
    }
}


/* =====================================================
   SERVICES
===================================================== */

/*
   IDs according to your current service table:

   1 = Plantation Labour
   2 = Harvesting
   3 = Tractor and Ploughing
   4 = Irrigation
*/

const SERVICES = {

    "Plantation": {
        id: 1,
        description:
            "Plantation and agricultural labour services."
    },

    "Plantation Labour": {
        id: 1,
        description:
            "Plantation and agricultural labour services."
    },

    "Tractor & Ploughing": {
        id: 3,
        description:
            "Find tractor operators and land preparation services."
    },

    "Tractor and Ploughing": {
        id: 3,
        description:
            "Find tractor operators and land preparation services."
    },

    "Irrigation": {
        id: 4,
        description:
            "Watering and irrigation-related services."
    },

    "Harvesting": {
        id: 2,
        description:
            "Get skilled help during harvesting season."
    },

    "Soil Testing": {
        id: 5,
        description:
            "Soil sample collection and testing services."
    },

    "Pest Management": {
        id: 6,
        description:
            "Pest and crop protection services."
    },

    "Agricultural Consultation": {
        id: 7,
        description:
            "Basic agricultural guidance and consultation."
    }
};


async function selectService(serviceName) {

    const service = SERVICES[serviceName];

    if (!service) {
        showMessage(
            serviceName + " is not available in the database yet."
        );
        return;
    }

    selectedServiceName = serviceName;
    selectedServiceId = service.id;

    document.getElementById("selectedServiceName").innerText =
        serviceName;

    document.getElementById("selectedServiceDescription").innerText =
        service.description;

    document.getElementById("serviceOverlay").style.display = "flex";

    // Hide request form until a worker is selected
    document.getElementById("requestForm").style.display = "none";

    // Load workers for this particular service
    await loadServiceWorkers(selectedServiceId);
}

async function loadServiceWorkers(serviceId) {

    const workerList =
        document.getElementById("workerList");

    workerList.innerHTML = `
        <p style="padding: 20px;">
            Loading available workers...
        </p>
    `;

    try {

        const response = await fetch(
            `${API}/workers/service/${serviceId}`
        );

        const workers = await response.json();

        if (!response.ok) {
            throw new Error(
                workers.message || "Failed to load workers."
            );
        }

        if (!workers.length) {

            workerList.innerHTML = `
                <p style="padding: 20px;">
                    No workers are currently available for this service.
                </p>
            `;

            return;
        }

        workerList.innerHTML = "";

        workers.forEach(worker => {

            const card =
                document.createElement("div");

            card.className = "worker-card";

            card.innerHTML = `
                <div>
                    <h3>${worker.name}</h3>

                    <p>
                        ${worker.location || "Local service provider"}
                    </p>

                    <span>
                        ★ ${worker.rating || "4.5"}
                    </span>
                </div>

                <button
                    onclick="requestService('${worker.name}')">
                    Request Service
                </button>
            `;

            workerList.appendChild(card);
        });

    } catch (error) {

        console.error(error);

        workerList.innerHTML = `
            <p style="padding: 20px;">
                Unable to load workers.
            </p>
        `;

        showMessage(
            "Could not load available workers."
        );
    }
}

function closeService() {

    const overlay =
        document.getElementById(
            "serviceOverlay"
        );

    if (overlay) {
        overlay.style.display = "none";
    }
}


/* =====================================================
   REQUEST SERVICE
===================================================== */

async function requestService(workerName) {

    /*
       IMPORTANT:
       We do NOT reset selectedServiceId here.

       This fixes:
       "Please select a service first."
    */

    if (!currentFarmer) {

        closeService();
        openLogin();

        return;
    }


    const requestForm =
        document.getElementById(
            "requestForm"
        );


    if (!requestForm) {

        showMessage(
            "Service request form not found."
        );

        return;
    }


    requestForm.style.display =
        "block";


    await loadFarmerLand();


    requestForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


async function submitServiceRequest(event) {

    event.preventDefault();


    if (!currentFarmer) {

        showMessage(
            "Please login first."
        );

        return;
    }


    const land =
        document.getElementById(
            "landSelect"
        )?.value;


    const date =
        document.getElementById(
            "requiredDate"
        )?.value;


    const duration =
        document.getElementById(
            "duration"
        )?.value;


    const description =
        document.getElementById(
            "requestDescription"
        )?.value || "";


    if (!land || !date || !duration) {

        showMessage(
            "Please fill all required fields."
        );

        return;
    }


    /*
       If service ID somehow disappeared,
       use the currently selected service name.
    */

    if (!selectedServiceId &&
        selectedServiceName) {

        const service =
            SERVICES[selectedServiceName];

        if (service) {
            selectedServiceId =
                service.id;
        }
    }


    if (!selectedServiceId) {

        showMessage(
            "Please select a service first."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API}/service-requests`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        farmer_id:
                            currentFarmer.farmer_id,

                        land_id:
                            Number(land),

                        service_id:
                            Number(selectedServiceId),

                        required_date:
                            date,

                        duration:
                            Number(duration),

                        description:
                            description
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                data.message ||
                "Service request failed."
            );

            return;
        }


        showNotification(
            "Service request submitted successfully!"
        );


        event.target.reset();


        document.getElementById(
            "requestForm"
        ).style.display = "none";


        closeService();


        await loadFarmerDashboard();

    } catch (error) {

        console.error(
            "SERVICE REQUEST ERROR:",
            error
        );

        showMessage(
            "Cannot connect to backend."
        );
    }
}


/* =====================================================
   LAND
===================================================== */

async function loadFarmerLand() {

    if (!currentFarmer) {
        return [];
    }


    try {

        const response =
            await fetch(
                `${API}/land/farmer/${currentFarmer.farmer_id}`
            );


        const lands =
            await response.json();


        const select =
            document.getElementById(
                "landSelect"
            );


        if (select) {

            select.innerHTML =
                `<option value="">
                    Select land
                </option>`;


            lands.forEach(land => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    land.land_id;


                option.textContent =
                    `${land.location} — ${land.area} acres`;


                select.appendChild(
                    option
                );
            });
        }


        const landList =
            document.querySelector(
                ".land-list"
            );


        if (landList) {

            landList.innerHTML = "";


            lands.forEach(land => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "land-item";


                item.innerHTML = `
                    <div>
                        <h4>${land.location}</h4>

                        <p>
                            ${land.area} acres ·
                            ${
                                land.irrigation_available
                                ? "Irrigation available"
                                : "No irrigation"
                            }
                        </p>
                    </div>

                    <span>
                        Land #${land.land_id}
                    </span>
                `;


                landList.appendChild(
                    item
                );
            });
        }


        return lands;

    } catch (error) {

        console.error(
            "LAND LOAD ERROR:",
            error
        );

        return [];
    }
}


function openLandForm() {

    if (!currentFarmer) {

        openLogin();

        return;
    }


    const form =
        document.getElementById(
            "addLandForm"
        );


    if (form) {
        form.style.display = "block";
    }
}


async function addLand(event) {

    event.preventDefault();


    if (!currentFarmer) {

        showMessage(
            "Please login first."
        );

        return;
    }


    const location =
        document.getElementById(
            "landLocation"
        ).value;


    const area =
        document.getElementById(
            "landArea"
        ).value;


    const irrigationInput =
        document.querySelector(
            'input[name="irrigation"]:checked'
        );


    if (!location ||
        !area ||
        !irrigationInput) {

        showMessage(
            "Please fill all land details."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API}/land`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        farmer_id:
                            currentFarmer.farmer_id,

                        area:
                            area,

                        location:
                            location,

                        irrigation_available:
                            irrigationInput.value === "1"
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                data.message ||
                "Failed to add land."
            );

            return;
        }


        showNotification(
            "Land registered successfully!"
        );


        event.target.reset();


        document.getElementById(
            "addLandForm"
        ).style.display = "none";


        await loadFarmerLand();

    } catch (error) {

        console.error(
            "ADD LAND ERROR:",
            error
        );

        showMessage(
            "Cannot connect to backend."
        );
    }
}


/* =====================================================
   FARMER DASHBOARD
===================================================== */

async function openDashboard() {

    if (!currentFarmer) {

        openLogin();

        return;
    }


    const dashboard =
        document.getElementById(
            "farmerDashboard"
        );


    if (!dashboard) {

        showMessage(
            "Farmer dashboard not found."
        );

        return;
    }


    dashboard.style.display =
        "block";


    dashboard.scrollIntoView({
        behavior: "smooth"
    });


    await loadFarmerDashboard();
}


function closeDashboard() {

    const dashboard =
        document.getElementById(
            "farmerDashboard"
        );


    if (dashboard) {
        dashboard.style.display =
            "none";
    }
}


async function loadFarmerDashboard() {

    if (!currentFarmer) {
        return;
    }


    const lands = await loadFarmerLand();


    try {

        const response =
            await fetch(
                `${API}/service-requests/farmer/${currentFarmer.farmer_id}`
            );


        const requests =
            await response.json();

        const table =
            document.querySelector(
                ".request-table"
            );


        if (table) {

            table.innerHTML = `
                <div class="request-row request-head">
                    <span>Service</span>
                    <span>Required Date</span>
                    <span>Status</span>
                </div>
            `;


            requests.forEach(request => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "request-row";


                row.innerHTML = `
                    <span>
                        ${request.service_name}
                    </span>

                    <span>
                        ${formatDate(
                            request.required_date
                        )}
                    </span>

                    <span class="status ${String(
                        request.status
                    ).toLowerCase()}">
                        ${request.status}
                    </span>
                `;


                table.appendChild(row);
            });
        }


        const bookingsResponse =
            await fetch(
                `${API}/bookings/farmer/${currentFarmer.farmer_id}`
            );


        const bookings =
            await bookingsResponse.json();


        renderFarmerBookings(
            bookings
        );


        updateFarmerStats(lands, requests, bookings);

    } catch (error) {

        console.error(
            "DASHBOARD ERROR:",
            error
        );
    }
}

function updateFarmerStats(lands, requests, bookings) {
    const setCount = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    setCount("farmerLandCount", lands.length);
    setCount("farmerRequestCount", requests.length);
    setCount("farmerPendingCount", requests.filter(request => request.status === "Pending").length);
    setCount("farmerCompletedCount", bookings.filter(booking => booking.booking_status === "Completed").length);
}


/* =====================================================
   FARMER BOOKINGS
===================================================== */

function renderFarmerBookings(bookings) {

    const existing =
        document.querySelector(
            ".farmer-booking-list"
        );


    if (existing) {
        existing.remove();
    }


    if (!bookings.length) {
        return;
    }


    const dashboard =
        document.getElementById(
            "farmerDashboard"
        );


    if (!dashboard) {
        return;
    }


    const panel =
        document.createElement(
            "div"
        );


    panel.className =
        "dashboard-panel farmer-booking-list";


    panel.innerHTML = `
        <div class="panel-heading">
            <div>
                <span class="section-label">
                    ACCEPTED SERVICES
                </span>

                <h3>
                    My Bookings
                </h3>
            </div>
        </div>
    `;


    bookings.forEach(booking => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "request-card";


        card.innerHTML = `
            <div>

                <span class="section-label">
                    ${booking.booking_status}
                </span>

                <h3>
                    ${booking.service_name}
                </h3>

                <p>
                    Provider:
                    ${booking.worker_name}
                </p>

                <p>
                    Location:
                    ${booking.location}
                </p>

                <p>
                    Date:
                    ${formatDate(
                        booking.start_date
                    )}
                </p>

                <p>
                    Amount:
                    ₹${booking.amount}
                </p>

            </div>

            <button
                class="payment-btn"
                onclick="openBookingById(
                    ${booking.booking_id}
                )">
                View Booking & Pay →
            </button>
        `;


        panel.appendChild(card);
    });


    dashboard.appendChild(
        panel
    );
}


async function openBookingById(bookingId) {

    if (!currentFarmer) {
        openLogin();
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/bookings/farmer/${currentFarmer.farmer_id}`
            );


        const bookings =
            await response.json();


        const booking =
            bookings.find(
                b =>
                    Number(b.booking_id) ===
                    Number(bookingId)
            );


        if (!booking) {

            showMessage(
                "Booking not found."
            );

            return;
        }


        currentBooking =
            booking;


        document.getElementById(
            "bookingService"
        ).innerText =
            booking.service_name;


        document.getElementById(
            "bookingProvider"
        ).innerText =
            booking.worker_name;

        document.getElementById("bookingLocation").innerText =
            booking.location;
        document.getElementById("bookingStartDate").innerText =
            formatDate(booking.start_date);
        document.getElementById("bookingAmount").innerText =
            `₹${booking.amount}`;


        document.getElementById(
            "bookingOverlay"
        ).style.display =
            "flex";


        showBookingStep();

    } catch (error) {

        console.error(error);

        showMessage(
            "Failed to load booking."
        );
    }
}


/* =====================================================
   PROVIDER / WORKER DASHBOARD
===================================================== */

async function openProviderDashboard() {

    currentWorker =
        JSON.parse(
            localStorage.getItem(
                "agriWorker"
            )
        );


    if (!currentWorker) {

        openLogin();

        return;
    }

    closeDashboard();


    const dashboard =
        document.getElementById(
            "providerDashboard"
        );


    if (!dashboard) {

        showMessage(
            "Provider dashboard not found."
        );

        return;
    }


    dashboard.style.display =
        "block";


    dashboard.scrollIntoView({
        behavior: "smooth"
    });


    await loadProviderRequests();
}


function closeProviderDashboard() {

    const dashboard =
        document.getElementById(
            "providerDashboard"
        );


    if (dashboard) {

        dashboard.style.display =
            "none";
    }
}


async function loadProviderRequests() {

    if (!currentWorker) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/workers/${currentWorker.worker_id}/requests`
            );


        const requests =
            await response.json();

        if (!response.ok) {
            throw new Error(requests.message || "Failed to load service requests.");
        }

        let bookings = [];
        try {
            const bookingsResponse = await fetch(
                `${API}/bookings/worker/${currentWorker.worker_id}`
            );
            const bookingData = await bookingsResponse.json();
            if (!bookingsResponse.ok) throw new Error(bookingData.message);
            bookings = bookingData;
        } catch (bookingError) {
            console.warn("Provider bookings are unavailable:", bookingError);
        }


        const list =
            document.querySelector(
                ".provider-request-list"
            );


        if (!list) {
            return;
        }


        list.innerHTML = "";


        if (!requests.length) {

            list.innerHTML = `
                <p style="padding:20px;">
                    No pending service requests.
                </p>
            `;

        } else {
            requests.forEach(request => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "provider-request";


            card.innerHTML = `
                <div class="provider-request-info">

                    <h4>
                        ${request.service_name}
                    </h4>

                    <p>
                        Farmer:
                        ${request.farmer_name}
                    </p>

                    <p>
                        Location:
                        ${request.location}
                        · ${request.area} acres
                    </p>

                    <p>
                        Required:
                        ${formatDate(
                            request.required_date
                        )}
                    </p>

                    <p>
                        Duration:
                        ${request.duration || 1}
                        day(s)
                    </p>

                </div>

                <div class="provider-actions">

                    <button
                        class="accept-btn"
                        onclick="acceptServiceRequest(
                            ${request.request_id},
                            '${request.required_date}',
                            ${request.duration || 1}
                        )">
                        Accept
                    </button>

                </div>
            `;


                list.appendChild(card);
            });
        }

        renderProviderBookings(bookings);
        updateProviderStats(requests, bookings);

    } catch (error) {

        console.error(
            "PROVIDER REQUEST ERROR:",
            error
        );

        showMessage(
            "Failed to load provider requests."
        );
    }
}

function renderProviderBookings(bookings) {
    const table = document.getElementById("providerBookingTable");
    if (!table) return;

    table.innerHTML = `
        <div class="request-row request-head">
            <span>Service</span><span>Farmer</span><span>Status</span>
        </div>`;

    if (!bookings.length) {
        table.innerHTML += `<p style="padding: 16px;">No bookings yet.</p>`;
        return;
    }

    closeProviderDashboard();

    bookings.forEach(booking => {
        const row = document.createElement("div");
        row.className = "request-row";
        row.innerHTML = `
            <span>${booking.service_name}</span>
            <span>${booking.farmer_name}</span>
            <span class="status ${String(booking.booking_status).toLowerCase()}">${booking.booking_status}</span>`;
        table.appendChild(row);
    });
}

function updateProviderStats(requests, bookings) {
    const setCount = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    setCount("providerRequestCount", requests.length);
    setCount("providerBookingCount", bookings.filter(booking => booking.booking_status !== "Completed").length);
    setCount("providerCompletedCount", bookings.filter(booking => booking.booking_status === "Completed").length);
}


/* =====================================================
   ACCEPT REQUEST
===================================================== */

async function acceptServiceRequest(
    requestId,
    requiredDate,
    duration
) {

    if (!currentWorker) {

        showMessage(
            "Please login as service provider."
        );

        return;
    }


    const startDate =
        requiredDate;


    const end =
        new Date(
            requiredDate
        );


    end.setDate(
        end.getDate() +
        Number(duration) -
        1
    );


    const endDate =
        end.toISOString()
            .split("T")[0];


    try {

        const response =
            await fetch(
                `${API}/workers/requests/${requestId}/accept`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        worker_id:
                            currentWorker.worker_id,

                        start_date:
                            startDate,

                        end_date:
                            endDate
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                data.message ||
                "Could not accept request."
            );

            return;
        }


        showNotification(
            "Request accepted and booking created!"
        );


        await loadProviderRequests();

    } catch (error) {

        console.error(
            "ACCEPT ERROR:",
            error
        );

        showMessage(
            "Cannot connect to backend."
        );
    }
}


/* =====================================================
   REJECT REQUEST
===================================================== */

async function rejectServiceRequest(requestId) {

    /*
       Keep this simple for now.
       Your backend does not currently show
       a reject endpoint in the router you gave me.
    */

    showNotification(
        "Request rejected."
    );
}


/* =====================================================
   BOOKING / PAYMENT
===================================================== */

function openBooking(service, provider) {

    document.getElementById(
        "bookingService"
    ).innerText =
        service ||
        "Tractor & Ploughing";


    document.getElementById(
        "bookingProvider"
    ).innerText =
        provider ||
        "Service Provider";


    document.getElementById(
        "bookingOverlay"
    ).style.display =
        "flex";


    showBookingStep();
}


function closeBooking() {

    const overlay =
        document.getElementById(
            "bookingOverlay"
        );


    if (overlay) {
        overlay.style.display =
            "none";
    }
}


function showBookingStep() {

    document.getElementById(
        "bookingStep"
    ).style.display =
        "block";


    document.getElementById(
        "paymentStep"
    ).style.display =
        "none";


    document.getElementById(
        "paymentSuccess"
    ).style.display =
        "none";


    document.getElementById(
        "reviewStep"
    ).style.display =
        "none";
}


function showPayment() {

    if (!currentBooking) {

        showMessage(
            "Booking not found."
        );

        return;
    }


    document.getElementById(
        "bookingStep"
    ).style.display =
        "none";


    document.getElementById(
        "paymentStep"
    ).style.display =
        "block";


    const button =
        document.querySelector(
            "#paymentStep .payment-btn"
        );


    if (button) {

        button.innerText =
            `Pay ₹${currentBooking.amount}`;
    }
}


/* =====================================================
   PAYMENT
===================================================== */

async function makePayment() {

    if (!currentBooking) {

        showMessage(
            "Booking not found."
        );

        return;
    }


    const selected =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );


    if (!selected) {

        showMessage(
            "Please select a payment method."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API}/payments`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        booking_id:
                            currentBooking.booking_id,

                        amount:
                            currentBooking.amount,

                        payment_method:
                            selected.value
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                data.message ||
                "Payment failed."
            );

            return;
        }


        document.getElementById(
            "paymentStep"
        ).style.display =
            "none";


        document.getElementById(
            "paymentSuccess"
        ).style.display =
            "block";


        showNotification(
            "Payment successful!"
        );

    } catch (error) {

        console.error(
            "PAYMENT ERROR:",
            error
        );

        showMessage(
            "Cannot connect to backend."
        );
    }
}


/* =====================================================
   REVIEW
===================================================== */

function showReview() {

    if (!currentBooking) {

        showMessage(
            "Booking not found."
        );

        return;
    }


    document.getElementById(
        "paymentSuccess"
    ).style.display =
        "none";


    document.getElementById(
        "reviewStep"
    ).style.display =
        "block";
}


function selectRating(rating) {

    selectedRating =
        rating;


    document
        .querySelectorAll(
            ".rating-selector button"
        )
        .forEach(
            (button, index) => {

                if (index < rating) {

                    button.classList.add(
                        "selected"
                    );

                } else {

                    button.classList.remove(
                        "selected"
                    );
                }
            }
        );
}


async function submitReview() {

    if (!currentBooking) {

        showMessage(
            "Booking not found."
        );

        return;
    }


    if (selectedRating === 0) {

        showMessage(
            "Please select a rating."
        );

        return;
    }


    const comment =
        document.getElementById(
            "reviewComment"
        )?.value || "";


    try {

        const response =
            await fetch(
                `${API}/reviews`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        booking_id:
                            currentBooking.booking_id,

                        rating:
                            selectedRating,

                        comment:
                            comment
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                data.message ||
                "Review submission failed."
            );

            return;
        }


        showNotification(
            "Thank you for your feedback!"
        );


        selectedRating = 0;


        const commentBox =
            document.getElementById(
                "reviewComment"
            );


        if (commentBox) {
            commentBox.value = "";
        }


        closeBooking();

    } catch (error) {

        console.error(
            "REVIEW ERROR:",
            error
        );

        showMessage(
            "Cannot connect to backend."
        );
    }
}


/* =====================================================
   MOBILE MENU
===================================================== */

function toggleMenu() {

    const nav =
        document.querySelector(
            ".nav-links"
        );


    if (!nav) {
        return;
    }


    if (nav.style.display === "flex") {

        nav.style.display =
            "none";

    } else {

        nav.style.display =
            "flex";

        nav.style.flexDirection =
            "column";

        nav.style.position =
            "absolute";

        nav.style.top =
            "76px";

        nav.style.left =
            "0";

        nav.style.right =
            "0";

        nav.style.padding =
            "20px";

        nav.style.background =
            "white";

        nav.style.borderBottom =
            "1px solid #e4ebe5";
    }
}


/* =====================================================
   SERVICE FILTER
===================================================== */

function filterServices() {

    const searchInput =
        document.getElementById(
            "serviceSearch"
        );


    const categoryInput =
        document.getElementById(
            "serviceFilter"
        );


    if (!searchInput ||
        !categoryInput) {
        return;
    }


    const search =
        searchInput.value
            .toLowerCase();


    const category =
        categoryInput.value;


    document
        .querySelectorAll(
            ".service-card"
        )
        .forEach(card => {

            const text =
                card.innerText
                    .toLowerCase();


            const heading =
                card.querySelector(
                    "h3"
                );


            const service =
                heading
                    ? heading.innerText
                    : "";


            const searchMatch =
                text.includes(
                    search
                );


            const categoryMatch =
                category === "all" ||
                service === category;


            card.style.display =
                searchMatch &&
                categoryMatch
                    ? ""
                    : "none";
        });
}


/* =====================================================
   REVIEWS NAVIGATION
===================================================== */

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


/* =====================================================
   PROVIDER REQUEST BUTTON SUPPORT
===================================================== */

function handleRequest(status) {

    if (status === "accepted") {

        showNotification(
            "Service request accepted successfully."
        );

    } else {

        showNotification(
            "Service request rejected."
        );
    }
}


/* =====================================================
   COMPLETE JOB
===================================================== */

function completeJob() {

    showNotification(
        "Job marked as completed."
    );
}


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
           Restore farmer session
        */

        if (currentFarmer) {

            console.log(
                "Farmer session restored:",
                currentFarmer.name
            );
        }


        /*
           Restore worker session
        */

        if (currentWorker) {

            console.log(
                "Worker session restored:",
                currentWorker.name
            );
        }

    }
);
