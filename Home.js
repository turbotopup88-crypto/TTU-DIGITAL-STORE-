let products = [

    {
        id: "Product-TTU_GP_2Home",

        title: "اشتراك جيم باس شهرين هوم",

        price: "400 جنيه",

        image: "https://i.ibb.co/k2mFSdxR/file-000000006870720aa187ae1f65b31c0a.png",

        category: "subscriptions"
    },

    {
        id: "Product-TTU_GP_ PC6M",

        title: "اشتراك جيم باس للكمبيوتر 6 اشهر",

        price: "400 جنيه",

        image: "https://i.ibb.co/Xk53gBbV/4-20260528-105009.png",

        category: "subscriptions"
    },

    {
        id: "Product-TTU_GP_4_Home",

        title: "اشتراك جيم باس 4 اشهر هوم",

        price: "770 جنيه",

        image: "https://i.ibb.co/WvvzyXtg/4-20260527-111343.png",

        category: "subscriptions"
    },

    {
        id: "Product-TTU_GP_4_sign_in",

        title: "اشتراك جيم باس 4 اشهر ساين",

        price: "700 جنيه",

        image: "https://i.ibb.co/WvvzyXtg/4-20260527-111343.png",

        category: "subscriptions"
    },

    {
        id: "Product-TTU_GP_6_Home",

        title: "اشتراك جيم باس 6 اشهر هوم",

        price: "1000 جنيه",

        image: "https://i.ibb.co/mFM9RxMm/4-20260527-111437.png",

        category: "subscriptions"
    },

    {
        id: "Product-TTU_GP_6_sign_in",

        title: "اشتراك جيم باس 6 اشهر ساين",

        price: "950 جنيه",

        image: "https://i.ibb.co/mFM9RxMm/4-20260527-111437.png",

        category: "subscriptions"
    },

    {
        id: "Product-TTU_GP_2sign_in",

        title: "اشتراك جيم باس شهرين ساين",

        price: "350 جنيه",

        image: "https://i.ibb.co/k2mFSdxR/file-000000006870720aa187ae1f65b31c0a.png",

        category: "subscriptions"
    },

    {
        id: "Product-TTU_GP_PC2m",

        title: "اشتراك جيم باس للكمبيوتر شهرين",

        price: "150 جنيه",

        image: "https://i.ibb.co/hRWphKNR/file-0000000065087246bf59030366c07377.png",

        category: "subscriptions"
    },

    

];


/* ======================
   نظام تحميل المزيد
====================== */

const PRODUCTS_PER_LOAD = 12;

let currentProducts = [];

let currentIndex = 0;


/* ======================
   عرض المنتجات
====================== */

function display(items, reset = true){

    const container =
    document.getElementById("productsContainer");

    if(reset){

        container.innerHTML = "";

        currentIndex = 0;

        currentProducts = items;
    }

    const nextProducts =
    currentProducts.slice(
        currentIndex,
        currentIndex + PRODUCTS_PER_LOAD
    );

    nextProducts.forEach(p => {

        container.innerHTML += `

        <div class="product-card"
        onclick="window.location.href='${p.id}.html'">

            <img src="${p.image}" loading="lazy">

            <div class="product-info">

                <div class="product-title">
                    ${p.title}
                </div>

                <div class="product-price">
                    ${p.price}
                </div>

            </div>

        </div>

        `;

    });

    currentIndex += PRODUCTS_PER_LOAD;

    updateLoadMoreButton();
}


/* ======================
   زر تحميل المزيد
====================== */

const loadMoreBtn =
document.createElement("button");

loadMoreBtn.className =
"load-more-btn";

loadMoreBtn.innerText =
"تحميل المزيد";

loadMoreBtn.onclick = () => {

    display(currentProducts, false);

};


const loadMoreBox =
document.createElement("div");

loadMoreBox.className =
"load-more-box";

loadMoreBox.appendChild(loadMoreBtn);

document.body.appendChild(loadMoreBox);


function updateLoadMoreButton(){

    if(currentIndex >= currentProducts.length){

        loadMoreBtn.style.display =
        "none";
    }

    else{

        loadMoreBtn.style.display =
        "block";
    }
}


/* ======================
   أول تشغيل
====================== */

display(products);


/* ======================
   السيرش + الفلترة
====================== */

const searchInput =
document.getElementById("searchInput");

const suggestionsBox =
document.getElementById("suggestions");


if(searchInput){

    searchInput.addEventListener("input", function(){

        const value =
        this.value.toLowerCase().trim();

        suggestionsBox.innerHTML = "";

        if(value === ""){

            suggestionsBox.style.display =
            "none";

            display(products);

            return;
        }

        const filteredProducts =
        products.filter(product =>

            product.title
            .toLowerCase()
            .includes(value)

        );

        display(filteredProducts);

        filteredProducts.forEach(product => {

            const div =
            document.createElement("div");

            div.className =
            "suggestion-item";

            div.textContent =
            product.title;

            div.onclick = () => {

                window.location.href =
                `${product.id}.html`;

            };

            suggestionsBox.appendChild(div);

        });

        if(filteredProducts.length > 0){

            suggestionsBox.style.display =
            "block";
        }

        else{

            suggestionsBox.style.display =
            "none";
        }

    });

}


/* ======================
   اغلاق الاقتراحات
====================== */

document.addEventListener("click", function(e){

    if(
        !e.target.closest(".search-wrapper")
    ){

        suggestionsBox.style.display =
        "none";
    }

});


/* ======================
   التصنيفات
====================== */

document.querySelectorAll(".category")
.forEach(cat => {

    cat.addEventListener("click", () => {

        const text =
        cat.textContent.trim();

        let filtered = [];

        document.querySelectorAll(".category")
        .forEach(c => {

            c.classList.remove("active-category");

        });

        cat.classList.add("active-category");

        if(text.includes("بطاقات")){

            filtered =
            products.filter(p =>

                p.category === "cards"

            );

        }

        else if(text.includes("اشتراكات")){

            filtered =
            products.filter(p =>

                p.category === "subscriptions"

            );

        }

        else if(text.includes("حسابات")){

            filtered =
            products.filter(p =>

                p.category === "accounts"

            );

        }

        display(filtered);

    });

});


/* ======================
   البانر
====================== */

const bannerImage =
document.getElementById("bannerImage");

const banners = [

    "https://i.ibb.co/Q7sBq2Ld/20260528-074526.jpg",

    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200",

    "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200"

];

let currentBanner = 0;


if(bannerImage){

    bannerImage.src =
    banners[currentBanner];

}


function changeBanner(){

    if(!bannerImage) return;

    bannerImage.style.opacity = 0;

    setTimeout(() => {

        currentBanner++;

        if(currentBanner >= banners.length){

            currentBanner = 0;

        }

        bannerImage.src =
        banners[currentBanner];

        bannerImage.style.opacity = 1;

    }, 300);

}


setInterval(changeBanner, 4000);
