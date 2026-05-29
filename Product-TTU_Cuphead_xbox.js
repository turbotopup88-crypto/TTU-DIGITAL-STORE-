/* ======================
   السلايدر
====================== */

const smallImages =
document.querySelectorAll(".small-images img");

const mainImage =
document.querySelector(".main-image");

let images = [];

smallImages.forEach(img => {

    images.push(img.src);

});

let current = 0;


/* عرض الصورة */

function showImage(index){

    mainImage.src = images[index];

}


/* أول صورة */

showImage(current);


/* الضغط على الصور الصغيرة */

smallImages.forEach((img,index)=>{

    img.addEventListener("click",()=>{

        current = index;

        showImage(current);

    });

});


/* الصورة التالية */

function nextImage(){

    current++;

    if(current >= images.length){

        current = 0;

    }

    showImage(current);

}


/* تقليب تلقائي */

setInterval(nextImage,3000);



/* ======================
   المشاهدات 👁
====================== */

const productId =
"product-Cuphead_xbox";


let views =
localStorage.getItem(productId);


/* أول مرة */

if(!views){

    views = 0;

}


/* زيادة المشاهدات */

views++;


/* حفظ */

localStorage.setItem(productId, views);


/* عرض الرقم */

const viewsCount =
document.getElementById("viewsCount");

if(viewsCount){

    viewsCount.innerText = views;

}