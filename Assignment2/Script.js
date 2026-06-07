// Multi-step booking form
function goToStep(n) {
  document.querySelectorAll('.step').forEach(s => s.classList.add('hidden'));
  document.getElementById('step' + n).classList.remove('hidden');
}
 
function submitBooking() {
  const first = document.getElementById('firstName').value.trim();
  const last  = document.getElementById('lastName').value.trim();
  const email = document.getElementById('emailInput').value.trim();
  const date  = document.getElementById('dateInput').value;
  const time  = document.getElementById('timeInput').value;
  const service = document.querySelector('input[name="service"]:checked');
 
  if (!first || !last || !email) {
    alert('Please fill in your name and email.');
    return;
  }
 
  const serviceName = service ? service.value : 'your selected service';
  const dateStr = date ? new Date(date + 'T12:00:00').toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'your selected date';
  const timeStr = time || 'your selected time';
 
  document.getElementById('confirmMsg').textContent =
    `Thank you, ${first}! Your appointment for ${serviceName} on ${dateStr} at ${timeStr} has been received. We will confirm shortly at ${email}.`;
 
  goToStep('Confirm');
}
 
function resetBooking() {
  document.querySelectorAll('input[name="service"]').forEach(r => r.checked = false);
  document.getElementById('dateInput').value = '';
  document.getElementById('timeInput').value = '';
  document.getElementById('stylistInput').value = '';
  document.getElementById('firstName').value = '';
  document.getElementById('lastName').value = '';
  document.getElementById('emailInput').value = '';
  document.getElementById('phoneInput').value = '';
  document.getElementById('notesInput').value = '';
  goToStep(1);
}
 
// Highlight selected service option
document.querySelectorAll('.service-option input').forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.service-option').forEach(o => o.style.borderColor = '');
    if (radio.checked) radio.closest('.service-option').style.borderColor = 'var(--gold)';
  });
});
 
// Mobile nav toggle
document.getElementById('hamburger').addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  const open = links.style.display === 'flex';
  links.style.display = open ? '' : 'flex';
  links.style.flexDirection = 'column';
  links.style.position = 'absolute';
  links.style.top = '62px';
  links.style.left = '0';
  links.style.right = '0';
  links.style.background = 'var(--cream)';
  links.style.padding = '20px 32px';
  links.style.borderBottom = '1px solid var(--border)';
  if (open) links.removeAttribute('style');
});