document.addEventListener("DOMContentLoaded", () => {
    let courseCount = 2; // Start with 1 course and we increment after
    const courseContainer = document.getElementById('courses');
    const addCourseButton = document.getElementById('addCourse');
    const resultDiv = document.getElementById('result');

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

    // Function to calculate GPA when the form is submitted
    document.getElementById('gpaForm').addEventListener('submit', (e) => {
        e.preventDefault();
        let totalCredits = 0;
        let totalPoints = 0;

        // Iterate through each course and calculate the total points and credits
        for (let i = 1; i < courseCount; i++) {
            const credit = parseFloat(document.getElementById(`credit${i}`).value);  // Get the selected credit
            const grade = parseFloat(document.getElementById(`grade${i}`).value);

            totalCredits += credit;
            totalPoints += grade * credit;
        }

        // Calculate GPA
        const gpa = totalPoints / totalCredits;

        // Display the result
        resultDiv.textContent = `Your GPA is: ${gpa.toFixed(2)}`;
    });
});
