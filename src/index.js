
  import { signInUser, signUpUser, signInWithGoogle } from ".auth.js";
  import { auth } from ".firebase-init.js";
  import { onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

  document.addEventListener("DOMContentLoaded", () => {
    const authTitle = document.getElementById("authTitle");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const loginEmailInput = document.getElementById("loginEmail");
    const loginPasswordInput = document.getElementById("loginPassword");
    const signupEmailInput = document.getElementById("signupEmail");
    const signupPasswordInput = document.getElementById("signupPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const showSignupLink = document.getElementById("showSignup");
    const showLoginLink = document.getElementById("showLogin");
    const forgotPasswordLink = document.getElementById("forgotPasswordLink");
    const messageContainer = document.getElementById("messageContainer");

    const toggleLoginPasswordBtn = document.getElementById('toggleLoginPassword');
    const toggleSignupPasswordBtn = document.getElementById('toggleSignupPassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');

    const googleSignInBtnLogin = document.getElementById('google-signin-btn-login');
    const googleSignInBtnSignup = document.getElementById('google-signin-btn-signup');

    function showMessage(message, type = 'danger') {
      const alertDiv = document.createElement('div');
      alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
      alertDiv.setAttribute('role', 'alert');
      alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;
      messageContainer.innerHTML = '';
      messageContainer.appendChild(alertDiv);
      setTimeout(() => {
        if (typeof bootstrap !== 'undefined' && bootstrap.Alert) {
          const bootstrapAlert = bootstrap.Alert.getInstance(alertDiv);
          if (bootstrapAlert) {
            bootstrapAlert.dispose();
          } else {
            alertDiv.remove();
          }
        } else {
          alertDiv.remove();
        }
      }, 5000);
    }

    function togglePasswordVisibility(passwordInput, toggleButton) {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleButton.querySelector('i').classList.replace('fa-eye-slash', 'fa-eye');
      } else {
        passwordInput.type = "password";
        toggleButton.querySelector('i').classList.replace('fa-eye', 'fa-eye-slash');
      }
    }

    // Attach toggle buttons
    toggleLoginPasswordBtn?.addEventListener('click', () => togglePasswordVisibility(loginPasswordInput, toggleLoginPasswordBtn));
    toggleSignupPasswordBtn?.addEventListener('click', () => togglePasswordVisibility(signupPasswordInput, toggleSignupPasswordBtn));
    toggleConfirmPasswordBtn?.addEventListener('click', () => togglePasswordVisibility(confirmPasswordInput, toggleConfirmPasswordBtn));

    function clearFormInputsAndResetVisibility() {
      [loginEmailInput, loginPasswordInput, signupEmailInput, signupPasswordInput, confirmPasswordInput].forEach(input => input.value = '');

      [
        [loginPasswordInput, toggleLoginPasswordBtn],
        [signupPasswordInput, toggleSignupPasswordBtn],
        [confirmPasswordInput, toggleConfirmPasswordBtn]
      ].forEach(([input, toggle]) => {
        if (input && toggle) {
          input.type = "password";
          const icon = toggle.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
          }
        }
      });
    }

    showSignupLink?.addEventListener("click", (e) => {
      e.preventDefault();
      authTitle.textContent = "Sign Up";
      loginForm.style.display = "none";
      signupForm.style.display = "block";
      messageContainer.innerHTML = '';
      clearFormInputsAndResetVisibility();
    });

    showLoginLink?.addEventListener("click", (e) => {
      e.preventDefault();
      authTitle.textContent = "Login";
      signupForm.style.display = "none";
      loginForm.style.display = "block";
      messageContainer.innerHTML = '';
      clearFormInputsAndResetVisibility();
    });

    loginBtn?.addEventListener("click", async () => {
      const email = loginEmailInput.value.trim();
      const password = loginPasswordInput.value.trim();
      if (!email || !password) {
        return showMessage("Please enter both email and password.");
      }
      try {
        await signInUser(email, password);
        window.location.href = "./portal/dashboard.html";
      } catch (err) {
        showMessage(err.message);
      }
    });

    signupBtn?.addEventListener("click", async () => {
      const email = signupEmailInput.value.trim();
      const password = signupPasswordInput.value.trim();
      const confirmPassword = confirmPasswordInput.value.trim();
      if (!email || !password || !confirmPassword) {
        return showMessage("Please fill in all fields.");
      }
      if (password !== confirmPassword) {
        return showMessage("Passwords do not match.");
      }
      if (password.length < 6) {
        return showMessage("Password should be at least 6 characters.");
      }
      try {
        await signUpUser(email, password);
        showMessage("Account created successfully! Please login.", "success");
        showLoginLink.click();
      } catch (err) {
        showMessage(err.message);
      }
    });

    forgotPasswordLink?.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = loginEmailInput.value.trim();
      if (!email) {
        return showMessage("Please enter your registered email.", "warning");
      }
      try {
        await sendPasswordResetEmail(auth, email);
        showMessage("Password reset email sent!", "success");
      } catch (err) {
        console.error(err);
        const errorMap = {
          "auth/user-not-found": "No account found with that email address.",
          "auth/invalid-email": "Please enter a valid email address.",
        };
        showMessage(errorMap[err.code] || "Failed to send password reset email.");
      }
    });

    googleSignInBtnLogin?.addEventListener("click", async () => {
      try {
        await signInWithGoogle();
      } catch (err) {
        showMessage(err.message);
      }
    });

    googleSignInBtnSignup?.addEventListener("click", async () => {
      try {
        await signInWithGoogle();
      } catch (err) {
        showMessage(err.message);
      }
    });

    // Redirect if already authenticated
    onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = "./portal/dashboard.html";
      }
    });
  });