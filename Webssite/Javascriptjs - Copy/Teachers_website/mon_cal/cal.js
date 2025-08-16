        function goHome() { window.location.href = '../../home.html'; }
        function goTeacher() { window.location.href = '../index.html'; }
        function goAttendance() { window.location.href = '../at.html'; }
        function goZoom() { window.location.href = '../zoom.html'; }

        // Dummy summary data for demo (replace with real data integration)
        const studentSummaries = {
            "Aayansh": { percent: 95, attended: 19, total: 20, absent: 1 },
            "Dhriti": { percent: 90, attended: 18, total: 20, absent: 2 },
            "Arya": { percent: 100, attended: 20, total: 20, absent: 0 }
            // ...add more as needed
        };

        // Month select
        (function populateMonthSelect() {
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
        })();

        // Attendance-like date/row logic
        let selectedDates = [];
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
                renderDatesTable();
            }
            dateInput.value = '';
        }
        function removeDate(dateStr) {
            selectedDates = selectedDates.filter(d => d !== dateStr);
            renderDatesTable();
        }
        function renderDatesTable() {
            // Show selected dates as tags
            const selDiv = document.getElementById('selectedDates');
            selDiv.innerHTML = '';
            selectedDates.forEach(dateStr => {
                const span = document.createElement('span');
                span.style.cssText = "background:#1bc9c9;color:#fff;padding:4px 10px;border-radius:4px;margin-right:6px;font-family:'Pacifico',cursive;";
                span.textContent = new Date(dateStr).toLocaleDateString();
                const btn = document.createElement('button');
                btn.textContent = '×';
                btn.className = 'remove-date-btn';
                btn.onclick = () => removeDate(dateStr);
                span.appendChild(btn);
                selDiv.appendChild(span);
            });
            // Render table rows
            const tbody = document.getElementById('calcTableBody');
            tbody.innerHTML = '';
            selectedDates.forEach(dateStr => {
                const rowId = `row_${dateStr}`;
                tbody.innerHTML += `
                    <tr id="${rowId}">
                        <td>${new Date(dateStr).toLocaleDateString()}</td>
                        <td><input type="number" min="0" step="0.25" class="hours-input" style="width:70px;font-family:'Pacifico',cursive;"></td>
                        <td><input type="text" class="topic-input" style="width:120px;font-family:'Pacifico',cursive;"></td>
                        <td><button type="button" class="remove-date-btn" onclick="removeDate('${dateStr}')">×</button></td>
                    </tr>
                `;
            });
        }

        // Show student summary if available
        function showStudentSummary() {
            const name = document.getElementById('studentName').value.trim();
            const summaryDiv = document.getElementById('studentSummary');
            if (studentSummaries[name]) {
                const s = studentSummaries[name];
                summaryDiv.innerHTML = `
                    <div style="font-size:1.2rem;">
                        Attendance: <b style="color:#1bc9c9;">${s.percent}%</b><br>
                        Attended: <b>${s.attended}</b> / <b>${s.total}</b> &nbsp; Absent: <b>${s.absent}</b>
                    </div>
                `;
                summaryDiv.style.display = 'block';
            } else {
                summaryDiv.style.display = 'none';
            }
        }

        function calculateFee(event) {
            event.preventDefault();
            const name = document.getElementById('studentName').value.trim();
            const feePerHour = parseFloat(document.getElementById('feePerHour').value);
            if (!name || isNaN(feePerHour) || selectedDates.length === 0) return;
            // Sum hours
            let totalHours = 0;
            let topics = [];
            selectedDates.forEach(dateStr => {
                const row = document.getElementById(`row_${dateStr}`);
                if (row) {
                    const hours = parseFloat(row.querySelector('.hours-input').value) || 0;
                    const topic = row.querySelector('.topic-input').value || '';
                    totalHours += hours;
                    topics.push(`${new Date(dateStr).toLocaleDateString()}: ${topic}`);
                }
            });
            const total = totalHours * feePerHour;

            // Show summary block (like attendance page)
            document.getElementById('calcResult').innerHTML =
                `<button onclick="closeSummary()" class="close-summary-btn">&times;</button>
                <div class="summary-block">
                    <div class="summary-block-header">MONTHLY FEE SUMMARY</div>
                    <div class="summary-block-body">
                        <div style="display:flex;flex-direction:column;align-items:center;padding:18px 0 0 0;">
                            <svg width="90" height="90">
                                <circle cx="45" cy="45" r="36" stroke="#e5d3ce" stroke-width="8" fill="none"/>
                                <circle cx="45" cy="45" r="36" stroke="#222" stroke-width="8" fill="none"
                                    stroke-dasharray="${Math.PI*2*36}"
                                    stroke-dashoffset="0"
                                    transform="rotate(-90 45 45)"/>
                                <text x="45" y="55" text-anchor="middle" font-size="1.3rem" fill="#222" font-family="Pacifico, cursive">₹${total}</text>
                            </svg>
                        </div>
                    </div>
                    <div class="summary-block-footer">
                        <div style="margin-bottom:8px;padding-left:18px;"><b>Student:</b> <span style="float:right;padding-right:18px;">${name}</span></div>
                        <div style="margin-bottom:8px;padding-left:18px;"><b>Month:</b> <span style="float:right;padding-right:18px;">${document.getElementById('monthSelect').selectedOptions[0].text}</span></div>
                        <div style="margin-bottom:8px;padding-left:18px;"><b>Total Hours:</b> <span style="float:right;padding-right:18px;">${totalHours}</span></div>
                        <div style="margin-bottom:8px;padding-left:18px;"><b>Fee per Hour:</b> <span style="float:right;padding-right:18px;">₹${feePerHour}</span></div>
                        <div style="margin-bottom:8px;padding-left:18px;"><b>Topics:</b> <span style="float:right;padding-right:18px;"></span></div>
                        <div style="padding-left:32px;font-size:1rem;color:#a98c7c;">${topics.join('<br>')}</div>
                    </div>
                </div>
                <button class="calc-btn" style="margin-top:18px;" onclick="downloadPDF('${name}',${total},${totalHours},${feePerHour})">Download PDF</button>
                <button class="calc-btn-recalc" onclick="recalculate()">Recalculate</button>
                `;
            document.getElementById('calcResult').style.display = 'block';
        }

        function closeSummary() {
            document.getElementById('calcResult').style.display = 'none';
        }

        function recalculate() {
            document.getElementById('calcForm').reset();
            selectedDates = [];
            renderDatesTable();
            document.getElementById('calcResult').style.display = 'none';
            document.getElementById('studentSummary').style.display = 'none';
        }

        function downloadPDF(name, total, totalHours, feePerHour) {
            // Use window.jspdf.jsPDF for compatibility
            const doc = new window.jspdf.jsPDF();
            doc.setFont("helvetica", "normal");
            doc.setFontSize(18);
            doc.text(`Monthly Fee Report - ${name}`, 14, 18);
            doc.setFontSize(12);
            doc.text(`Month: ${document.getElementById('monthSelect').selectedOptions[0].text}`, 14, 28);
            doc.text(`Total Hours: ${totalHours}`, 14, 36);
            doc.text(`Fee per Hour: ₹${feePerHour}`, 14, 44);
            doc.text(`Total Fee: ₹${total}`, 14, 52);

            let y = 62;
            doc.setFontSize(11);
            doc.text("Date", 14, y);
            doc.text("Hours", 50, y);
            doc.text("Topic", 80, y);
            y += 6;
            selectedDates.forEach(dateStr => {
                const row = document.getElementById(`row_${dateStr}`);
                if (row) {
                    const hours = row.querySelector('.hours-input').value || '-';
                    const topic = row.querySelector('.topic-input').value || '-';
                    doc.text(new Date(dateStr).toLocaleDateString(), 14, y);
                    doc.text(hours.toString(), 50, y);
                    doc.text(topic, 80, y);
                    y += 6;
                }
            });

            doc.save(`monthly_fee_report_${name.replace(/\s+/g, '_')}.pdf`);
        }

        // Expose for inline HTML
        window.addDate = addDate;
        window.removeDate = removeDate;
        window.showStudentSummary = showStudentSummary;
        window.closeSummary = closeSummary;
        window.downloadPDF = downloadPDF;
        window.recalculate = recalculate;