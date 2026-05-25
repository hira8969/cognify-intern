const viewButtons = document.querySelectorAll('[data-view]');
const cardsView = document.getElementById('cardsView');
const tableView = document.getElementById('tableView');

viewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const view = button.dataset.view;

    viewButtons.forEach((item) => item.classList.toggle('active', item === button));
    cardsView?.classList.toggle('d-none', view !== 'cards');
    tableView?.classList.toggle('d-none', view !== 'table');
  });
});
