
export function showAlert(message: string, type = 'info', containerId = 'alertContainer', duration = 5000) {
    const alertContainer = document.getElementById(containerId);
    if (!alertContainer) return;

    const alert = alertContainer.querySelector('.alert');
    const alertContent = alertContainer.querySelector('.alert-content');

    // Remove existing classes
    alert.classList.remove('success', 'error', 'warning', 'info');
    // Add the type class
    alert.classList.add(type);
    // Set the message
    alertContent.textContent = message;
    // Show the alert
    alertContainer.classList.add('show');

    // Auto hide after specified duration
    if (duration > 0) {
        setTimeout(() => {
            alertContainer.classList.remove('show');
        }, duration);
    }
}


export function setupAlertClose(containerId = 'alertContainer') {
    const alertContainer = document.getElementById(containerId);
    if (!alertContainer) return;


    const alertClose = alertContainer.querySelector('.alert-close');
    if (alertClose) {
        alertClose.addEventListener('click', () => {
            alertContainer.classList.remove('show');
        });
    }
}

export function closeAlert(containerId = 'alertContainer') {
    const alertContainer = document.getElementById(containerId);
    if (!alertContainer) return;

    alertContainer.classList.remove('show');
}