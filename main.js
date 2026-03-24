import { fetchData } from "./api/fetchData.js";
import { CardComponent } from "./components/CardComponent.js";

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
  } catch (e) {
    return fail;
  }
}

function getDropDownLinks(feed) {
  let links = "";
  try {
    $.each(feed.categories, function (i, feedCategory) {
      links +=
        '<li><a class="dropdown-item" href="?id=' +
        feedCategory.id +
        '">' +
        feedCategory.title +
        "</a></li>";
    });
    return links;
  } catch (e) {
    console.log(e);
  } finally {
    links = "";
  }
}

let rssFeeds = [];

async function init() {
  const container = document.getElementById("cards");

  try {
    const rssFeed = await fetchData("./assets/dist/json/feeds.json");
    $.each(rssFeed, function (i, item) {
      if (item.id == 3 || item.id == 4 || item.id == 5 || item.id == 6) {
        $.each(item.categories, function (ii, category) {
          rssFeeds.push(
            new RssFeedModel(category.id, category.title, category.url)
          );
        });
      } else {
        rssFeeds.push(new RssFeedModel(item.id, item.title, item.url));
      }

      $("#feeds").append(
        item.id == 3 || item.id == 4 || item.id == 5 || item.id == 6
          ? '<li class="nav-item dropdown">' +
          '<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">' +
          item.title +
          "</a>" +
          '<ul class="dropdown-menu">' +
          getDropDownLinks(item) +
          "</ul>" +
          "</li>"
          : '<li class="nav-item">' +
          '<a class="nav-link" href="?id=' +
          item.id +
          '">' +
          item.title +
          "</a>" +
          "</li>"
      );
    });

    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");

    const feed = rssFeeds.find(
      (item) => item.id === (id === "" ? 0 : Number(id))
    );

    document.title = feed.title;
    document.getElementById("feed-title").textContent = feed.title;

    $("#feeds a.nav-link, #feeds a.dropdown-item").each(function () {
      const hrefId = new URLSearchParams(this.href.split("?")[1]).get("id");
      if (Number(hrefId) === feed.id) {
        $(this).addClass("active");
      }
    });

    let xmlData;

    try {
      // Attempt 1: Netlify Proxy
      xmlData = await fetch(
        `https://rss-proxy-api.netlify.app/.netlify/functions/fetch-xml?url=${encodeURIComponent(feed.url)}`
      );

      // Attempt 2: Codetabs Proxy (if Netlify fails)
      if (!xmlData.ok) {
        console.warn(`Netlify proxy failed (${xmlData.status}) for ${feed.title}. Trying Codetabs proxy...`);
        xmlData = await fetch(`https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(feed.url)}`);
      }

      // Attempt 3: Direct Fetch (if both proxies fail)
      if (!xmlData.ok) {
        console.warn(`Codetabs proxy failed (${xmlData.status}). Attempting direct fetch...`);
        xmlData = await fetch(feed.url);
      }
    } catch (e) {
      console.warn(`Network error during initial fetch attempts. Trying fallbacks...`);
      try {
        // Fallback to Codetabs if Netlify errored out
        xmlData = await fetch(`https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(feed.url)}`);
        if (!xmlData.ok) {
          xmlData = await fetch(feed.url);
        }
      } catch (innerError) {
        try {
          xmlData = await fetch(feed.url);
        } catch (directError) {
          xmlData = { ok: false, status: 'Network Error' };
        }
      }
    }

    if (!xmlData.ok) {
      let errorMsg = `Failed to load feed (HTTP ${xmlData.status})`;
      try {
        if (typeof xmlData.json === 'function') {
          const errorJson = await xmlData.json();
          errorMsg = errorJson.error || errorMsg;
        }
      } catch (_) { }

      container.innerHTML = `
        <div class="col-12">
          <div class="alert alert-warning d-flex align-items-center" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <div>
              <strong>Feed unavailable:</strong> ${errorMsg}
              <br><small class="text-muted">This feed might be blocked by browser security (CORS) or the server might be down.</small>
            </div>
          </div>
        </div>`;
      return;
    }

    const xml = await xmlData.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");

    const items = xmlDoc.querySelectorAll("item");

    items.forEach((item) => {
      const data = {
        title: item.querySelector("title").textContent,
        link: item.querySelector("link").textContent,
        description: item.querySelector("description").textContent,
        contentEncoded:
          item.querySelector("content\\:encoded, encoded")?.textContent || null,
        pubDate: item.querySelector("pubDate").textContent,
        imgUrl0: item.querySelector("image")?.textContent || null,
        imgUrl1:
          item.querySelector("media\\:content, content")?.getAttribute("url") ||
          null,
        imgUrl2: item.querySelector("enclosure")?.getAttribute("url") || null,
        imgUrl3:
          item
            .querySelector("media\\:thumbnail, thumbnail")
            ?.getAttribute("url") || null,
      };

      const cardComponent = new CardComponent(data);
      container.appendChild(cardComponent.render());
    });
  } catch (error) {
    console.error(error);
  }
}

if (document.readyState !== "loading") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
