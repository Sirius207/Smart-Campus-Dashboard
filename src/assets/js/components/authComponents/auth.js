import $ from 'jquery';
import './authRender';

const BASE_URL = 'https://smartcampus.csie.ncku.edu.tw/smart_campus';

const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
};

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
      throw new Error(response.status);
    } else {
      return response.json();
    }
  }

  async function authProcess(route, body) {
    try {
      const response = await request(`${BASE_URL}/${route}/`, 'POST', body);
      const userData = await getDataFromResponse(response);
      setUserData(userData);
    } catch (error) {
      $(`#errorMsg--${route}`).text('Incorrect username or password.');
      $(`#errorMsg--${route}`).addClass('active');
    }
  }

  function signup(formData) {
    authProcess('signup', formData);
  }

  function login(formData) {
    authProcess('login', formData);
  }

  function logout() {
    request(`${BASE_URL}/logout/`, 'POST');
    deleteUserData();
  }

  function getFormData(formId, formFields) {
    const form = document.getElementById(formId);
    // validate form values
    form.checkValidity();
    form.reportValidity();
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

})();
