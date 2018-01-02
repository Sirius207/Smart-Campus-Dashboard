
const BASE_URL = 'https://smartcampus.csie.ncku.edu.tw/smart_campus';

export function inputGroupTemplate(field) {
  return `
    <div class="form-row">
      <div class="inputGroup">
        <span class="input-label">${field.label}</span>
        <input class="input-box" type="${field.type}">
      </div>
    </div>
  `;
}

export function formTemplate(formMeta, fields) {
  return `
    <div id ="login-block" class="popover authForm-pop">
    <div class="popover-inner">
      <h2 class="form-title">Login</h2>
      <form action=${BASE_URL}/${formMeta.url}" method="${formMeta.method}">
        ${fields.map(inputGroupTemplate)}
        <div class="form-row">
          <button class="btn--submit">Submit</button>
        </div>
      </form>
    </div>
  </div>`;
}


export function loginFormTemplate() {
  const formData = {
    formMeta: {
      url: '/login',
      method: 'post',
    },
    fields: [
      { label: 'email', type: 'email' },
      { label: 'password', type: 'password' },
    ],
  };
  return formTemplate(formData.formMeta, formData.fields);
}

export function signupFormTemplate() {
  const formData = {
    formMeta: {
      url: '/signup',
      method: 'post',
    },
    fields: [
      { label: 'nickname', type: 'text' },
      { label: 'email', type: 'email' },
      { label: 'password', type: 'password' },
    ],
  };
  return formTemplate(formData.formMeta, formData.fields);
}

// Pop Menu of Avatar
// @Todo: Update links
export function userMenuTemplate() {
  return ` 
    <div class="popover avatar-pop">
      <div class="popover-inner">
        <ul class="list">
          <li class="list-item"><a class="btn" href="#">Profile</a></li>
          <li class="list-item"><a class="btn" href="#">Setting</a></li>
          <li class="list-item"><a class="btn" href="#">Logout </a></li>
        </ul>
      </div>
    </div>`;
}

// avatar image e.g. https://cdn-images-1.medium.com/fit/c/32/32/1*EhFnVbXnRoEzBI6u97Bt7w.jpeg" alt="avatar
export function authMenuTemplate(imageSrc) {
  return `
    <li class="nav-item">
      <button class="btn btn--reset">
        <div class="avatar">
          <img class="avatar-img" src="${imageSrc}">
        </div>
      </button>
    </li>`;
}

export default function unAuthMenuTemplate() {
  return `
    <li class="nav-item"><button id="btn--signup" class="btn btn--reset btn--icon">Signup</button></li>
    <li class="nav-item"><button id="btn--login" class="btn btn--reset btn--icon">Login</button></li>
  `;
}

