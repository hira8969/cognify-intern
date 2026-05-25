const chartColors = {
  active: '#22c55e',
  pending: '#f59e0b',
  graduated: '#2563eb',
  blocked: '#ef4444'
};

export const drawStatusChart = (stats) => {
  const canvas = document.getElementById('statusChart');

  if (!canvas) {
    return;
  }

  const context = canvas.getContext('2d');
  const size = Math.min(canvas.width, canvas.height);
  const center = size / 2;
  const radius = center - 18;
  const values = ['active', 'pending', 'graduated', 'blocked'].map((key) => ({
    key,
    value: stats[key] || 0
  }));
  const total = values.reduce((sum, item) => sum + item.value, 0);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = 26;
  context.lineCap = 'round';

  if (!total) {
    context.beginPath();
    context.strokeStyle = 'rgba(148, 163, 184, 0.22)';
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = '#64748b';
    context.font = '700 16px Inter';
    context.textAlign = 'center';
    context.fillText('No data', center, center + 5);
    return;
  }

  let startAngle = -Math.PI / 2;
  values.forEach((item) => {
    if (!item.value) {
      return;
    }

    const segmentAngle = (item.value / total) * Math.PI * 2;
    context.beginPath();
    context.strokeStyle = chartColors[item.key];
    context.arc(center, center, radius, startAngle, startAngle + segmentAngle);
    context.stroke();
    startAngle += segmentAngle;
  });

  context.fillStyle = '#14213d';
  context.font = '800 30px Inter';
  context.textAlign = 'center';
  context.fillText(String(total), center, center - 2);
  context.fillStyle = '#64748b';
  context.font = '700 12px Inter';
  context.fillText('students', center, center + 20);
};
