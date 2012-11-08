// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*

line 24 starts all the work in the function, makes its first request, and then will take the data it received, and "maps" the
publishers into their own requests (so you now have an array of requests)
so, line 26 says that now, we will wait for all of those requests to finish before being "done" - $.when.apply( null, arrayOfRequests
the request for each publisher is on line 16, it takes its result and maps over the sites, looking for the categories - processing,
and pushing to the array on line 2
 pushing to the array on line 2
after ALL those requests finish, the function on line 27 executes, returning the array you populated to the console.log on line 34
s/returning/passing
you can imagine ".then" in 1.8 as a "pipe"
in previous versions of jQuery - you'll need .pipe instead of then
same function in 1.8+ but before it did something different --- Actually - i'll change the example to use .pipe instead for wider
compat
: http://vimeo.com/22687950 - http://www.confreaks.com/videos/993-jqcon2012-i-promise-to-show-you-when-to-use-deferreds
*/

$(document).ready(function() {
    console.log("CPX Banned Plugin Activated");
    var selected_category_id = '24384';
    var toolURL = chrome.extension.getURL("tool.html");
    // add banned tools
    $('#nav-publisher').next('ul').append('<li class="nav-parent"><a href="#" id="cpx-banned-button" target="_blank" style="color:red;">Content Ban</a></li>');
    $("#cpx-banned-button").attr('href', toolURL);
    // Banned button handler
});




