export function renderCourseChart(container, students) {
  const courseCounts = students.reduce((counts, student) => {
    counts[student.course] = (counts[student.course] || 0) + 1;
    return counts;
  }, {});

  const maxCount = Math.max(...Object.values(courseCounts), 1);
  container.innerHTML = '';

  Object.entries(courseCounts).forEach(([course, count]) => {
    const row = document.createElement('div');
    row.className = 'course-bar';
    row.innerHTML = `
      <span>${course}</span>
      <span><i style="width: ${(count / maxCount) * 100}%"></i></span>
      <strong>${count}</strong>
    `;
    container.appendChild(row);
  });

  if (!Object.keys(courseCounts).length) {
    container.innerHTML = '<p>No course data yet.</p>';
  }
}
