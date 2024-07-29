
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target;
    const formData = new FormData(form);

    fetch(form.action, {
        method: form.method,
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.action === 'follow') {
            document.getElementById('followForm').style.display = 'none';
            document.getElementById('unfollowForm').style.display = 'block';
        } else if (data.action === 'unfollow') {
            document.getElementById('unfollowForm').style.display = 'none';
            document.getElementById('followForm').style.display = 'block';
        }

    })
    .catch(error => {
        console.error('Error:', error);
    });
}
document.getElementById('followForm')?.addEventListener('submit', handleFormSubmit);
document.getElementById('unfollowForm')?.addEventListener('submit', handleFormSubmit);
