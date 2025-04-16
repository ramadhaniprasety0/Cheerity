const buttons = document.querySelectorAll('#nominal-buttons .nominal-btn');
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

const paymentMethods = document.querySelectorAll('#payment-options .payment-method');

paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
        // Hindari klik pada tombol tambah metode
        if (method.querySelector('button')) return;

        paymentMethods.forEach(m => m.classList.remove('active'));
        method.classList.add('active');
    });
});

const checkboxes = document.querySelectorAll('.anon-checkbox');

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            // Jika checkbox ini dicentang, uncheck semua checkbox lain
            checkboxes.forEach((cb) => {
                if (cb !== this) cb.checked = false;
            });
        }
    });
});

const calendarBody = document.getElementById("calendar-body");
const calendarTitle = document.getElementById("calendar-title");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const donationListHarian = document.getElementById("donationListHarian");
const donationListBulanan = document.getElementById("donationListBulanan");

let currentMonth = 4;
let currentYear = 2025;
let planningData = [];

function populateMonthSelect(id) {
    const select = document.getElementById(id);
    select.innerHTML = "";
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    months.forEach((month, index) => {
        select.innerHTML += `<option value="${index}">${month}</option>`;
    });
}

function generateCalendar(month, year) {
    calendarBody.innerHTML = "";
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = (firstDay + 6) % 7;

    let date = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            let cell = document.createElement("td");
            if ((i === 0 && j < firstDayIndex) || date > daysInMonth) {
                cell.innerHTML = "";
            } else {
                cell.innerHTML = date;
                cell.setAttribute("data-day", date);
                date++;
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    calendarTitle.textContent = `${monthNames[month]} ${year}`;
}

function toggleForm(type) {
    document.getElementById("formHarian").style.display = type === "harian" ? "block" : "none";
    document.getElementById("formBulanan").style.display = type === "bulanan" ? "block" : "none";
}

function savePlanning(type) {
    if (type === "harian") {
        const start = new Date(document.getElementById("start").value);
        const end = new Date(document.getElementById("end").value);
        if (isNaN(start) || isNaN(end) || start > end) {
            alert("Masukkan tanggal yang valid.");
            return;
        }
        planningData.push({ name: "Paket Harian", start, end, price: 5000, type: "harian" });
    } else {
        const bulanMulai = parseInt(document.getElementById("bulanMulai").value);
        const bulanSampai = parseInt(document.getElementById("bulanSampai").value);
        const tahun = parseInt(document.getElementById("tahunBulanan").value);
        if (isNaN(bulanMulai) || isNaN(bulanSampai) || isNaN(tahun) || bulanMulai > bulanSampai) {
            alert("Pilih bulan dan tahun dengan benar.");
            return;
        }
        const start = new Date(tahun, bulanMulai, 1);
        const end = new Date(tahun, bulanSampai + 1, 0);
        planningData.push({ name: "Paket Bulanan", start, end, price: 100000, type: "bulanan" });
    }
    filterAndSortPlanning();
}

function renderPlanningCards(data, container) {
    container.innerHTML = data.map(plan => {
        const start = plan.start.getDate();
        const end = plan.end.getDate();
        const month = plan.start.getMonth();
        return `
    <div class="donation-card" onclick="highlightRange(${start}, ${end}, ${month}, ${plan.start.getFullYear()})">
      <div class="donation-icon">💰</div>
      <div class="donation-details">
        <h4>${plan.name}</h4>
        <small>Rp ${plan.price.toLocaleString()} | ${start}-${end} ${getMonthName(month)}</small>
      </div>
    </div>`;
    }).join("");
}

function filterAndSortPlanning() {
    let filtered = planningData.filter(plan =>
        plan.name.toLowerCase().includes(searchInput.value.toLowerCase())
    );
    switch (sortSelect.value) {
        case "name-asc": filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
        case "name-desc": filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
        case "date-asc": filtered.sort((a, b) => a.start - b.start); break;
        case "date-desc": filtered.sort((a, b) => b.start - a.start); break;
    }
    renderPlanningCards(filtered.filter(p => p.type === "harian"), donationListHarian);
    renderPlanningCards(filtered.filter(p => p.type === "bulanan"), donationListBulanan);
}

function highlightRange(startDate, endDate, month, year) {
    currentMonth = month;
    currentYear = year;
    generateCalendar(month, year);
    document.querySelectorAll("td").forEach(td => td.classList.remove("active"));
    for (let i = startDate; i <= endDate; i++) {
        const td = document.querySelector(`td[data-day="${i}"]`);
        if (td) td.classList.add("active");
    }
}

function getMonthName(index) {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return months[index];
}

function changeMonth(offset) {
    currentMonth += offset;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
}

// Init
populateMonthSelect("bulanMulai");
populateMonthSelect("bulanSampai");
searchInput.addEventListener("input", filterAndSortPlanning);
sortSelect.addEventListener("change", filterAndSortPlanning);
generateCalendar(currentMonth, currentYear);