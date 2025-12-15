export class CardComponent {
  constructor(data) {
    this.data = data;
  }

  render() {
    const card = document.createElement("div");
    card.className = "col";

    card.innerHTML = `
            <div class="card shadow-sm">
                ${this.getImage()}
                <div class="card-body">
                    <h5 class="card-title">${this.data.title}</h5>
                    <p class="card-text">${this.data.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                            <a href="${this.data.link
      }" class="btn btn-sm btn-outline-secondary" target="_blank">View</a>
                        </div>
                        <small class="text-muted">${this.data.pubDate.substring(
        0,
        22
      )}</small>
                    </div>
                </div>
            </div>
        `;

    return card;
  }

  getImage() {
    const queryParams = new URLSearchParams(window.location.search);
    const { imgUrl0, imgUrl1, imgUrl2, imgUrl3 } = this.data;

    if (imgUrl0) {
      return `<img src="${imgUrl0}" class="card-img-top" alt="..." width="100%" height="100%">`;
    }
    else if (imgUrl1) {
      return `<img src="${imgUrl1}" class="card-img-top" alt="..." width="100%" height="100%">`;
    }
    else if (imgUrl2) {
      return `<img src="${imgUrl2}" class="card-img-top" alt="..." width="100%" height="100%">`;
    }
    else if (imgUrl3) {
      return `<img src="${imgUrl3}" class="card-img-top" alt="..." width="100%" height="100%">`;
    }
    else if (Number(queryParams.get("id")) == 0) {
      return ``;
    }
    else {
      return ``;
    }
  }
}