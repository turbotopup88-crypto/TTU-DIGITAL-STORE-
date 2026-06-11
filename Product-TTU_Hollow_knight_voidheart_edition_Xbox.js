/* ======================
   السلايدر مع تحسين الصور المستطيلة
====================== */

const smallImages = document.querySelectorAll(".small-images img");
const mainImage = document.querySelector(".main-image");

let images = [];

smallImages.forEach(img => {
    images.push(img.src);
});

let current = 0;

function showImage(index) {
    mainImage.src = images[index];
}

showImage(current);

smallImages.forEach((img, index) => {
    img.addEventListener("click", () => {
        current = index;
        showImage(current);
    });
});

function nextImage() {
    current++;
    if (current >= images.length) {
        current = 0;
    }
    showImage(current);
}

setInterval(nextImage, 3000);

/* ======================
   المشاهدات 👁
====================== */

const productId = "product-TTU_Batman_arkham_knight_xbox