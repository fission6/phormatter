// PT Phormatter

var PT_ENDPOINT = 'http://phantasytour.com/bands/1/';

$(document).ready(function() {


    // control visibily of debug window
    getThreads().done(function() {
        // hover for user profile
        console.log('done');
        $('a[href^="http://phantasytour.com/users/"]').popover({
            trigger: 'hover',
            title: 'Whstever',
            content: 'somfdfn'
        });
    });

    // board link
    $("#board-link").click(function(event) {
        event.preventDefault();
        getThreads().done(function() {
            // hover for user profile
            console.log('done');
            $('a[href^="http://phantasytour.com/users/"]').popover({
                trigger: 'hover',
                title: 'Whstever',
                content: 'somfdfn'
            });
        });
    });

    //refresh page


    $(document).keydown(function(event) {

          if (event.which == 32 && event.target.type != 'textarea') {
             event.preventDefault();
             console.log("space pressed");
             getThreads();
           }
    });

    // construct thread modal
    $('#threadModal').modal({
        backdrop: false,
        show: false
    });

    // my threads link
    $("#my-threads-link").click(function(event) {
        event.preventDefault();
        getMyThreads();
    });





});



function getThreads() {
    $("#threads tbody tr").empty();
    window.scrollTo(0, 0);
    return getPage(1).pipe(getMyThreadsList).done(function( my_threads_list ) {
        $( my_threads_list.join(', ') ).addClass('warning');
    });
}

function getMyThreads( ) {
    $("#threads tbody tr").empty();
    window.scrollTo(0, 0);
    return $.get( PT_ENDPOINT + 'topics/?mode=my_threads').pipe(parseThreads).done(function( data ) {
        $('#threads tbody').append( data );
    });
}

function getPage( page ) {

    return $.get( PT_ENDPOINT + 'topics/', {page: page} ).pipe(parseThreads).done(function( data ) {
        $('#threads tbody').append( data );
    });
}



function parseThreads( threads ) {
    // get just the threads and remove all images
    // and styles
    var $threads = $(threads).find('table.topics_listing tr');

    $threads.find('*').remove('img').removeClass();
    $threads.find('a').attr('target', '_blank')
    // thread preview
    .click(function(event) {
        event.preventDefault();
        var $clicked = $(this);
        var populated = $clicked.data('populated');
        var url = $(this).attr('href');
        console.log(url);
        renderThread( url );
    });
    return $threads;
}

function renderThread( url ) {

    window.scrollTo(0, 0);
    $('#thread-wrapper').hide();
    $.get(url, function( response ) {
        var title = $(response).find('.topic_header').text();
        var $thread = $(response).find('#boards_ajax_container');
        // get reply form
        var $reply_form = $(response).find('#new_post').addClass('well');
        $reply_form.find('#post_submit, .post_instructions').remove();
        $reply_form.append('<input type="submit" id="submit-button" class="btn btn-large btn-primary" value="Reply" />');
        // reply form
        $reply_form.submit(function(event) {
            event.preventDefault();
            $form = $(this);
            $form.find("input[type=submit]").attr("disabled", "disabled");
            // submit through ajax
            var submit_url = $form.attr('action');
            var data = $form.serialize();
            $.post(submit_url, data).done(function( data ) {
                console.log("posted");
                renderThread( submit_url );
            });
        });


        // insert form
        $('#reply-form-wrapper').html($reply_form);
        $thread.find('div.topic_header, span.post_tools, div.posts_footer').remove();
        var $names = $thread.find('span.poster_name');
        $names.html(function(index, html) {
            return html.replace('»', '');
        });
        // links to images
        $thread.find("a[href$='.png'], a[href$='.jpg'], a[href$='.tiff'], a[href$='.gif']").each(function() {
            var img = $('<img>',{src: this.href});
            $(this).replaceWith(img);
        });
        // youtube
        $thread.find('a').each(function() {
            var yturl= /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([\w\-]{10,12})(?:&feature=related)?(?:[\w\-]{0})?/g;
            var ytplayer= '<iframe width="320" height="240" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>';

            var url = $(this).attr('href');
            if (url !== null) {
                var matches = url.match(yturl);
                if (matches) {
                    var embed = $(this).attr('href').replace(yturl, ytplayer);
                    var iframe = $(embed);

                    iframe.insertAfter(this);
                    $(this).remove();
                }
            }
        });


        $thread.find('br').remove();

        $thread.find('div.post').addClass('well well-small');
        $('#thread-title').text(title);
        //$('.modal-body').append($thread);
        $('#thread-content').html($thread);
        $('#thread-wrapper').show();
    });
}

function getMyThreadsList() {
    return $.get( PT_ENDPOINT + 'topics?mode=my_threads').pipe(function( my_threads ) {
        var $my_threads = $(my_threads).find('tr[class*="topic_"]');
        var my_threads_list = [];
        $.each($my_threads, function(index, value) {
            
            $.each(value.classList, function( index, value) {
                if ( value.match(/topic_\d/) ) {
                    my_threads_list.push('.' + value);
                }
            });

        });
        return my_threads_list;
    });
}

