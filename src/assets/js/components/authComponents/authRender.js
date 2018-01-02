import $ from 'jquery';
import authComponents from './authComponents';

(() => {
  function getUserData() {
    return localStorage.getItem('userData');
  }

  function renderUserMenu(userData) {
    // append menu button
    $('.navbar-nav').append(authComponents.authMenuItemTemplate());
    // append menu block
    $('header').append(authComponents.userMenuTemplate(userData));
  }

  function renderGuessMenu() {
    // append menu button
    $('.navbar-nav').append(authComponents.unAuthMenuItemTemplate());
    // append menu block
    const signupForm = authComponents.signupFormTemplate();
    const loginForm = authComponents.loginFormTemplate();
    const formGroup = signupForm + loginForm;
    $('header').append(formGroup);
  }

  function renderAuthComponents() {
    const userData = getUserData();
    if (userData) {
      renderUserMenu(userData);
    } else {
      renderGuessMenu();
    }
  }

  renderAuthComponents();
})();
