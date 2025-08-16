function goHome() {
    window.location.href = '../home.html';
}
function goTeacher() {
    window.location.href = 'index.html';
}

function downloadAttendance() {
    const checkboxes = document.querySelectorAll('input[name="student"]:checked');
    let data = "Attendance List:\n";
    checkboxes.forEach(cb => {
        data += cb.value + "\n";
    });
    if (checkboxes.length === 0) {
        alert("No students marked present.");
        return;
    }
    const blob = new Blob([data], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "attendance.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

const students = [
    "Anant", "Ayaan Year 1", "Aayansh", "Ayaan- Y zero", "Dhriti", "Arya", "Devasish", "Diya", "Vaibav",
    "Ishaan", "Ishaq", "Janani", "Joseph", "Anshu", "Manish", "Sadhana", "Megavarshini", "Melina",
    "NIhal", "Ropp", "Naaz", "Rabbzaad", "Rachna", "Samyukta", "Samreen", "Sana", "Sehaj", "Shaehveer",
    "Zea", "Myra", "Guradesh", "Gurumehar", "Gurneer", "Gurseerath"
];

let selectedDates = [];

window.onload = function() {
    populateMonthSelect();
    renderStudentAttendanceTables();
};

function populateMonthSelect() {
    const monthSelect = document.getElementById('monthSelect');
    const now = new Date();
    for (let m = 0; m < 12; m++) {
        const date = new Date(now.getFullYear(), m, 1);
        const option = document.createElement('option');
        option.value = m;
        option.text = date.toLocaleString('default', { month: 'long' });
        if (m === now.getMonth()) option.selected = true;
        monthSelect.appendChild(option);
    }
}

function addDate() {
    const month = parseInt(document.getElementById('monthSelect').value, 10);
    const dateInput = document.getElementById('datePicker');
    if (!dateInput.value) return;
    const date = new Date(dateInput.value);
    if (date.getMonth() !== month) {
        alert("Please select a date in the chosen month.");
        return;
    }
    const dateStr = dateInput.value;
    if (!selectedDates.includes(dateStr)) {
        selectedDates.push(dateStr);
        selectedDates.sort();
        renderSelectedDates();
        renderStudentAttendanceCards();
    }
    dateInput.value = '';
}

function removeDate(dateStr) {
    selectedDates = selectedDates.filter(d => d !== dateStr);
    renderSelectedDates();
    renderStudentAttendanceCards();
}

function renderSelectedDates() {
    const container = document.getElementById('selectedDates');
    container.innerHTML = '';
    selectedDates.forEach(dateStr => {
        const span = document.createElement('span');
        span.textContent = new Date(dateStr).toLocaleDateString();
        const removeBtn = document.createElement('span');
        removeBtn.textContent = '×';
        removeBtn.className = 'remove-date';
        removeBtn.onclick = () => removeDate(dateStr);
        span.appendChild(removeBtn);
        container.appendChild(span);
    });
}

function renderStudentAttendanceTables() {
    const container = document.getElementById('studentsAttendanceContainer');
    container.innerHTML = '';
    students.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-attendance-card';
        card.style.margin = "32px auto";
        card.style.maxWidth = "700px";
        card.style.background = "#fff";
        card.style.boxShadow = "0 2px 16px rgba(0,0,0,0.08)";
        card.style.borderRadius = "12px";
        card.style.padding = "24px 24px 18px 24px";
        card.innerHTML = `
            <div class="student-attendance-header" style="font-size:1.3rem;color:#1bc9c9;margin-bottom:18px;">${student}</div>
            <table class="student-table" style="margin-bottom:18px;">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Present/Absent</th>
                        <th>Hours</th>
                        <th>Topic</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="tbody_${student.replace(/\s+/g, '_')}"></tbody>
            </table>
            <div class="student-attendance-actions" style="display:flex;gap:16px;align-items:center;">
                <input type="date" class="student-date-input" id="date_${student.replace(/\s+/g, '_')}" style="padding:6px 10px;">
                <button type="button" class="attendance-btn" style="padding:0.5rem 1.2rem;" onclick="addStudentDate('${student}')">Add Date</button>
                <button type="button" class="attendance-btn clear-btn" style="padding:0.5rem 1.2rem;" onclick="clearStudent('${student}')">Clear</button>
                <button type="button" class="attendance-btn" style="padding:0.5rem 1.2rem;" onclick="saveAndDownloadStudent('${student}')">Save & Download PDF</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderStudentAttendanceCards() {
    const container = document.getElementById('studentsAttendanceContainer');
    container.innerHTML = '';
    students.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-attendance-card';
        card.innerHTML = `
            <div class="student-attendance-header">${student}</div>
            <table class="student-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Present/Absent</th>
                        <th>Hours</th>
                        <th>Topic</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="tbody_${student.replace(/\s+/g, '_')}"></tbody>
            </table>
            <div class="student-attendance-actions">
                <input type="date" class="student-date-input" id="date_${student.replace(/\s+/g, '_')}">
                <button type="button" class="attendance-btn" onclick="addStudentDate('${student}')">Add Date</button>
                <button type="button" class="attendance-btn clear-btn" onclick="clearStudent('${student}')">Clear</button>
            </div>
        `;
        container.appendChild(card);
    });
}

window.addStudentDate = function(student) {
    const studentId = student.replace(/\s+/g, '_');
    const dateInput = document.getElementById(`date_${studentId}`);
    const dateStr = dateInput.value;
    if (!dateStr) return;
    const tbody = document.getElementById(`tbody_${studentId}`);
    // Prevent duplicate dates
    if ([...tbody.querySelectorAll('tr')].some(tr => tr.dataset.date === dateStr)) {
        alert("Date already added for this student.");
        return;
    }
    const tr = document.createElement('tr');
    tr.dataset.date = dateStr;
    const dateId = `${studentId}_${dateStr}`;
    tr.innerHTML = `
        <td>${new Date(dateStr).toLocaleDateString()}</td>
        <td>
            <select class="present-select" id="present_${dateId}" onchange="toggleInputs('${dateId}')">
                <option value="present">Present</option>
                <option value="absent">Absent</option>
            </select>
        </td>
        <td>
            <input type="number" min="0" step="0.25" class="hours-input" id="hours_${dateId}" placeholder="Hours">
        </td>
        <td>
            <input type="text" class="topic-input" id="topic_${dateId}" placeholder="Topic">
        </td>
        <td>
            <button type="button" class="attendance-btn clear-btn" onclick="removeStudentDate('${student}','${dateStr}')">Remove</button>
        </td>
    `;
    tbody.appendChild(tr);
    toggleInputs(dateId);
    dateInput.value = '';
};

window.removeStudentDate = function(student, dateStr) {
    const studentId = student.replace(/\s+/g, '_');
    const tbody = document.getElementById(`tbody_${studentId}`);
    const tr = [...tbody.querySelectorAll('tr')].find(tr => tr.dataset.date === dateStr);
    if (tr) tbody.removeChild(tr);
};

window.clearStudent = function(student) {
    const studentId = student.replace(/\s+/g, '_');
    const tbody = document.getElementById(`tbody_${studentId}`);
    tbody.innerHTML = '';
};

window.toggleInputs = function(dateId) {
    const presentSel = document.getElementById('present_' + dateId);
    const isPresent = presentSel && presentSel.value === 'present';
    const hoursInput = document.getElementById('hours_' + dateId);
    const topicInput = document.getElementById('topic_' + dateId);
    if (hoursInput) hoursInput.disabled = !isPresent;
    if (topicInput) topicInput.disabled = !isPresent;
    if (!isPresent) {
        if (hoursInput) hoursInput.value = '';
        if (topicInput) topicInput.value = '';
    }
};

function saveAndDownload() {
    let total = 0, attended = 0, absent = 0;
    const data = [];
    students.forEach(student => {
        const studentId = student.replace(/\s+/g, '_');
        const tbody = document.getElementById(`tbody_${studentId}`);
        if (!tbody) return;
        [...tbody.querySelectorAll('tr')].forEach(tr => {
            const dateStr = tr.dataset.date;
            const dateId = `${studentId}_${dateStr}`;
            const present = document.getElementById('present_' + dateId)?.value || 'absent';
            const hours = document.getElementById('hours_' + dateId)?.value || '';
            const topic = document.getElementById('topic_' + dateId)?.value || '';
            data.push({
                student,
                date: new Date(dateStr).toLocaleDateString(),
                present,
                hours: present === 'present' ? hours : '',
                topic: present === 'present' ? topic : ''
            });
            total++;
            if (present === 'present') attended++;
            else absent++;
        });
    });

    // Attendance summary (visual, left-aligned, with colored block)
    const percent = total ? Math.round((attended / total) * 100) : 0;
    document.getElementById('attendanceSummary').innerHTML = `
        <div style="display:flex;align-items:flex-start;gap:32px;justify-content:flex-start;">
            <div style="background:#fff;border-radius:12px;box-shadow:0 2px 16px rgba(0,0,0,0.08);padding:0 0 0 0;min-width:260px;">
                <div style="background:#222;color:#fff;padding:12px 0 8px 0;font-weight:bold;border-radius:12px 12px 0 0;text-align:center;letter-spacing:1px;">TOTAL ATTENDANCE</div>
                <div style="background:#1bc9c9;padding:0 0 0 0;border-radius:0 0 0 0;text-align:center;">
                    <div style="display:flex;flex-direction:column;align-items:center;padding:18px 0 0 0;">
                        <svg width="110" height="110">
                            <circle cx="55" cy="55" r="45" stroke="#e5d3ce" stroke-width="10" fill="none"/>
                            <circle cx="55" cy="55" r="45" stroke="#222" stroke-width="10" fill="none"
                                stroke-dasharray="${Math.PI*2*45}"
                                stroke-dashoffset="${Math.PI*2*45*(1-percent/100)}"
                                transform="rotate(-90 55 55)"/>
                            <text x="55" y="65" text-anchor="middle" font-size="2rem" fill="#222" font-family="sans-serif">${percent}%</text>
                        </svg>
                    </div>
                </div>
                <div style="background:#fff;color:#222;padding:18px 0 18px 0;border-radius:0 0 12px 12px;text-align:left;">
                    <div style="margin-bottom:10px;padding-left:24px;"><b>No. of Classes Conducted:</b> <span style="float:right;padding-right:24px;">${total}</span></div>
                    <div style="margin-bottom:10px;padding-left:24px;"><b>No. of Classes Attended:</b> <span style="float:right;padding-right:24px;">${attended}</span></div>
                    <div style="padding-left:24px;"><b>No. of Classes Absent:</b> <span style="float:right;padding-right:24px;">${absent}</span></div>
                </div>
            </div>
        </div>
    `;

    // Save as PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Attendance Report", 14, 18);
    doc.setFontSize(12);
    doc.text(`Month: ${document.getElementById('monthSelect').selectedOptions[0].text}`, 14, 28);
    doc.text(`Total Classes: ${total}`, 14, 36);
    doc.text(`Attended: ${attended}`, 14, 44);
    doc.text(`Absent: ${absent}`, 14, 52);
    doc.text(`Attendance: ${percent}%`, 14, 60);

    let y = 70;
    doc.setFontSize(11);
    doc.text("Student", 14, y);
    doc.text("Date", 50, y);
    doc.text("Status", 90, y);
    doc.text("Hours", 120, y);
    doc.text("Topic", 150, y);
    y += 6;
    data.forEach(row => {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(row.student, 14, y);
        doc.text(row.date, 50, y);
        doc.text(row.present, 90, y);
        doc.text(row.hours ? row.hours : "-", 120, y);
        doc.text(row.topic ? row.topic : "-", 150, y);
        y += 6;
    });

    doc.save("attendance_report.pdf");
}

window.saveAndDownloadStudent = function(student) {
    const studentId = student.replace(/\s+/g, '_');
    const tbody = document.getElementById(`tbody_${studentId}`);
    if (!tbody) return;
    let total = 0, attended = 0, absent = 0;
    const data = [];
    [...tbody.querySelectorAll('tr')].forEach(tr => {
        const dateStr = tr.dataset.date;
        const dateId = `${studentId}_${dateStr}`;
        const present = document.getElementById('present_' + dateId)?.value || 'absent';
        const hours = document.getElementById('hours_' + dateId)?.value || '';
        const topic = document.getElementById('topic_' + dateId)?.value || '';
        data.push({
            student,
            date: new Date(dateStr).toLocaleDateString(),
            present,
            hours: present === 'present' ? hours : '',
            topic: present === 'present' ? topic : ''
        });
        total++;
        if (present === 'present') attended++;
        else absent++;
    });

    const percent = total ? Math.round((attended / total) * 100) : 0;

    // Show summary (handwriting font, close button)
    const summaryDiv = document.getElementById('attendanceSummary');
    summaryDiv.innerHTML = `
        <button onclick="closeSummary()" style="position:absolute;top:10px;right:18px;font-size:2rem;background:none;border:none;color:#888;cursor:pointer;z-index:10;">&times;</button>
        <div style="font-family: 'Pacifico', cursive, sans-serif; font-size:1.5rem; color:#1bc9c9; margin-bottom:10px;">${student}'s Attendance Summary</div>
        <div style="display:flex;align-items:center;gap:24px;justify-content:center;">
            <div style="background:#fff;border-radius:12px;box-shadow:0 2px 16px rgba(0,0,0,0.08);padding:0;min-width:220px;">
                <div style="background:#222;color:#fff;padding:10px 0 8px 0;font-weight:bold;border-radius:12px 12px 0 0;text-align:center;letter-spacing:1px;font-family:'Pacifico',cursive;">SUMMARY</div>
                <div style="background:#1bc9c9;padding:0 0 0 0;border-radius:0 0 0 0;text-align:center;">
                    <div style="display:flex;flex-direction:column;align-items:center;padding:18px 0 0 0;">
                        <svg width="90" height="90">
                            <circle cx="45" cy="45" r="36" stroke="#e5d3ce" stroke-width="8" fill="none"/>
                            <circle cx="45" cy="45" r="36" stroke="#222" stroke-width="8" fill="none"
                                stroke-dasharray="${Math.PI*2*36}"
                                stroke-dashoffset="${Math.PI*2*36*(1-percent/100)}"
                                transform="rotate(-90 45 45)"/>
                            <text x="45" y="55" text-anchor="middle" font-size="1.3rem" fill="#222" font-family="Pacifico, cursive">${percent}%</text>
                        </svg>
                    </div>
                </div>
                <div style="background:#fff;color:#222;padding:14px 0 14px 0;border-radius:0 0 12px 12px;text-align:left;font-family:'Pacifico',cursive;">
                    <div style="margin-bottom:8px;padding-left:18px;"><b>Classes Conducted:</b> <span style="float:right;padding-right:18px;">${total}</span></div>
                    <div style="margin-bottom:8px;padding-left:18px;"><b>Classes Attended:</b> <span style="float:right;padding-right:18px;">${attended}</span></div>
                    <div style="padding-left:18px;"><b>Classes Absent:</b> <span style="float:right;padding-right:18px;">${absent}</span></div>
                </div>
            </div>
        </div>
    `;
    summaryDiv.style.display = "block";

    // Save as PDF for this student
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text(`Attendance Report - ${student}`, 14, 18);
    doc.setFontSize(12);
    doc.text(`Month: ${document.getElementById('monthSelect').selectedOptions[0].text}`, 14, 28);
    doc.text(`Total Classes: ${total}`, 14, 36);
    doc.text(`Attended: ${attended}`, 14, 44);
    doc.text(`Absent: ${absent}`, 14, 52);
    doc.text(`Attendance: ${percent}%`, 14, 60);

    let y = 70;
    doc.setFontSize(11);
    doc.text("Date", 14, y);
    doc.text("Status", 50, y);
    doc.text("Hours", 90, y);
    doc.text("Topic", 120, y);
    y += 6;
    data.forEach(row => {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(row.date, 14, y);
        doc.text(row.present, 50, y);
        doc.text(row.hours ? row.hours : "-", 90, y);
        doc.text(row.topic ? row.topic : "-", 120, y);
        y += 6;
    });

    doc.save(`attendance_report_${student.replace(/\s+/g, '_')}.pdf`);
}

window.closeSummary = function() {
    document.getElementById('attendanceSummary').style.display = "none";
};

function renderAttendanceTable() {
    const thead = document.querySelector('#attendanceTable thead tr');
    const tbody = document.getElementById('attendanceTableBody');
    // Clear previous
    thead.innerHTML = '<th>Student Name</th>';
    selectedDates.forEach(dateStr => {
        thead.innerHTML += `<th>${new Date(dateStr).toLocaleDateString()}</th>`;
    });
    tbody.innerHTML = '';
    students.forEach(student => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${student}</td>`;
        selectedDates.forEach(dateStr => {
            const dateId = `${student.replace(/\s+/g, '_')}_${dateStr}`;
            tr.innerHTML += `
                <td>
                    <select class="present-select" id="present_${dateId}" onchange="toggleInputs('${dateId}')">
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                    </select>
                    <br>
                    <input type="number" min="0" step="0.25" class="hours-input" id="hours_${dateId}" placeholder="Hours" style="margin-top:4px;width:60px;">
                    <input type="text" class="topic-input" id="topic_${dateId}" placeholder="Topic" style="margin-top:4px;width:90px;">
                </td>
            `;
        });
        tbody.appendChild(tr);
    });
    // Disable inputs for absent by default
    students.forEach(student => {
        selectedDates.forEach(dateStr => {
            const dateId = `${student.replace(/\s+/g, '_')}_${dateStr}`;
            toggleInputs(dateId);
        });
    });
}
