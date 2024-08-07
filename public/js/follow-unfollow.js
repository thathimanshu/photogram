
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
        } else if(data.action ==='like'){
            document.getElementById('likeForm').style.display = 'none';
            document.getElementById('unlikeForm').style.display = 'block';
        } else if(data.action ==='unlike'){
            document.getElementById('likeForm').style.display = 'block';
            document.getElementById('unlikeForm').style.display = 'none';
        }

    })
    .catch(error => {
        console.error('Error:', error);
    });
}
document.getElementById('followForm')?.addEventListener('submit', handleFormSubmit);
document.getElementById('unfollowForm')?.addEventListener('submit', handleFormSubmit);
document.getElementById('likeForm')?.addEventListener('submit', handleFormSubmit);
document.getElementById('unlikeForm')?.addEventListener('submit', handleFormSubmit);
