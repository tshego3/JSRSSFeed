export class CardComponent {
  constructor({ title, body }) {
    this.title = title;
    this.body = body;
  }

  render() {
    const card = document.createElement('div');
    card.className = 'card mb-3';

    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${this.title}</h5>
        <p class="card-text">${this.body}</p>
        <a href="#" class="btn btn-primary">Action</a>
      </div>
    `;

    return card;
  }
}