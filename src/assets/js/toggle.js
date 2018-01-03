import $ from 'jquery';

(() => {
  function toggleAll(list) {
    $(list[0]).removeClass('pop--active');
    $(list[1]).toggleClass('pop--active');
  }

  $('#btn--topAvatar').click(() => {
    const list = ['.setup-pop', '.avatar-pop'];
    toggleAll(list);
  });

  $('#menu--signup').click(() => {
    const list = ['.login-pop', '.signup-pop'];
    toggleAll(list);
  });

  $('#menu--login').click(() => {
    const list = ['.signup-pop', '.login-pop'];
    toggleAll(list);
  });

  $('#btn--setup').click(() => {
    const list = ['.avatar-pop', '.setup-pop'];
    toggleAll(list);
  });

  $('.cards-pool--switch button').click(() => {
    $('.cards-pool').toggleClass('pool--active');
    $('.cards-pool--switch').toggleClass('switch--active');

    // change switch btn text of card pool
    const btnText = ($('.cards-pool').hasClass('pool--active')) ? 'v' : '+';
    $('.cards-pool--switch button').text(btnText);
  });
}
)();
