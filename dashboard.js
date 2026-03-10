function scrollTo(id) {
    event.preventDefault();
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  }

  // Auth guard
  const user = JSON.parse(localStorage.getItem('devtrack_loggedIn') || 'null');
  if (!user) { window.location.href = 'login.html'; }
  else { document.getElementById('welcomeUser').textContent = 'Hi, ' + user.name; }

  function logout() {
    localStorage.removeItem('devtrack_loggedIn');
    window.location.href = 'login.html';
  }

  // Dev summary + report data
  // Always load latest from localStorage
  var devs = JSON.parse(localStorage.getItem('devtrack_devs') || '[]');

  function saveDevs() {
    localStorage.setItem('devtrack_devs', JSON.stringify(devs));
  }

  function rating(score) {
    if (score >= 88) return `<span class="rating-pill r-excellent">Excellent</span>`;
    if (score >= 72) return `<span class="rating-pill r-good">Good</span>`;
    return `<span class="rating-pill r-review">Needs Review</span>`;
  }

  function attPct(present) { return Math.round((present/20)*100) + '%'; }
  function lateColor(late) { return late > 2 ? 'color:#b91c1c;font-weight:600' : ''; }

  function av(d) { return `<span class="mini-av-sm" style="background:${d.bg};color:${d.tc}">${d.init}</span>`; }

  // Dev summary
  function renderDevSummary() {
    const list = document.getElementById('devSummary');
    list.innerHTML = '';
    devs.forEach((d, i) => {
      list.innerHTML += `
        <div class="dev-summary-row">
          <div class="dev-summary-left">
            <div class="mini-av" style="background:${d.bg};color:${d.tc}">${d.init}</div>
            <div>
              <div class="dev-summary-name">${d.name}</div>
              <div class="dev-summary-role">${d.role}</div>
            </div>
          </div>
          <select class="status-select ${d.sc}" onchange="changeStatus(${i}, this.value)">
            <option value="Active"  ${d.status==='Active'  ? 'selected' : ''}>Active</option>
            <option value="Review"  ${d.status==='Review'  ? 'selected' : ''}>Review</option>
            <option value="Blocked" ${d.status==='Blocked' ? 'selected' : ''}>Blocked</option>
          </select>
        </div>`;
    });
  }

  function changeStatus(i, val) {
    const scMap = { Active: 'sp-active', Review: 'sp-review', Blocked: 'sp-blocked' };
    devs[i].status = val;
    devs[i].sc = scMap[val];
    saveDevs();
    renderDevSummary();
  }

  renderDevSummary();

  // Attendance table
  const attTbl = document.getElementById('attendanceTable');
  devs.forEach(d => {
    attTbl.innerHTML += `<tr>
      <td>${av(d)}${d.name}</td>
      <td style="color:#71717a">${d.role}</td>
      <td>${d.attendance.present} / 20</td>
      <td style="${lateColor(d.attendance.late)}">${d.attendance.late}</td>
      <td>${d.attendance.meetings}</td>
      <td><strong>${attPct(d.attendance.present)}</strong></td>
    </tr>`;
  });

  // Performance table
  const perfTbl = document.getElementById('performanceTable');
  devs.forEach(d => {
    perfTbl.innerHTML += `<tr>
      <td>${av(d)}${d.name}</td>
      <td style="color:#71717a">${d.role}</td>
      <td>${d.quality.errorRate}</td>
      <td>${d.quality.feedback}</td>
      <td>${d.quality.reviewScore}</td>
      <td>${rating(d.quality.score)}</td>
    </tr>`;
  });