var allRequests = [];
var bool = false;

$(function() {

  var requestPort = chrome.runtime.connect({ name: "request" });
  chrome.devtools.network.onRequestFinished.addListener(function(request) {
    if (request.request.method === "POST") {
      requestPort.postMessage(request);

      var $div = $("<div class='request' id="+allRequests.length+"></div>");
      if (bool) {
        $div.addClass("_v2");
        bool = false;
      } else {
        bool = true;
      }
      $div.append("<div>"+request.request.url+"</div>");
      $div.append("<div style='color: rgba(0, 0, 0, 0.45);'>"+request.request.url.split('/')[2]+"</div>");

      $(".requests_list").append($div);

      allRequests.push(request);
    }
  });

  $(".requests_list").on("click", ".request", function(e) {
    e.preventDefault();
    $(".options").text(" ");

    var current_request = allRequests[parseInt($(this).prop("id"))],
        $form = $("<form></form>");
    $form.prop("id", $(this).prop("id"));

    var $formParams = $("<div class='form_params'></div>");
    current_request.request.postData.params.forEach(function(item, i, arr) {
      var $input = $("<input class='fname'></input>");
      $input.prop({ 'value': decodeURIComponent(item.name), "id": i });
      $formParams.append($input);

      var $input = $("<input class='fvalue'></input>");
      $input.prop({ 'value': decodeURIComponent(item.value), "id": i });
      $formParams.append($input);

      $formParams.append("<a href='#remove' class='remove_input' id="+i+">x</a>");
    });
    $form.append($formParams);
    var $myDiv = $("<div class='manipulators'></div>");
    $myDiv.append($("<a hover='#add_field' class='add_field btn'>Add field</a>"));
    $myDiv.append($("<input type='submit' class='send btn' value='Submit'>"));
    $form.append($myDiv);

    $(".options").append("<a hover='#decodeURI' class='btn encodeDecodeURI' id='decodeURI'>decodeURI</a>");
    $(".options").append("<a hover='#encodeURI' class='btn encodeDecodeURI' id='encodeURI'>encodeURI</a>");
    $(".options").append($form);
  });

  $(".options").on("click", "a#decodeURI", function(e) {
    e.preventDefault();
    $(".options").find(".form_params").find("input").each(function() {
      $(this).val(decodeURIComponent($(this).val()));
    });
  });

  $(".options").on("click", "a#encodeURI", function(e) {
    e.preventDefault();
    $(".options").find(".form_params").find("input").each(function() {
      $(this).val(encodeURIComponent($(this).val()));
    });
  });

  $(".options").on("click", "a.remove_input", function(e) {
    e.preventDefault();
    var id = $(this).prop("id");
    $(".options").find("input#"+id).remove();
    $(this).remove();
  });

  $(".options").on("click", "a.add_field", function(e) {
    e.preventDefault();
    var $form = $(".options").find("form"),
        $formParams = $(".options").find(".form_params"),
        newId = $form.find("input").length + 1;

    var $input = $("<input class='fname'></input>");
    $input.prop({ "id": newId });
    $formParams.append($input);

    var $input = $("<input class='fvalue'></input>");
    $input.prop({ "id": newId });
    $formParams.append($input);
    $formParams.append("<a href='#remove' class='remove_input' id="+newId+">x</a>");
  });

  $(".options").on("submit", "form", function(e) {
    e.preventDefault();
    var newTabPort = chrome.runtime.connect({ name: "new tab" }),
        params = [];
    $.each($(".options").find("form").find("input"), function(i, val) {
      params.push($(val).val());
    });
    newTabPort.postMessage({
      params: params,
      request: allRequests[parseInt($(this).prop("id"))].request
    });
  });

});
