// All that does not belong to the functional

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
