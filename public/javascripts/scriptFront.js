function mouseOver(id) {
    id.style.backgroundColor = "#eeae49";
    id.style.boxShadow= "inset 0px 1px 20px 20px #d1495b";
    id.style.border= "2vmin solid #eeae49";
    id.children[0].style.color ='#d1495b';
    id.children[0].style.textShadow ="10px 10px 20px #003d5b";
}

function mouseLeave(id) {
    id.style.backgroundColor = "#d1495b";
    id.style.boxShadow= "inset 0px 1px 20px 20px #eeae49";
    id.style.border= "2vmin solid #d1495b";
    id.children[0].style.color ='#eeae49';
    id.children[0].style.textShadow ="10px 10px 20px #003d5b";
}