class RssFeedModel {
    constructor(id, title, url) {
        this.id = id;
        this.title = title;
        this.url = url;
    }
}

function tryCatch(func, fail) {
    try { 
        return func();
    }
    catch(e) { 
        return fail;
    }
}

function getDropDownLinks(feed) {
    let links = "";
    try {
        $.each(feed.categories, function (i, feedCategory) {
            links += '<li><a class=\"dropdown-item\" href=\"?id='+ feedCategory.id +'\">'+ feedCategory.title +'</a></li>';
        });
        return links;
    }
    catch(e) { 
        console.log(e);
    }
    finally {
        links = "";
    }
}

let rssFeeds = [];

let queryParams = new URLSearchParams(window.location.search);
let id = queryParams.get("id");

$.ajax({
    url: './assets/dist/json/feeds.json',
    dataType: 'json',
    success: function(json){
        $.each(json, function (i, item) {
            if (item.id == 3|| item.id == 4 || item.id == 6) {
                $.each(item.categories, function (ii, category) {
                    rssFeeds.push(new RssFeedModel(category.id, category.title, category.url));
                });
            }
            else {
                rssFeeds.push(new RssFeedModel(item.id, item.title, item.url));
            }
            
            $('#feeds').append(
                (item.id == 3 || item.id == 4 || item.id == 6 ?
                    '<li class=\"nav-item dropdown\">' +
                        '<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">' +
                            item.title +
                        '</a>' +
                        '<ul class="dropdown-menu">' +
                            getDropDownLinks(item) +
                        '</ul>' +
                    '</li>'
                :
                    '<li class="nav-item">' + 
                        '<a class="nav-link" href=\"?id='+ item.id +'\">'+ item.title +'</a>' +
                    '</li>'
                )
            );
        });

        let rssFeed = rssFeeds.find(element => element.id == (id == '' ? 0 : Number(id)));

        if (rssFeed != null) {
            $.ajax({
                async: false,
                global: false,
                url: 'https://api.codetabs.com/v1/proxy/?quest=' + rssFeed.url,
                dataType: 'xml',
                success: function(data){
                    var $xml = $(data);
                    $xml.find("item").each(function() {
                        var $this = $(this),
                            item = {
                                title: $this.find("title").text(),
                                link: $this.find("link").text(),
                                description: $this.find("description").text(),
                                contentEncoded: tryCatch(() => $this.find('content\\:encoded, encoded').text(), null),
                                pubDate: $this.find("pubDate").text(),
                                imgUrl0: tryCatch(() => $this.find('image').text(), null),
                                imgUrl1: tryCatch(() => $this.find('media\\:content, content').attr('url'), null),
                                imgUrl2: tryCatch(() => $this.find('enclosure, enclosure').attr('url'), null),
                                imgUrl3: tryCatch(() => $this.find('media\\:thumbnail, thumbnail').attr('url'), null)
                            };

                        $('#cards').append(
                            '<div class="col">' +
                                '<div class=\"card shadow-sm\">' +
                                    (rssFeed.id == 0 || rssFeed.id == 4.2 || rssFeed.id == 4.5 || rssFeed.id == 6.1 || rssFeed.id == 6.2 || rssFeed.id == 6.3 || rssFeed.id == 6.4 ?
                                        ""
                                    :
                                        (item.imgUrl0 == "" || item.imgUrl0 == null || item.imgUrl0 == undefined ?
                                            (item.imgUrl1 == "" || item.imgUrl1 == null || item.imgUrl1 == undefined ?
                                                (item.imgUrl2 == "" || item.imgUrl2 == null || item.imgUrl2 == undefined ?
                                                    (item.imgUrl3 == "" || item.imgUrl3 == null || item.imgUrl3 == undefined ?
                                                        '<svg class=\"bd-placeholder-img card-img-top\" width=\"100%\" height=\"225\"' +
                                                            'xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Placeholder: Thumbnail\"' +
                                                            'preserveAspectRatio=\"xMidYMid slice\" focusable=\"false\">' +
                                                            '<title>Thumbnail</title>' +
                                                            '<rect width=\"100%\" height=\"100%\" fill=\"#55595c\" /><text x=\"50%\" y=\"50%\" fill=\"#eceeef\"' +
                                                            'dy=\".3em\">Thumbnail</text>' +
                                                        '</svg>'
                                                    :
                                                        '<img src=\"'+ item.imgUrl3 +'\" class=\"card-img-top\" alt=\"...\" width=\"100%\" height=\"100%\">'
                                                    )
                                                :
                                                    '<img src=\"'+ item.imgUrl2 +'\" class=\"card-img-top\" alt=\"...\" width=\"100%\" height=\"100%\">'
                                                )
                                            :
                                                '<img src=\"'+ item.imgUrl1 +'\" class=\"card-img-top\" alt=\"...\" width=\"100%\" height=\"100%\">'
                                            )
                                        :
                                            '<img src=\"'+ item.imgUrl0 +'\" class=\"card-img-top\" alt=\"...\" width=\"100%\" height=\"100%\">'
                                        )
                                    ) +
                                    '<div class=\"card-body\">' +
                                        '<h5 class=\"card-title\">'+ item.title +'</h5>' +
                                        '<p class=\"card-text\">'+ (rssFeed.id == 4.2 || rssFeed.id == 4.5 ? item.contentEncoded : item.description) +'</p>' +
                                        '<div class=\"d-flex justify-content-between align-items-center\">' +
                                            '<div class="btn-group\">' +
                                                '<a href=\"'+ item.link +'\" class=\"btn btn-sm btn-outline-secondary\" target=\"_blank\">View</a>' +
                                            '</div>' +
                                            '<small class=\"text-muted\">'+ item.pubDate.substring(0,22) +'</small>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>'
                        );
                    });
                },
                error: function(data){
                    console.error(data);
                }
            });
        }
    },
    error: function(json){
        console.error(json);
    }
});