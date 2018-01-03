import $ from 'jquery';
import './authRender';

/**
 * Local Storage Access Method
 */
export function setUserData(userData) {
  localStorage.setItem('userData', JSON.stringify(userData));
}

export function deleteUserData() {
  localStorage.removeItem('userData');
}

export default function getUserData() {
  const userData = localStorage.getItem('userData');
  return JSON.parse(userData);
}

(() => {
  /**
   * Constants
   */
  const BASE_URL = 'https://smartcampus.csie.ncku.edu.tw/smart_campus';
  const ValidateFailMsg = 'Form validation fail';
  /**
   * Request Method
   */
  function request(uri, method, payload = null) {
    const HEADERS = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    };
    const content = { method, headers: HEADERS }; // credentials: 'include',
    if (payload) {
      content.body = $.param(payload);
    }
    return fetch(uri, content);
  }

  async function setDataByContentType(response) {
    const contentType = {
      json: 'application/json; charset=utf-8',
      text: 'text/html; charset=utf-8',
    };
    const resContentType = await response.headers.get('content-type');
    return (resContentType === contentType.json) ? response.json() : response.text();
  }

  async function getDataFromResponse(response) {
    const successStatus = [200, 201];
    if (!successStatus.includes(response.status)) {
      const errorMsg = await response.text();
      throw new Error(errorMsg);
    } else {
      return setDataByContentType(response);
    }
  }

  async function authProcess(route, body) {
    try {
      const response = await request(`${BASE_URL}/${route}/`, 'POST', body);
      const resData = await getDataFromResponse(response);
      if (typeof (resData) === 'object') {
        setUserData(resData.data);
      }
      window.location.reload();
    } catch (error) {
      $(`#errorMsg--${route}`).text(error.message);
      $(`#errorMsg--${route}`).addClass('active');
    }
  }

  async function signup(formData) {
    await authProcess('signup', formData);
  }

  async function login(formData) {
    await authProcess('login', formData);
  }

  async function logout() {
    await request(`${BASE_URL}/logout/`, 'POST');
    deleteUserData();
    window.location.reload();
  }

  /**
   * Form Method
   */
  function checkFormValue(form) {
    if (!form.checkValidity()) {
      form.reportValidity();
      throw new Error(ValidateFailMsg);
    }
  }

  function getFormData(formId, formFields) {
    const form = document.getElementById(formId);
    // validate form values
    checkFormValue(form);
    // get form values
    const formData = formFields.reduce((prevForm, field) => {
      const currentForm = prevForm;
      currentForm[field] = form[field].value;
      return currentForm;
    }, {});
    return formData;
  }
  /**
   * Bind Auth Click Events
   */
  $('#btn--login').click((event) => {
    event.preventDefault();
    const formId = 'form--login';
    const formFields = ['email', 'password'];
    const formData = getFormData(formId, formFields);
    login(formData);
  });

  $('#btn--signup').click((event) => {
    event.preventDefault();
    const formId = 'form--signup';
    const formFields = ['email', 'password', 'nickname'];
    const formData = getFormData(formId, formFields);
    signup(formData);
  });

  $('#btn--logout').click(logout);
})();
