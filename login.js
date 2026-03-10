// Switch between Login and Signup tabs
  function switchTab(tab) {
    if (tab === 'login') {
      document.querySelectorAll('.tab-btn')[0].classList.add('active');
      document.querySelectorAll('.tab-btn')[1].classList.remove('active');
      document.getElementById('loginSection').classList.add('active');
      document.getElementById('signupSection').classList.remove('active');
    } else {
      document.querySelectorAll('.tab-btn')[1].classList.add('active');
      document.querySelectorAll('.tab-btn')[0].classList.remove('active');
      document.getElementById('signupSection').classList.add('active');
      document.getElementById('loginSection').classList.remove('active');
    }
  }

  // Show error message under a field
  function showMsg(id, text) {
    document.getElementById(id).textContent = text;
  }

  // Clear all messages
  function clearMsgs() {
    document.querySelectorAll('.msg').forEach(function(m) { m.textContent = ''; });
    document.querySelectorAll('.alert').forEach(function(a) { a.className = 'alert'; a.textContent = ''; });
  }

  // Signup
  function handleSignup() {
    clearMsgs();

    var name    = document.getElementById('signupName').value.trim();
    var email   = document.getElementById('signupEmail').value.trim();
    var pass    = document.getElementById('signupPassword').value;
    var confirm = document.getElementById('signupConfirm').value;
    var valid   = true;

    if (name === '') {
      showMsg('signupNameMsg', 'Name is required.');
      valid = false;
    }
    if (email === '' || email.indexOf('@') === -1) {
      showMsg('signupEmailMsg', 'Enter a valid email.');
      valid = false;
    }
    if (pass.length < 6) {
      showMsg('signupPassMsg', 'Password must be at least 6 characters.');
      valid = false;
    }
    if (pass !== confirm) {
      showMsg('signupConfirmMsg', 'Passwords do not match.');
      valid = false;
    }
    if (!valid) return;

    // Save user to localStorage
    var users = JSON.parse(localStorage.getItem('devtrack_users') || '[]');
    for (var i = 0; i < users.length; i++) {
      if (users[i].email === email) {
        var a = document.getElementById('signupAlert');
        a.textContent = 'Email already registered. Please login.';
        a.className = 'alert error';
        return;
      }
    }

    users.push({ name: name, email: email, password: pass });
    localStorage.setItem('devtrack_users', JSON.stringify(users));

    var a = document.getElementById('signupAlert');
    a.textContent = 'Account created! You can now login.';
    a.className = 'alert success';

    setTimeout(function() { switchTab('login'); }, 1500);
  }

  // Login
  function handleLogin() {
    clearMsgs();

    var email = document.getElementById('loginEmail').value.trim();
    var pass  = document.getElementById('loginPassword').value;
    var valid = true;

    if (email === '') {
      showMsg('loginEmailMsg', 'Email is required.');
      valid = false;
    }
    if (pass === '') {
      showMsg('loginPassMsg', 'Password is required.');
      valid = false;
    }
    if (!valid) return;

    var users = JSON.parse(localStorage.getItem('devtrack_users') || '[]');
    var found = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i].email === email) {
        found = users[i];
        break;
      }
    }

    if (found === null) {
      var a = document.getElementById('loginAlert');
      a.textContent = 'No account found with this email.';
      a.className = 'alert error';
      return;
    }

    if (found.password !== pass) {
      var a = document.getElementById('loginAlert');
      a.textContent = 'Incorrect password. Please try again.';
      a.className = 'alert error';
      return;
    }

    // Login success
    localStorage.setItem('devtrack_loggedIn', JSON.stringify({ name: found.name, email: found.email }));
    var a = document.getElementById('loginAlert');
    a.textContent = 'Login successful! Redirecting...';
    a.className = 'alert success';

    setTimeout(function() { window.location.href = 'dashboard.html'; }, 1200);
  }