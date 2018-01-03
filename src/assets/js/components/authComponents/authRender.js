import $ from 'jquery';
import authComponents from './authComponents';
import getUserData from './auth';

(() => {
  function getAuthFormDom() {
    const userMenu = authComponents.userMenuTemplate();
    const setupForm = authComponents.setupFormTemplate();
    return (userMenu + setupForm);
  }

  function renderUserMenu() {
    // append menu button
    $('.navbar-nav').append(authComponents.authNavItemTemplate());
    // append menu block
    $('header').append(getAuthFormDom());
  }

  function getUnAuthFormDom() {
    const signupForm = authComponents.signupFormTemplate();
    const loginForm = authComponents.loginFormTemplate();
    return (signupForm + loginForm);
  }

  function renderGuessMenu() {
    // append menu button
    $('.navbar-nav').append(authComponents.unAuthNavItemTemplate());
    // append menu block
    $('header').append(getUnAuthFormDom());
  }

  /**
   * Check is login and render Nav Items.
   */
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
