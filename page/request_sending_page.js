$(function() {

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var $form = $("<form></form>");
    $form.prop({ "method": "POST", "action": request.request.url });
    for (var i = 1; i < request.params.length; i += 2) {
      $("<input>").prop({ "name": request.params[i-1], "value": request.params[i]}).appendTo($form);
    }
    $form.append("<input type='submit' value='Submit request'/>");
    $("body").append($form);
    $form.submit();

  });

});
