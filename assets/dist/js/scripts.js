class RssFeedModel {
    constructor(id, url) {
        this.id = id;
        this.url = url;
    }
}

let rssFeeds = [];

let queryParams = new URLSearchParams(window.location.search);
let id = queryParams.get("id");

fetch('./assets/dist/json/rss-feeds.json')
.then((response) => response.json())
.then((json) => {
    $.each(json, function (i, item) {
        rssFeeds.push(new RssFeedModel(item.id, item.url));
    });
});

let rssFeed = rssFeeds.find(element => element.id === Number(id));

console.log(rssFeed);

$.ajax({
    url: 'https://api.codetabs.com/v1/proxy/?quest=https://www.sabcnews.com/sabcnews/category/south-africa/feed/',
    dataType: 'xml',
    success: function(data){
        var $xml = $(data);
        $xml.find("item").each(function() {
            var $this = $(this),
                item = {
                    title: $this.find("title").text(),
                    link: $this.find("link").text(),
                    description: $this.find("description").text(),
                    pubDate: $this.find("pubDate").text(),
                    imgUrl0: $this.find('media\\:content, content').attr('url')
            };
            $('#cards').append(
                '<div class="col">' +
                    '<div class=\"card shadow-sm\">' +
                        (item.imgUrl0 == "" ?
                            '<svg class=\"bd-placeholder-img card-img-top\" width=\"100%\" height=\"225\"' +
                                'xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Placeholder: Thumbnail\"' +
                                'preserveAspectRatio=\"xMidYMid slice\" focusable=\"false\">' +
                                '<title>Thumbnail</title>' +
                                '<rect width=\"100%\" height=\"100%\" fill=\"#55595c\" /><text x=\"50%\" y=\"50%\" fill=\"#eceeef\"' +
                                    'dy=\".3em\">Thumbnail</text>' +
                            '</svg>'
                        :
                            '<img src=\"'+ item.imgUrl0 +'\" class=\"card-img-top\" alt=\"...\" width=\"100%\" height=\"225\">'
                        ) +
                        '<div class=\"card-body\">' +
                            '<h5 class=\"card-title\">'+ item.title +'</h5>' +
                            '<p class=\"card-text\">'+ item.description +'</p>' +
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
