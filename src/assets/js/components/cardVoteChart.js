
import $ from 'jquery';

const QUESTION_URL = 'https://90828d2f.ngrok.io/students/';

function bindVoteClickEvent(cardDOM) {
  function redirectToVotePage(userData, questionId) {
    const voteUrl = `${QUESTION_URL}${userData.email}/${questionId}`;
    window.location.href = voteUrl;
  }

  function showLoginForm() {
    const errorMsgId = '#errorMsg--login';
    $('.login-pop').addClass('pop--active');
    $(errorMsgId).text('投票前請先登入!');
    $(errorMsgId).addClass('active');
  }

  cardDOM.addEventListener('click', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const isEmailValid = (userData && userData.email);
    if (isEmailValid) {
      const questionId = cardDOM.getAttribute('questionId');
      redirectToVotePage(userData, questionId);
    } else {
      console.log('ee');
      showLoginForm();
    }
  });
}

export function setVoteData(cardDOM) {
  return new Promise((resolve) => {
    $.get(`${QUESTION_URL}${cardDOM.getAttribute('questionId')}/statistics`, (getData) => {
      // already from vendors import Morris
      const voteChart = new Morris.Donut({
        element: cardDOM,
        data: getData.option,
      });
      const headerSmall = cardDOM.previousElementSibling;
      const headerLarger = headerSmall.previousElementSibling;
      headerLarger.innerText = `${getData.title}`;
      headerSmall.innerText = `${getData.question}`;
      bindVoteClickEvent(cardDOM);
      resolve(voteChart);
    });
  });
}

async function drawVoteSvg() {
  const questionCardList = $('[id=vote]').toArray();
  const promiseArray = questionCardList.map(setVoteData);
  return Promise.all(promiseArray);
}

export default drawVoteSvg;

