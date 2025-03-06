let fills = document.querySelectorAll('.fill')
for(let i = 0; i < fills.length; ++i){
    fills[i].style.width = `${fills[i].id}%`
}