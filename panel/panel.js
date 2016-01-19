var allRequests = [],
    availableTypesOfRequests = ["POST"];

function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }
    //find & remove port number
    domain = domain.split(':')[0];
    return domain;
}

$(function() {
/////////////////////////////MAIN///////////////////////////////////////////////
  var requestPort = chrome.runtime.connect({ name: "request" });
  chrome.devtools.network.onRequestFinished.addListener(function(request) {
    if (availableTypesOfRequests.includes(request.request.method)) {
      requestPort.postMessage(request);

      var $div = $("<div class='request' id="+allRequests.length+"></div>");

      $div.append("<div class='head'><span class='head_request_method'>"+request.request.method+"</span><span>"+request.request.url.split('/')[2]+"</span> <span class='clear'><a href='#clear_request' class='.clear'>x</a></span></div>");
      $div.append("<div>"+request.request.url+"</div>");

      $(".requests_list").append($div);
      $(".request").filter(":even").addClass("_v2");

      allRequests.push(request);
    }
  });

  $(".requests_list").on("click", ".request", function(e) {
    e.preventDefault();
    $(".options").text(" ");

    var current_request = allRequests[parseInt($(this).prop("id"))],
        $form = $("<form></form>");
    $form.prop("id", $(this).prop("id"));

    var selectedQuery = chrome.runtime.connect({ name: "selected query" });
    selectedQuery.postMessage(current_request);

    var $formParams = $("<div class='form_params'></div>");
    $(".options").append("<a hover='#decodeURI' class='btn encodeDecodeURI' id='decodeURI'>decodeURI</a>");
    $(".options").append("<a hover='#encodeURI' class='btn encodeDecodeURI' id='encodeURI'>encodeURI</a>");

    function form_filling(myArray) {
      myArray.forEach(function(item, i, arr) {
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
    }

    switch (current_request.request.method.toString()) {
      case "GET":
//-----------------------------GET--------------------------------------------//
        $formParams.append("URL: <input class='url fvalue' value="+current_request.request.url.split("://")[0]+"://"+extractDomain(current_request.request.url)+"></input><br>");
        if (current_request.request.queryString) {
          form_filling(current_request.request.queryString);
        } else {
          $(".options").append("<h2>There are no params</h2>");
        }
        $(".options").append($form);
//----------------------------END-GET-----------------------------------------//
        break;
      case "POST":
//------------------------------POST------------------------------------------//
        $formParams.append("URL: <input class='url fvalue' value="+current_request.request.url+"></input><br>");
        if (current_request.request.postData.params) {
          form_filling(current_request.request.postData.params);
        } else {
          $(".options").append("<h2>There are no params</h2>");
        }
        $(".options").append($form);
//-----------------------------------END-POST---------------------------------//
        break;
      default:
        $(".options").append("<center><h1>This request type not supported</h1>"+JSON.stringify(current_request.request)+"</center>");
    }
  });

  $(".options").on("submit", "form", function(e) {
    e.preventDefault();
    var newTabPort = chrome.runtime.connect({ name: "new tab" }),
        new_url,
        params = [];
    $.each($(".options").find("form").find("input"), function(i, val) {
      params.push($(val).val());
    });
    new_url = params[0];
    params.shift();
    newTabPort.postMessage({
      params: params,
      request: allRequests[parseInt($(this).prop("id"))].request,
      new_url: new_url
    });
  });

////////////////////////////////////////////////////////////////////////////////

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

  $(".control_panel").on("click", "a#clear_all_requests", function(e) {
    e.preventDefault();
    $(".requests_list").find(".request").remove();
    allRequests = [];
  });

  $(".requests_list").on("click", ".head span.clear a", function(e) {
    e.preventDefault();
    $(this).parent().parent().parent().remove();
    $(".options").text(" ");
  });

  $(".availableTypeOfRequestIsPOST").change(function() {
    if ($(this).is(':checked')) {
      availableTypesOfRequests.push("POST");
    } else {
      availableTypesOfRequests.splice(availableTypesOfRequests.indexOf("POST"), 1);
    }
  });

  $(".availableTypeOfRequestIsGET").change(function() {
    if ($(this).is(':checked')) {
      availableTypesOfRequests.push("GET");
    } else {
      availableTypesOfRequests.splice(availableTypesOfRequests.indexOf("GET"), 1);
    }
  });

});
