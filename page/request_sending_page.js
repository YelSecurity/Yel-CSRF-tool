$(function() {

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.request.method === "POST") {
      var $form = $("<form></form>");
      $form.prop({ "method": "POST", "action": request.new_url });
      for (var i = 1; i < request.params.length; i += 2) {
        $("<input>").prop({ "name": request.params[i-1], "value": request.params[i]}).appendTo($form);
      }
      $form.append("<input type='submit' value='Submit request'/>");
      $("body").append($form);
      $form.submit();
    }
    if (request.request.method === "GET") {
      var $link = $("<a>link</a>");
      $("body").append($link);
      $link.attr("href", request.new_url + "/?");
      for (var i = 1; i < request.params.length; i += 2) {
        $link.attr("href", $link.attr("href") + request.params[i-1] + "=" + request.params[i] + "&");
      }
      window.location = $link.prop("href");
    }
  });

});
