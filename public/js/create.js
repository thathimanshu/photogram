newBtn = document.querySelector('.createnew');

newBtn.addEventListener("click", function() {
    console.log('click');
    let div = document.querySelector('.fullscreen');
    div.style.display = 'flex';
    let cross = document.querySelector('.cross');
    cross.addEventListener('click',()=>{
        div.style.display = 'none';
    })
});


