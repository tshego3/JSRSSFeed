import { fetchData } from './api/fetchData.js';
import { CardComponent } from './components/CardComponent.js';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('app');

  try {
    const data = await fetchData('https://jsonplaceholder.typicode.com/posts?_limit=5');
    
    data.forEach(item => {
      const card = new CardComponent({
        title: item.title,
        body: item.body
      });
      container.appendChild(card.render());
    });

  } catch (err) {
    container.innerHTML = `<div class="alert alert-danger">Failed to load data</div>`;
    console.error(err);
  }
});
