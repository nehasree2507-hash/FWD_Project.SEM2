const user = JSON.parse(localStorage.getItem('devtrack_loggedIn') || 'null');
  if (!user) window.location.href = 'login.html';
  function logout() { localStorage.removeItem('devtrack_loggedIn'); window.location.href = 'login.html'; }

  const defaultDevs = [
    { name:'P VENKATA RAMANA',  init:'PV', bg:'#dbeafe', tc:'#1e40af', id:'EMP-001', dept:'Engineering', role:'Senior Frontend Engineer', status:'Active',
      tasks:[{desc:'Auth token refresh on mobile',assigned:'Feb 24',due:'Mar 07',status:'In Progress'},{desc:'Dashboard CSV export feature',assigned:'Feb 26',due:'Mar 10',status:'Pending'},{desc:'Fix login redirect bug',assigned:'Feb 20',due:'Feb 28',status:'Completed'}],
      output:{reports:4,tickets:18,calls:7}, time:{hoursDay:8.2,hoursWeek:41,taskDuration:'3.5h avg'}, quality:{errorRate:'1.2%',feedback:'4.7/5',reviewScore:'92/100'}, attendance:{present:18,late:1,meetings:12}},
    { name:'P VENU GOPAL', init:'PV', bg:'#dcfce7', tc:'#166534', id:'EMP-002', dept:'Engineering', role:'Backend Engineer', status:'Active',
      tasks:[{desc:'Fix race condition in job queue',assigned:'Feb 22',due:'Mar 06',status:'In Progress'},{desc:'Update OpenAPI spec to v3',assigned:'Feb 28',due:'Mar 09',status:'In Progress'},{desc:'Database indexing optimization',assigned:'Feb 15',due:'Feb 25',status:'Completed'}],
      output:{reports:3,tickets:21,calls:5}, time:{hoursDay:8.0,hoursWeek:40,taskDuration:'4.1h avg'}, quality:{errorRate:'0.8%',feedback:'4.9/5',reviewScore:'96/100'}, attendance:{present:20,late:0,meetings:14}},
    { name:'P SWATHI', init:'PS', bg:'#fef9c3', tc:'#854d0e', id:'EMP-003', dept:'Engineering', role:'Full Stack Developer', status:'Blocked',
      tasks:[{desc:'Pagination bug on filtered views',assigned:'Feb 25',due:'Mar 07',status:'Blocked'},{desc:'Notification service refactor',assigned:'Mar 01',due:'Mar 12',status:'Pending'},{desc:'Write unit tests for auth module',assigned:'Feb 18',due:'Feb 27',status:'Completed'}],
      output:{reports:2,tickets:14,calls:6}, time:{hoursDay:7.5,hoursWeek:37,taskDuration:'5.0h avg'}, quality:{errorRate:'2.4%',feedback:'4.2/5',reviewScore:'74/100'}, attendance:{present:17,late:3,meetings:10}},
    { name:'A JAHNAVI',  init:'AJ', bg:'#fce7f3', tc:'#9d174d', id:'EMP-004', dept:'DevOps', role:'DevOps Engineer', status:'Active',
      tasks:[{desc:'Provision staging env access',assigned:'Mar 01',due:'Mar 06',status:'In Progress'},{desc:'CI/CD pipeline fix',assigned:'Feb 26',due:'Mar 02',status:'Completed'},{desc:'Infra update to staging',assigned:'Feb 20',due:'Feb 28',status:'Completed'}],
      output:{reports:5,tickets:10,calls:9}, time:{hoursDay:8.5,hoursWeek:42,taskDuration:'3.0h avg'}, quality:{errorRate:'0.5%',feedback:'4.8/5',reviewScore:'90/100'}, attendance:{present:20,late:0,meetings:15}},
    { name:'B PRAVEEN',  init:'BP', bg:'#ede9fe', tc:'#5b21b6', id:'EMP-005', dept:'Engineering', role:'Junior Frontend Engineer', status:'Review',
      tasks:[{desc:'Slack webhook front-end UI',assigned:'Mar 02',due:'Mar 10',status:'In Progress'},{desc:'Write test cases for auth flow',assigned:'Mar 01',due:'Mar 08',status:'Pending'},{desc:'Fix pagination on filtered view',assigned:'Feb 22',due:'Mar 05',status:'Completed'}],
      output:{reports:2,tickets:9,calls:4}, time:{hoursDay:7.0,hoursWeek:35,taskDuration:'4.8h avg'}, quality:{errorRate:'3.1%',feedback:'3.9/5',reviewScore:'66/100'}, attendance:{present:16,late:4,meetings:9}},
    { name:'ABHAY KUMAR',   init:'AK', bg:'#fee2e2', tc:'#991b1b', id:'EMP-006', dept:'QA', role:'QA Engineer', status:'Active',
      tasks:[{desc:'Regression test auth module',assigned:'Mar 03',due:'Mar 07',status:'In Progress'},{desc:'Review BPB PR DEV-105',assigned:'Mar 04',due:'Mar 06',status:'In Progress'},{desc:'QA test Slack webhook',assigned:'Feb 26',due:'Mar 04',status:'Completed'}],
      output:{reports:6,tickets:15,calls:8}, time:{hoursDay:8.0,hoursWeek:40,taskDuration:'2.8h avg'}, quality:{errorRate:'0.3%',feedback:'4.6/5',reviewScore:'88/100'}, attendance:{present:19,late:1,meetings:13}},
  ];

  // Always load from localStorage — if nothing saved yet, use default and save it
  if (!localStorage.getItem('devtrack_devs')) {
    localStorage.setItem('devtrack_devs', JSON.stringify(defaultDevs));
  }
  var devs = JSON.parse(localStorage.getItem('devtrack_devs'));

  function saveDevs() {
    localStorage.setItem('devtrack_devs', JSON.stringify(devs));
  }

  const sc = { 'Completed':'chip c-green','In Progress':'chip c-blue','Pending':'chip c-amber','Blocked':'chip c-red','Active':'chip c-green','Review':'chip c-amber' };

  let currentDev = null;

  function buildSidebar() {
    const devList = document.getElementById('devList');
    devList.innerHTML = '';
    devs.forEach((d, i) => {
      const el = document.createElement('div');
      el.className = 'dev-item' + (i === currentDev ? ' active' : '');
      el.innerHTML = `<div class="dev-av" style="background:${d.bg};color:${d.tc}">${d.init}</div>${d.name}`;
      el.onclick = () => { currentDev = i; buildSidebar(); render(); };
      devList.appendChild(el);
    });
  }

  buildSidebar();
  currentDev = 0;
  buildSidebar();
  render();

  function card(lbl, val) {
    return `<div class="info-card"><div class="lbl">${lbl}</div><div class="val">${val}</div></div>`;
  }

  function render() {
    const d = devs[currentDev];
    document.getElementById('mainContent').innerHTML = `

      <div class="dev-profile fade-in">
        <div class="dev-av-lg" style="background:${d.bg};color:${d.tc}">${d.init}</div>
        <div>
          <div class="dev-profile-name">${d.name}</div>
          <div class="dev-profile-role">${d.role} · ${d.dept}</div>
        </div>
        <span class="${sc[d.status]} status-badge">${d.status}</span>
        <button class="btn-edit-top" onclick="openEdit(currentDev)">✏️ Edit</button>
        <button class="btn-delete-top" onclick="deleteDev(currentDev)">🗑️ Delete</button>
      </div>

      <div class="sections-grid">

        <div class="cat-block cat-employee fade-in">
          <div class="cat-header">👤 Employee Info</div>
          <div class="cat-sub">Basic identification details — who this developer is, their role, and current sprint status.</div>
          <div class="cards-grid">
            ${card('Full Name', d.name)}
            ${card('Employee ID', d.id)}
            ${card('Department', d.dept)}
            ${card('Role', d.role)}
            ${card('Sprint', 'Sprint 24')}
            ${card('Status', `<span class="${sc[d.status]}">${d.status}</span>`)}
          </div>
        </div>

        <div class="cat-block cat-tasks fade-in">
          <div class="cat-header">✅ Tasks & Projects</div>
          <div class="cat-sub">All tasks assigned to this developer this sprint — what they're working on, when it's due, and where it stands.</div>
          <div class="tbl-wrap"><table>
            <thead><tr><th>Task</th><th>Assigned</th><th>Due</th><th>Status</th></tr></thead>
            <tbody>${d.tasks.map(t=>`<tr><td>${t.desc}</td><td style="color:#71717a">${t.assigned}</td><td style="color:#71717a">${t.due}</td><td><span class="${sc[t.status]}">${t.status}</span></td></tr>`).join('')}</tbody>
          </table></div>
        </div>

        <div class="cat-block cat-output fade-in">
          <div class="cat-header">📦 Output & Deliverables</div>
          <div class="cat-sub">Tangible work produced this sprint — reports filed, tickets closed, client calls handled, and overall task completion.</div>
          <div class="cards-grid">
            ${card('Reports Submitted', d.output.reports)}
            ${card('Tickets Resolved', d.output.tickets)}
            ${card('Client Calls', d.output.calls)}
            ${card('Tasks Completed', `${d.tasks.filter(t=>t.status==='Completed').length} / ${d.tasks.length}`)}
          </div>
        </div>

        <div class="cat-block cat-time fade-in">
          <div class="cat-header">⏱️ Time Metrics</div>
          <div class="cat-sub">How this developer is spending their time — daily hours logged, weekly total, and how long tasks typically take.</div>
          <div class="cards-grid">
            ${card('Avg Hours / Day', d.time.hoursDay + 'h')}
            ${card('Hours This Week', d.time.hoursWeek + 'h')}
            ${card('Avg Task Duration', d.time.taskDuration)}
            ${card('In Progress', d.tasks.filter(t=>t.status==='In Progress').length + ' tasks')}
          </div>
        </div>

        <div class="cat-block cat-quality fade-in">
          <div class="cat-header">🔍 Quality Check</div>
          <div class="cat-sub">Measures the accuracy and quality of work — error rate, how clients rate the output, and peer review scores.</div>
          <div class="cards-grid">
            ${card('Error Rate', d.quality.errorRate)}
            ${card('Client Feedback', d.quality.feedback)}
            ${card('Peer Review Score', d.quality.reviewScore)}
          </div>
        </div>

        <div class="cat-block cat-attend fade-in">
          <div class="cat-header">📅 Attendance & Engagement</div>
          <div class="cat-sub">Tracks presence and participation — days in office, late arrivals, and meetings attended this sprint.</div>
          <div class="cards-grid">
            ${card('Days Present', `${d.attendance.present} / 20`)}
            ${card('Late Arrivals', `<span style="color:${d.attendance.late>2?'#b91c1c':'#18181b'}">${d.attendance.late}</span>`)}
            ${card('Meetings Attended', d.attendance.meetings)}
          </div>
        </div>

      </div>
    `;
  }