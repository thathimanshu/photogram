document.querySelector('.createnew').addEventListener("click", function() {
    let div = document.querySelector('.fullscreen');
    div.style.display = 'flex';
    let cross = document.querySelector('.cross');
    cross.addEventListener('click',()=>{
        div.style.display = 'none';
    })
});

function closediv(event){
    let div = document.querySelector('.user-option-list');
    if (!div.contains(event.target) && !document.querySelector('.profile-dp').contains(event.target)) {
        div.style.display = 'none';
        document.removeEventListener('click', closediv); // Corrected event removal
    }
}

document.querySelector('.profile-dp').addEventListener('click', () => {
    let div = document.querySelector('.user-option-list');
    div.style.display = 'flex';

    document.addEventListener('click', closediv);
});
