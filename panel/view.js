$(function() {
  $(".requests_list").css("height", $(window).height() - $(".requests_list").offset().top);
  $(window).resize(function() {
    $(".requests_list").css("height", $(window).height() - $(".requests_list").offset().top);
  });


  $('.left').resizable({
    alsoResizeReverse: ".right",
    handles: 'e, w'
  });
});
