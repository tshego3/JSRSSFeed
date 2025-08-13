export function createElement(tag, className = '', innerHTML = '') {
  const el = document.createElement(tag);
  el.className = className;
  el.innerHTML = innerHTML;
  return el;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
