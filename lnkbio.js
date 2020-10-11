if($(document).height() <= $(window).height()) {
  $('footer').addClass("position-absolute")
}
$(window).on('resize', function(){
  footerPositionUpdate()
});

function footerPositionUpdate(){
  $('footer').removeClass("position-absolute")
  if($(document).height() <= $(window).height()) {
    $('footer').addClass("position-absolute")
  } else {
    $('footer').removeClass("position-absolute")
  }
}

// Manage No Feature Access Modal
$('#PC_featureNoPROModal').on('show.bs.modal', function (e) {
  var el = $(e.relatedTarget)
  var title = el.data('title')
  $('#PC_featureNoPROModalLabel').text(title)
})


// Manage Modals Refreshes
$('.modal').on('show.bs.modal', function (e) {
  $(e.target).find('.alert-danger').not(".modal-errors-builtin").remove()
  $(e.target).find('.modal-errors').addClass("d-none")
})

$('.lnk-copy').bind('click', function(e) {
  var btn = $(e.target)
  var url = btn.data('lnk')
  $("#lnk-copy-source").show()
  var hidden = $("#lnk-copy-source")[0]
  $(hidden).val(url)
  

  hidden.setSelectionRange(0, hidden.value.length + 1);
  hidden.select();
  hidden.setSelectionRange(0, 99999);
  try {
    var success = document.execCommand('copy');
    if (success) {
      $("#lnk-copy-source").hide()
      showToast("Lnk Copied","Your Lnk has been copied successfully.",true)
    } else { $("#lnk-copy-source").hide()}
  } catch (err) { $("#lnk-copy-source").hide() }
  $("#lnk-copy-source").hide()
});

// Manage Lnk.Bio Change URL
$('#LB_LnkBioURLModal').on('show.bs.modal', function (e) {
  var url = $(e.relatedTarget).data('url')
  $("#LB_LnkBioURLField").val(url)
  $("#LB_LnkBioURLOld").val(url)
})
// Save Lnk.Bio URL
$('#LB_LnkBioURLConfirm').bind('click', function(e) {
    modalHideErrors($('#LB_LnkBioURLModal'))
    var url = $("#LB_LnkBioURLField").val()
    var old_url = $("#LB_LnkBioURLOld").val()
    if(url != old_url) {
      $.ajax({
        type: "POST",
        url: "/ajax/",
        data: {
          ACTION: "LB_updateLnkBioURL",
          url: url,
          old_url: old_url
        }, success: function (data) {
          if(data.status) {
            var title = "Lnk.Bio URL Updated"
            var body = "Your Lnk.Bio URL has been changed correctly."
            // Update Link
            $(".lnkbiourl").text(data.data.url)
            $('.lnkbio-urlbutton').data('url',data.data.url)
            $('.lnkbio-preview').attr("href",data.data.url)
            $('#LB_LnkBioURLModal').modal('hide')
          } else {
            modalShowErrors($('#LB_LnkBioURLModal'),data.error)
          }
          showToast(title,body)
        },
        dataType: "json"
      })
    }
});

// Manage Long URLs
$('#ST_ShortURLModal').on('show.bs.modal', function (e) {
  var url = $(e.relatedTarget).data('url')
    $("#ST_ShortURLLong").text(url)
})

function showToast(title,body,is_active) {
  if(typeof(is_active) == "undefined") 
    return;
  if(!title) 
    return
  var last_char = title.charAt(title.length-1);
  if(last_char.match(['A-Za-z']))
    title = title+"."
  $('#toast-main > .toast-header > strong').text(title)
  $('#toast-main').toast('show')
  $('#toast-main').removeClass('d-none')
}
$('#toast-main').on('hidden.bs.toast ', function () {
  $('#toast-main').addClass('d-none')
})


function showAlert(parent_el,text,clear_container,additional_class) {
  if(!text || !parent_el) return

  var last_char = text.charAt(text.length-1);
  if(last_char.match(['A-Za-z']))
    text = text+"."


  if(typeof(additional_class) == "undefined") {
    additional_class = "";
  }

  if(typeof(clear_container) == "undefined") {
    clear_container = true;
  }
  if(clear_container) {
    parent_el.children('.alert').remove()
  }
  var html = '<div class="alert alert-danger m-0 p-2 '+additional_class+'" role="alert">'+
  text+
  '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
  '<span aria-hidden="true">&times;</span>'+
  '</button>'+
  '</div>';
  parent_el.append(html)
}



  function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  function humanDate(date) {
    var date = new Date(date);  
    var month = date.toLocaleString('default', { month: 'short' });
    return date.getDate()+" "+month;
  }

  function hours24to12(i,minutes) {
    if(i == 0) {
      american_hour = 12 
      label = "AM"
    } else if(i<12) {
      american_hour = i 
      label = "AM"
    } else if(i == 12) {
      american_hour = i 
      label = "PM"
    } else {
      american_hour = i-12
      label = "PM"
    }
    if(typeof(minutes) != "undefined") {
      american_hour += ":"+pad(minutes,2)
    }
    return american_hour+" "+label;
  }



  /* Utility function to convert a canvas to a BLOB */
  function dataURLToBlob(dataURL) {
    var BASE64_MARKER = ";base64,";
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(",");
      var contentType = parts[0].split(":")[1];
      var raw = parts[1];

      return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(":")[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
  }

// Manage the Spinner
function LN_initSpinner() {
  var html = '<div class="spinner-border text-primary" role="status">'+
  '<span class="sr-only">Loading...</span>'+
  '</div>';
  $('#add-new-link-form .form-feedback').html(html)
}
function LN_removeSpinner() {
  $('#add-new-link-form .form-feedback .spinner-border').remove()
}

// Manage the Spinner
// @el is a jquery object of the form
function form_InitSpinner(el) {
  el.find('.spinner-container').removeClass('d-none')
}
function form_RemoveSpinner(el) {
  el.find('.spinner-container').addClass('d-none')
}

function modal_InitSpinner(el) {
  el.find('.spinner-border').removeClass('d-none')
}
function modal_RemoveSpinner(el) {
  el.find('.spinner-border').addClass('d-none')
}

// Manage Modal Errors
function modalHideErrors(modal) {
  modal.find('.modal-errors').addClass('d-none')
}
function modalShowErrors(modal,error) {
  modal.find('.modal-errors').removeClass('d-none')
  try {
    var last_char = error.slice(-1)
    if(last_char.match(/[a-zA-Z]+/))
      error = error+'.'
  } catch (err) {}
  modal.find('.modal-errors .alert').html(error)
}
// Manage Timezone
$('.modal').on('show.bs.modal', function (e) {
  $(e.relatedTarget).find('.modal-errors').addClass('d-none')
})

// Manage Profile Picture Error
function checkImageError(e) {
  var img_el = $(e.target)
  var el_id = img_el.attr("id")
  if(el_id != "profile_picture_catch_error") return
  var username = img_el.data('username')

  if(img_el.hasClass('pb-profilepic'))  { // Public Error Management
     $.ajax({
      el_id: el_id,
      type: "POST",
      url: "/ajax/",
      data: {
        ACTION: "PB_logError",
        username: username
      },
      dataType: "json"
    })
    return
  }
  // All other cases
  $.ajax({
    el_id: el_id,
    url: "https://www.instagram.com/"+username+"/?__a=1"
  }).done(function(data) {
    if(typeof(data.graphql.user) == "undefined")
      return
    $.ajax({
      el_id: el_id,
      type: "POST",
      url: "/ajax/",
      data: {
        ACTION: "updateUsernameFromJS",
        user: data.graphql.user
      }, success: function (data) {
        if(data.status) {
          var title = "Username Updated"
          var body = "Your Username has been changed correctly."
          $('#profile_picture_catch_error').attr('src',data.data.profile_pic)
          $("#header-username").text("@"+data.data.username)
        } else {
          /* Todo */
        }
        showToast(title,body)
      },
      dataType: "json"
    })
  }).fail(function(data) {
    switch(data.status) {
      case 404:
      console.warn("The " + urlSettings.type + " do not exsists, please try another one");
      break;
      default:
      console.warn('An unknow error happend');
      break;
    }
  });
  return false;
}

$('#PB_LanguageChoiceForm').on('submit',function(e) {
  e.preventDefault();
  var lang = $('#PB_LanguageChoiceSelect').val()
  $.ajax({
    type: "POST",
    url: "/ajax/",
    data: {
      ACTION: "PB_UpdateLanguageCookie",
      lang: lang,
    }, success: function (data) {
      if(data.redirect)
        location.href=data.redirect
      else
        location.reload()
    },
    dataType: "json"
  })
  return false;
})

// Manage print Invoice function
function printInvoice(divName) {
    var invoice = document.getElementById(divName).innerHTML;
    originalBodyContent = $('body').html();
    document.body.innerHTML = invoice;
    window.print();
    setTimeout(function(){document.body.innerHTML = originalBodyContent},1000)
    
}

function closeMessage(OPTION_ID) {
  var options = {};
  options[OPTION_ID] = 1
  $.ajax({
    type: "POST",
    url: "/ajax/",
    data: {
      ACTION: "PR_updateOptions",
      options: options,
    }
  })
}