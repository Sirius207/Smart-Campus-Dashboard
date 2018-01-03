import $ from 'jquery';
import './authRender';

const BASE_URL = 'https://smartcampus.csie.ncku.edu.tw/smart_campus';

const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
};

const ValidateFailMsg = 'Form validation fail';


// Local Storage Method
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
  function request(uri, method, payload = null) {
    const content = { method, headers: HEADERS }; // credentials: 'include',
    if (payload) {
      content.body = $.param(payload);
    }
    return fetch(uri, content);
  }

  async function getDataFromResponse(response) {
    if (response.status !== 200) {
      const errorMsg = await response.text();
      throw new Error(errorMsg);
    } else {
      return response.json() || response.text();
    }
  }

  async function authProcess(route, body) {
    try {
      const response = await request(`${BASE_URL}/${route}/`, 'POST', body);
      const userData = await getDataFromResponse(response);
      setUserData(userData);
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

  $('#btn--logout').click(()=>{
    logout();
  });
})();
