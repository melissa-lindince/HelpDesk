export function setupCalendar(btnDataVencimento, calendarModal, closeCalendar, filterCards) {
  let selectedStartDate = null;
  let selectedEndDate = null;

  btnDataVencimento.addEventListener('click', (e) => {
    e.stopPropagation();
    calendarModal.style.display = calendarModal.style.display === 'block' ? 'none' : 'block';
  });

  closeCalendar.addEventListener('click', () => {
    const startValue = document.getElementById('startDate').value;
    const endValue = document.getElementById('endDate').value;

    selectedStartDate = startValue ? new Date(startValue) : null;
    selectedEndDate = endValue ? new Date(endValue) : null;

    btnDataVencimento.textContent = (selectedStartDate && selectedEndDate)
      ? `De ${startValue.split('-').reverse().join('/')} até ${endValue.split('-').reverse().join('/')}`
      : "Data de vencimento";

    calendarModal.style.display = 'none';
    filterCards();
  });
}