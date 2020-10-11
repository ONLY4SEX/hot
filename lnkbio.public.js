(function($){
	$.fn.visible = function(partial){
		
	    var $t				= $(this),
	    	$w				= $(window),
	    	viewTop			= $w.scrollTop(),
	    	viewBottom		= viewTop + $w.height(),
	    	_top			= $t.offset().top,
	    	_bottom			= _top + $t.height(),
	    	compareTop		= partial === true ? _bottom : _top,
	    	compareBottom	= partial === true ? _top : _bottom;
		
		return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
    };
    
})(jQuery);

$(window).on('resize scroll', function() {
	refreshImages()
});

DEFAULT_SIZE = 1024;
SIZES = [100,250,500,1024];
refreshImages()
function refreshImages() {
	$('.pb-links .pb-linkimage img').each(function() {
		var el = $(this)
		if(!el.visible(true))
			return
		if(!el.data('src')) 
			return
		if(el.attr('src'))
			return;
		
		for(i=0;i<SIZES.length;i++) {
			if((el.width()*1) < SIZES[i]) {
				var url = el.data('src').replace("-"+DEFAULT_SIZE,"-"+SIZES[i])
				el.attr('src',url)
				return
			}
		}
		el.attr('src',url) = el.data('src')
	})
}

IS_start = 48;
IS_limit = 48;
IS_reachedMax = false;
IS_done = [0]
function loadMorePosts() {
	if (IS_reachedMax) {
		return;
	}
	if(jQuery.inArray(IS_start, IS_done) !== -1) {
		return;
	}
	IS_done.push(IS_start)
	$.ajax({
		url: "/ajax/",
		method: "POST",
        dataType: "json",
		data: {
			ACTION: 'PB_getMoreLinks',
			start: IS_start,
			limit: IS_limit,
			user_id: $('#LB_UserID').val()
		},
		success: function(response) {
			if(response.status) {
				$('.pb-links').append(response.html)
				refreshImages()
				IS_start += IS_limit;
			}
			if(response.reached_max) {
				IS_reachedMax = true;
			}
			
		}
	});
}

$(window).scroll(function() {
	if ($(window).width() < 500) {
		if ($(document).height() - $(window).height() - $(window).scrollTop() <= 500) {
			loadMorePosts();
		}
	} else {
		if ($(document).height() - $(window).height() - $(window).scrollTop() <= 300) {
			loadMorePosts();
		}
	}
});

$(window).on("beforeunload", function(){
	$(window).scrollTop(0);
});
function iOSorAndroid() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
	if (/android/i.test(userAgent)) {
        return "AND";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "IOS";
    }
    return false;
}
if(iOSorAndroid() !== false) {
	$("body").css("background-color","red !important")
	$('.social-links a').click(function(e) {
		var icon = $(e.target)
		var a = icon.parent()
		var tracked = a.attr("href")
		var url = a.data('url')
		var network = a.data('network')
		if(network == 'SOCIAL_TW') { // Twitter
			var R = new RegExp(/https:\/\/(www\.)?twitter\.com\/([^\/\?]+)/, 'i')
			var parts = R.exec(url);
			var username = parts[2];
			LB_OpenTwitter(username,url)
		} else if(network == 'SOCIAL_FB') { // Facebook
			var R = new RegExp(/https:\/\/(www\.)?facebook\.com\/([^\/\?]+)/, 'i')
			var parts = R.exec(url);
			var username = parts[2];
			LB_OpenFacebook(username,url)
		} else if(network == 'SOCIAL_YT') { // YouTube
			var to_open = url.replace("https://","");
			to_open = to_open.replace("http://","");
			LB_OpenYouTube(to_open,url)
		}  else if(network == 'SOCIAL_SN') { // Snapchat
			var R = new RegExp(/https:\/\/(www\.)?snapchat\.com\/add\/([^\/\?]+)/, 'i')
			var parts = R.exec(url);
			var username = parts[2];
			LB_OpenSnapchat(username,url)
		}  else if(network == 'SOCIAL_IG') { // Instagram
			var R = new RegExp(/https:\/\/(www\.)?instagram\.com\/([^\/\?]+)/, 'i')
			var parts = R.exec(url);
			var username = parts[2];
			LB_OpenInstagram(username,url)
		} else
			return

		$.ajax({
			type: "POST",
			url: "/ajax/",
			data: {
				ACTION: "CU_trackSocialLink",
				url: url,
				network: network,
				user_id: $('#LB_UserID').val(),
				timezone: $('#LB_UserTimezone').val()
			}
		})

	    e.preventDefault();
	});

	LB_TRACKED_LINK = '';
	LB_TRACKED_TIME = 0;
	LB_TRACKED_FUNC = false;

	$(window).blur(function(e) {
	    if(LB_TRACKED_FUNC) {
	    	clearTimeout(LB_TRACKED_FUNC)
	    }
	});
}

function orNormalRedirect(tracked) {
	console.log(tracked)
	LB_TRACKED_LINK = tracked;
	LB_TRACKED_TIME = new Date();
	LB_TRACKED_FUNC = setTimeout(function() {
		var current_time = new Date();
		var timeDiff = current_time - LB_TRACKED_TIME; 
		if(timeDiff < 1000) {
			history.pushState(null, null, location.href.toString());
			location.replace(LB_TRACKED_LINK)
		}
	},500);
}


function LB_OpenTwitter(username,tracked) {
	location.replace("twitter://user/?screen_name="+username);
	orNormalRedirect(tracked)
}

function LB_OpenFacebook(username,tracked) {
	location.href = "fb://facewebmodal/f?href=https://www.facebook.com/"+username;
	orNormalRedirect(tracked)
}

function LB_OpenYouTube(to_open,tracked) {
	if(iOSorAndroid() == "AND") {
		location.replace("vnd.youtube://"+to_open);
	} else if (iOSorAndroid() == "IOS") {
		location.replace("youtube://"+to_open);
	} 
	orNormalRedirect(tracked)
}

function LB_OpenSnapchat(username,tracked) {
	location.href = "snapchat://add/"+username;
	orNormalRedirect(tracked)
}

function LB_OpenInstagram(username,tracked) {
	location.href = "instagram://user?username="+username;
	orNormalRedirect(tracked)
}