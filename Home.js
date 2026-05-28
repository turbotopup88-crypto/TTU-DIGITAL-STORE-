let products = [

    {
        id: "Product-TTU_GP 2 Home",

        title: "  اشتراك جيم باس التيمت شهرين هوم",

        price: "400 جنيه",

        image: "https://i.ibb.co/1G7B43yM/file-000000006870720aa187ae1f65b31c0a.png",

        category: "subscriptions"
    },
    
        {
        id: "Product-TTU_GP_ PC 6M",

        title: "  اشتراك جيم باس للكمبيوتر 6 اشهر  ",

        price: "400 جنيه",

        image: "https://i.ibb.co/Xk53gBbV/4-20260528-105009.png",

        category: "subscriptions"
    },
    
    
        {
        id: "Product-TTU_GP_PC 2M ",

        title: "اشنراك جيم باس للكمبيوتر شهرين",

        price: "150 جنيه",

        image: "https://i.ibb.co/pjxj1tZn/file-0000000065087246bf59030366c07377.png",

        category: "subscriptions"
    },
    
        {
        id: "Product-TTU_GP 4 sign in",

        title: "اشنراك جيم باس 4 اشهر ساين",

        price: "700 جنيه",

        image: "https://i.ibb.co/WvvzyXtg/4-20260527-111343.png",

        category: "subscriptions"
    },

{
        id: "Product-TTU_GP 4 sign in",

        title: "اشنراك جيم باس 4 اشهر ساين",

        price: "700 جنيه",

        image: "https://i.ibb.co/WvvzyXtg/4-20260527-111343.png",

        category: "subscriptions"
    },
    
    
        {  
        id: "Product-TTU_GP 6 Home",

        title: "اشنراك جيم باس 6 اشهر هوم",

        price: "1000 جنيه",

        image: "https://i.ibb.co/LDJc5YDN/4-20260527-111437.png",

        category: "subscriptions"
    },
    
    
        {
        id: "Product-TTU_GP 6 sign in",

        title: "اشنراك جيم باس 6 اشهر ساين",

        price: "950 جنيه",

        image: "https://i.ibb.co/LDJc5YDN/4-20260527-111437.png",

        category: "subscriptions"
    },
    
    
        {
        id: "Product-TTU_GP 2 sign in",

        title: "  اشتراك جيم باس شهرين ساين",

        price: "350 جنيه",

        image: "https://i.ibb.co/1G7B43yM/file-000000006870720aa187ae1f65b31c0a.png",

        category: "subscriptions"
    },

];

/* ======================
   عرض المنتجات
====================== */

function display(items){

    const container =
    document.getElementById("productsContainer");

    container.innerHTML = "";

    if(items.length === 0){

        container.innerHTML = `
        <h2 style="
        text-align:center;
        width:100%;
        color:#777;
        ">
        لا توجد منتجات
        </h2>
        `;

        return;
    }

    items.forEach(p => {

        container.innerHTML += `

        <div class="product-card"
        onclick="window.location.href='${p.id}.html'">

            <img src="${p.image}">

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

}

/* أول تشغيل */

display(products);

/* ======================
   السيرش + الفلترة
====================== */

const searchInput =
document.getElementById("searchInput");

const suggestionsBox =
document.getElementById("suggestions");


searchInput.addEventListener("input", function(){

    const value =
    this.value.toLowerCase().trim();

    suggestionsBox.innerHTML = "";

    /* لو السيرش فاضي */

    if(value === ""){

        suggestionsBox.style.display = "none";

        display(products);

        return;
    }

    /* فلترة المنتجات */

    const filteredProducts =
    products.filter(product =>

        product.title
        .toLowerCase()
        .includes(value)

    );

    /* عرض المنتجات */

    display(filteredProducts);

    /* الاقتراحات */

    filteredProducts.forEach(product => {

        const div =
        document.createElement("div");

        div.className =
        "suggestion-item";

        div.textContent =
        product.title;

        div.onclick = () => {

            searchInput.value =
            product.title;

            suggestionsBox.style.display =
            "none";

            display([product]);

        };

        suggestionsBox.appendChild(div);

    });

    /* اظهار الاقتراحات */

    if(filteredProducts.length > 0){

        suggestionsBox.style.display =
        "block";

    }

    else{

        suggestionsBox.style.display =
        "none";
    }

});

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

        /* إزالة active */

        document.querySelectorAll(".category")
        .forEach(c => {

            c.classList.remove("active-category");

        });

        /* إضافة active */

        cat.classList.add("active-category");

        /* بطاقات */

        if(text.includes("بطاقات")){

            filtered =
            products.filter(p =>

                p.category === "cards"

            );

        }

        /* اشتراكات */

        else if(text.includes("اشتراكات")){

            filtered =
            products.filter(p =>

                p.category === "subscriptions"

            );

        }

        /* حسابات */

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

/* صور البانر */

const banners = [

    "https://i.ibb.co/VW4QxFFX/20260528-074526.jpg",

    
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200",

    "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200"

];

let currentBanner = 0;

/* أول صورة */

if(bannerImage){

    bannerImage.src =
    banners[currentBanner];

}

/* تغيير الصورة */

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

    },300);

}

/* تقليب تلقائي */

setInterval(changeBanner, 4000);
