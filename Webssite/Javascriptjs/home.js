        // Show modal on load
        window.onload = function() {
            document.getElementById('roleModal').style.display = 'flex';
        };

        function handleRole(role) {
            if (role === 'student') {
                window.location.href = 'student.html'; // Change to your student site
            } else if (role === 'teacher') {
                window.location.href = 'Teachers_website/index.html'; // Correct path to teacher portal
            } else if (role === 'parent') {
                document.getElementById('rolePrompt').style.display = 'none';
                document.getElementById('parentPrompt').style.display = 'block';
            }
        }

        function submitParent() {
            var studentName = document.getElementById('studentNameInput').value.trim();
            if (studentName) {
                // You can pass the student name as a query param if needed
                window.location.href = 'student.html?parent=1&student=' + encodeURIComponent(studentName);
            } else {
                alert('Please enter the student\'s name.');
            }
        }

        function closeModal() {
            document.getElementById('roleModal').style.display = 'none';
        }

        // Navbar modal logic
        function openNavbarModal() {
            document.getElementById('navbarModalBg').style.display = 'flex';
            document.getElementById('navbarRolePrompt').style.display = 'block';
            document.getElementById('navbarParentPrompt').style.display = 'none';
        }
        function closeNavbarModal() {
            document.getElementById('navbarModalBg').style.display = 'none';
        }
        function navbarHandleRole(role) {
            if (role === 'student') {
                window.location.href = 'student.html';
            } else if (role === 'teacher') {
                window.location.href = 'Main/Teachers_website/index.html'; // Correct path to teacher portal
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
                window.location.href = 'student.html?parent=1&student=' + encodeURIComponent(studentName);
            } else {
                alert('Please enter the student\'s name.');
            }
        }

        // Demo class modal logic
        function openDemoForm() {
            document.getElementById('demoFormModal').style.display = 'flex';
        }
        function closeDemoForm() {
            document.getElementById('demoFormModal').style.display = 'none';
        }
        function submitDemoForm(event) {
            event.preventDefault();
            // Collect form data
            var form = document.getElementById('demoForm');
            var data = new FormData(form);
            var body = "";
            for (const pair of data.entries()) {
                body += pair[0] + ": " + pair[1] + "\n";
            }
            // Send email using mailto (opens user's email client)
            window.location.href = "mailto:shoba.raaju@gmail.com"
                + "?subject=" + encodeURIComponent("Demo Class Registration")
                + "&body=" + encodeURIComponent(body);

            alert('Thank you for registering for a demo class! You will be contacted soon.');
            closeDemoForm();
            form.reset();
        }