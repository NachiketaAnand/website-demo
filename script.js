// Predefined credit values
const creditOptions = [1.5, 3, 4, 5];

// GPA grade mapping
const grades = {
  A: 10,
  "A-": 9,
  B: 8,
  "B-": 7,
  C: 6,
  "C-": 5,
  D: 4,
   "F":0,
};

// Dynamically generate course fields
const coursesContainer = document.getElementById("courses");
for (let i = 1; i <= 8; i++) {
  const courseDiv = document.createElement("div");
  courseDiv.classList.add("course");
  courseDiv.innerHTML = `
    <label>Course ${i}:</label>
    <select id="grade${i}">
      <option value="">Select Grade</option>
      ${Object.keys(grades)
        .map((grade) => `<option value="${grade}">${grade}</option>`)
        .join("")}
    </select>
    <select id="credit${i}">
      <option value="">Select Credit</option>
      ${creditOptions
        .map((credit) => `<option value="${credit}">${credit}</option>`)
        .join("")}
    </select>
  `;
  coursesContainer.appendChild(courseDiv);
}

// GPA calculation logic
document.getElementById("calculate").addEventListener("click", function () {
  let totalPoints = 0;
  let totalCredits = 0;

  for (let i = 1; i <= 8; i++) {
    const grade = document.getElementById(`grade${i}`).value;
    const credit = parseFloat(document.getElementById(`credit${i}`).value);

    if (grade && credit) {
      totalPoints += grades[grade] * credit;
      totalCredits += credit;
    }
  }

  const gpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;
  const resultElement = document.getElementById("result");
  resultElement.textContent = `Your GPA is: ${gpa}`;
  resultElement.style.opacity = 1; // Show result
});
