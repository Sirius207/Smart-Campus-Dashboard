import $ from 'jquery';

(() => {
  $('.avatar').click(() => {
    $('.avatar-pop').toggleClass('pop--active');
  });

  $('.cards-pool--switch button').click(() => {
    $('.cards-pool').toggleClass('pool--active');
    $('.cards-pool--switch').toggleClass('switch--active');

    // change switch btn text
    const btnText = ($('.cards-pool').hasClass('pool--active')) ? 'v' : '+';
    $('.cards-pool--switch button').text(btnText);
  });
}
)();
