
    function goHome() { window.location.href = '../home.html'; }
    function goTeacher() { window.location.href = 'index.html'; }
    function goAttendance() { window.location.href = 'at.html'; }
    function goCalculator() { window.location.href = 'mon_cla/cal.html'; }
    // Demo class modal logic
function openDemoForm() {
    document.getElementById('demoFormModal').style.display = 'flex';
}
function closeDemoForm() {
    document.getElementById('demoFormModal').style.display = 'none';
}
function submitDemoForm(event) {
    event.preventDefault();
    var form = document.getElementById('demoForm');
    var data = new FormData(form);
    var req = {};
    for (const pair of data.entries()) {
        req[pair[0]] = pair[1];
    }
    req.timestamp = new Date().toLocaleString();
    // Save to localStorage
    let requests = JSON.parse(localStorage.getItem('demoRequests') || '[]');
    requests.push(req);
    localStorage.setItem('demoRequests', JSON.stringify(requests));
    alert('Thank you for registering for a demo class! Your request has been sent to SHOBS Academy.');
    closeDemoForm();
    form.reset();
}
