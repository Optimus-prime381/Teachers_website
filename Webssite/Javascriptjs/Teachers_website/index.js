        // Demo class modal logic (copied from home page)
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
            var body = "";
            for (const pair of data.entries()) {
                body += pair[0] + ": " + pair[1] + "\n";
            }
            window.location.href = "mailto:shoba.raaju@gmail.com"
                + "?subject=" + encodeURIComponent("Demo Class Registration")
                + "&body=" + encodeURIComponent(body);
            alert('Thank you for registering for a demo class! You will be contacted soon.');
            closeDemoForm();
            form.reset();
        }
        // Navbar logic (copied from home page)
        function navbarHandleRole(role) {
            if (role === 'student') {
                window.location.href = '../student.html';
            } else if (role === 'teacher') {
                // Already on teacher page
            }
        }
        function showNavbarParentPrompt() {
            document.getElementById('navbarParentPromptInline').style.display = 'inline-block';
        }
        function hideNavbarParentPrompt() {
            document.getElementById('navbarParentPromptInline').style.display = 'none';
        }
        function navbarSubmitParent() {
            var studentName = document.getElementById('navbarStudentNameInput').value.trim();
            if (studentName) {
                window.location.href = '../student.html?parent=1&student=' + encodeURIComponent(studentName);
            } else {
                alert('Please enter the student\'s name.');
            }
        }

                function goHome() {
            window.location.href = '../home.html';
        }
        function navbarHandleRole(role) {
            if (role === 'student') {
                window.location.href = '../student.html';
            }
        }