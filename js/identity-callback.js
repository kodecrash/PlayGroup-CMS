/* ==========================================================================
   NETLIFY IDENTITY CALLBACK HANDLER
   Handles invite, password recovery and email confirmation links sent by
   Netlify Identity (e.g. https://site/#invite_token=...), then sends the
   user on to the CMS dashboard at /admin/.
   ========================================================================== */

import {
  handleAuthCallback,
  acceptInvite,
  updateUser,
  AuthError,
} from 'https://esm.sh/@netlify/identity@2';

const AUTH_HASH = /(invite_token|recovery_token|confirmation_token|email_change_token|access_token|error)=/;

function goToAdmin() {
  window.location.href = '/admin/';
}

function showPasswordModal({ title, subtitle, buttonLabel, onSubmit }) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="identityModalTitle">
      <h2 class="modal-title" id="identityModalTitle"></h2>
      <p class="modal-subtitle"></p>
      <form novalidate>
        <div class="form-group">
          <label class="form-label" for="identityPassword">New password</label>
          <input class="form-input" id="identityPassword" type="password" minlength="8" autocomplete="new-password" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="identityPasswordConfirm">Confirm password</label>
          <input class="form-input" id="identityPasswordConfirm" type="password" minlength="8" autocomplete="new-password" required>
        </div>
        <p class="identity-error" role="alert" style="color: var(--coral-hover); min-height: 1.25rem; margin-bottom: 1rem;"></p>
        <button class="btn btn-coral" type="submit" style="width: 100%;"></button>
      </form>
    </div>`;

  overlay.querySelector('.modal-title').textContent = title;
  overlay.querySelector('.modal-subtitle').textContent = subtitle;
  const button = overlay.querySelector('button');
  button.textContent = buttonLabel;
  const errorEl = overlay.querySelector('.identity-error');
  const form = overlay.querySelector('form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const password = form.querySelector('#identityPassword').value;
    const confirm = form.querySelector('#identityPasswordConfirm').value;

    if (password.length < 8) {
      errorEl.textContent = 'Password must be at least 8 characters.';
      return;
    }
    if (password !== confirm) {
      errorEl.textContent = 'Passwords do not match.';
      return;
    }

    errorEl.textContent = '';
    button.disabled = true;
    button.textContent = 'Please wait…';
    try {
      await onSubmit(password);
      goToAdmin();
    } catch (error) {
      errorEl.textContent =
        error instanceof AuthError && error.status === 401
          ? 'This link has expired. Ask an administrator to send a new invite.'
          : (error && error.message) || 'Something went wrong. Please try again.';
      button.disabled = false;
      button.textContent = buttonLabel;
    }
  });

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));
  form.querySelector('#identityPassword').focus();
}

async function processCallback() {
  if (!AUTH_HASH.test(window.location.hash)) return;

  try {
    const result = await handleAuthCallback();
    if (!result) return;

    switch (result.type) {
      case 'invite':
        showPasswordModal({
          title: 'Welcome to Star Kids CMS',
          subtitle: 'Choose a password to finish setting up your account.',
          buttonLabel: 'Create account',
          onSubmit: (password) => acceptInvite(result.token, password),
        });
        break;
      case 'recovery':
        showPasswordModal({
          title: 'Reset your password',
          subtitle: 'Enter a new password for your CMS account.',
          buttonLabel: 'Save password',
          onSubmit: (password) => updateUser({ password }),
        });
        break;
      default:
        // Email confirmation, email change or OAuth login: the user is signed in.
        goToAdmin();
    }
  } catch (error) {
    console.error('Netlify Identity callback failed:', error);
    alert('This link is invalid or has expired. Please ask an administrator for a new invite.');
  }
}

processCallback();
