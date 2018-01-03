import $ from 'jquery';

(() => {
  $('.avatar').click(() => {
    $('.avatar-pop').toggleClass('pop--active');
  });

  $('#menu--signup').click(() => {
    $('.login-pop').removeClass('pop--active');
    $('.signup-pop').toggleClass('pop--active');
  });

  $('#menu--login').click(() => {
    $('.signup-pop').removeClass('pop--active');
    $('.login-pop').toggleClass('pop--active');
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
