let products = [

    {
        id: "Product-TTU_GP_2Home",
        title: "اشتراك جيم باس شهرين هوم",
        price: "400 جنيه",
        image: "https://i.ibb.co/k2mFSdxR/file-000000006870720aa187ae1f65b31c0a.png",
        category: "subscriptions",
        link: "https://forms.gle/your-form-id-1"
    },

    {
        id: "Product-TTU_GP_ PC6M",
        title: "اشتراك جيم باس للكمبيوتر 6 اشهر",
        price: "400 جنيه",
        image: "https://i.ibb.co/Xk53gBbV/4-20260528-105009.png",
        category: "subscriptions",
        link: "https://forms.gle/your-form-id-2"
    },

    {
        id: "Product-TTU_GP_4_Home",
        title: "اشتراك جيم باس 4 اشهر هوم",
        price: "770 جنيه",
        image: "https://i.ibb.co/WvvzyXtg/4-20260527-111343.png",
        category: "subscriptions",
        link: "https://forms.gle/your-form-id-3"
    },

    {
        id: "Product-TTU_GP_4_sign_in",
        title: "اشتراك جيم باس 4 اشهر ساين",
        price: "700 جنيه",
        image: "https://i.ibb.co/WvvzyXtg/4-20260527-111343.png",
        category: "subscriptions",
        link: "https://forms.gle/your-form-id-4"
    },

    {
        id: "Product-TTU_GP_6_Home",
        title: "اشتراك جيم باس 6 اشهر هوم",
        price: "1000 جنيه",
        image: "https://i.ibb.co/mFM9RxMm/4-20260527-111437.png",
        category: "subscriptions",
        link: "https://forms.gle/your-form-id-5"
    },

    {
        id: "Product-TTU_GP_6_sign_in",
        title: "اشتراك جيم باس 6 اشهر ساين",
        price: "950 جنيه",
        image: "https://i.ibb.co/mFM9RxMm/4-20260527-111437.png",
        category: "subscriptions",
        link: "https://forms.gle/your-form-id-6"
    },

    {
        id: "Product-TTU_GP_2sign_in",
        title: "اشتراك جيم باس شهرين ساين",
        price: "350 جنيه",
        image: "https://i.ibb.co/k2mFSdxR/file-000000006870720aa187ae1f65b31c0a.png",
        category: "subscriptions",
        link: "https://forms.gle/your-form-id-7"
    },

    {
        id: "Product-TTU_GP_PC2m",
        title: "اشتراك جيم باس للكمبيوتر شهرين",
        price: "150 جنيه",
        image: "https://i.ibb.co/hRWphKNR/file-0000000065087246bf59030366c07377.png",
        category: "subscriptions",
        link: "https://forms.gle/your-form-id-8"
    },

    {
        id: "Product-TTU_MORTAL_kombat11_pc_xbox",
        title: "Full Account Mortal Kombat 11 Ultimate Pc & Xbox",
        price: "150 جنيه",
        image: "https://i.ibb.co/4DSh0KC/0c1dd3670f266369c57f2636688ace65.jpg",
        category: "accounts",
        link: "https://forms.gle/your-form-id-9"
    },

    {
        id: "Product-TTU_BATTLEFIELD_V_XBOX",
        title: "Full Account Battlefield Xbox",
        price: "270 جنيه",
        image: "https://i.ibb.co/wbpRs0M/Battlefield-V.jpg",
        category: "accounts",
        link: "https://forms.gle/your-form-id-10"
    },

    {
        id: "Product-TTU_A_WAY_OUT_Xbox",
        title: "Full Account A Way Out Xbox",
        price: "150 جنيه",
        image: "https://i.ibb.co/6cHByWhJ/IMG.png",
        category: "accounts",
        link: "https://forms.gle/your-form-id-11"
    },

    {
        id: "Product-TTU_Cuphead_xbox",
        title: "Full Account Cuphead Xbox",
        price: "150 جنيه",
        image: "https://i.ibb.co/pvPFZDjy/image.png",
        category: "accounts",
        link: "https://forms.gle/your-form-id-12"
    },

    {
        id: "Product-TTU_BACK_4_BLOOD_Ultimate_xbox_pc",
        title: "Full Account Back 4 Blood Ultimate pc & Xbox",
        price: "270 جنيه",
        image: "https://i.ibb.co/Hf1H4J6P/IMG.png",
        category: "accounts",
        link: "https://forms.gle/your-form-id-13"
    },

    {
        id: "Product-TTU_NBA_2K_2026",
        title: "Full Account NBA 2K 2026 Xbox",
        price: "700 جنيه",
        image: "https://i.ibb.co/TSP72PB/12568c672cf8df5b6f717500ec179736.jpg",
        category: "accounts",
        link: "https://forms.gle/your-form-id-14"
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

    const container = document.getElementById("productsContainer");

    if(reset){
        container.innerHTML = "";
        currentIndex = 0;
        currentProducts = items;
    }

    const nextProducts = currentProducts.slice(
        currentIndex,
        currentIndex + PRODUCTS_PER_LOAD
    );

    nextProducts.forEach(p => {

        container.innerHTML += `

        <div class="product-card">

            <img src="${p.image}" loading="lazy" alt="${p.title}">

            <div class="product-info">

                <div class="product-title">
                    ${p.title}
                </div>

                <div class="product-price">
                    ${p.price}
                </div>

                <button class="product-buy-btn" onclick="openBuyModal('${p.title.replace(/'/g, "\\'")}', '${p.price}', '${p.link}')">
                    شراء الآن
                </button>

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

const loadMoreBtn = document.createElement("button");

loadMoreBtn.className = "load-more-btn";

loadMoreBtn.innerText = "تحميل المزيد";

loadMoreBtn.onclick = () => {
    display(currentProducts, false);
};


const loadMoreBox = document.createElement("div");

loadMoreBox.className = "load-more-box";

loadMoreBox.appendChild(loadMoreBtn);

document.body.appendChild(loadMoreBox);


function updateLoadMoreButton(){

    if(currentIndex >= currentProducts.length){
        loadMoreBtn.style.display = "none";
    }
    else{
        loadMoreBtn.style.display = "block";
    }
}


/* ======================
   أول تشغيل
====================== */

display(products);


/* ======================
   السيرش + الفلترة
====================== */

const searchInput = document.getElementById("searchInput");

const suggestionsBox = document.getElementById("suggestions");


if(searchInput){

    searchInput.addEventListener("input", function(){

        const value = this.value.toLowerCase().trim();

        suggestionsBox.innerHTML = "";

        if(value === ""){
            suggestionsBox.style.display = "none";
            display(products);
            return;
        }

        const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(value)
        );

        display(filteredProducts);

        filteredProducts.forEach(product => {

            const div = document.createElement("div");
            div.className = "suggestion-item";
            div.textContent = product.title;
            div.onclick = () => {
                searchInput.value = product.title;
                display([product]);
                suggestionsBox.style.display = "none";
            };

            suggestionsBox.appendChild(div);

        });

        if(filteredProducts.length > 0){
            suggestionsBox.style.display = "block";
        }
        else{
            suggestionsBox.style.display = "none";
        }

    });

}


/* ======================
   اغلاق الاقتراحات
====================== */

document.addEventListener("click", function(e){

    if(!e.target.closest(".search-wrapper")){
        suggestionsBox.style.display = "none";
    }

});


/* ======================
   التصنيفات
====================== */

document.querySelectorAll(".category").forEach(cat => {

    cat.addEventListener("click", () => {

        const text = cat.textContent.trim();

        let filtered = [];

        document.querySelectorAll(".category").forEach(c => {
            c.classList.remove("active-category");
        });

        cat.classList.add("active-category");

        if(text.includes("بطاقات")){
            filtered = products.filter(p => p.category === "cards");
        }
        else if(text.includes("اشتراكات")){
            filtered = products.filter(p => p.category === "subscriptions");
        }
        else if(text.includes("حسابات")){
            filtered = products.filter(p => p.category === "accounts");
        }

        display(filtered);

    });

});


/* ======================
   البانر مع الروابط
====================== */

const bannerImage = document.getElementById("bannerImage");

const banners = [
    {
        image: "https://i.ibb.co/Q7sBq2Ld/20260528-074526.jpg",
        link: "#subscriptions"
    },
    {
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200",
        link: "#accounts"
    },
    {
        image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200",
        link: "#cards"
    }
];

let currentBanner = 0;


if(bannerImage){
    bannerImage.src = banners[currentBanner].image;
    bannerImage.onclick = () => {
        // يمكنك تخصيص الرابط حسب البانر
        if(banners[currentBanner].link === "#subscriptions"){
            document.querySelectorAll(".category")[1].click();
        }
        else if(banners[currentBanner].link === "#accounts"){
            document.querySelectorAll(".category")[2].click();
        }
    };
}


function changeBanner(){

    if(!bannerImage) return;

    bannerImage.style.opacity = 0;

    setTimeout(() => {

        currentBanner++;

        if(currentBanner >= banners.length){
            currentBanner = 0;
        }

        bannerImage.src = banners[currentBanner].image;

        bannerImage.style.opacity = 1;

    }, 300);

}


setInterval(changeBanner, 4000);


/* ======================
   Modal للشراء
====================== */

function openBuyModal(productTitle, productPrice, formLink){
    const modal = document.getElementById("buyModal");
    document.getElementById("productTitle").textContent = productTitle;
    document.getElementById("productPrice").textContent = productPrice;
    document.getElementById("buyFormLink").href = formLink;
    modal.style.display = "block";
}

function closeBuyModal(){
    document.getElementById("buyModal").style.display = "none";
}

window.onclick = function(event){
    const modal = document.getElementById("buyModal");
    if(event.target == modal){
        modal.style.display = "none";
    }
}

/* ======================
   إنشاء Footer
====================== */

function createFooter(){
    const footer = document.createElement("footer");
    footer.innerHTML = `
        <div class="footer-content">
            <div class="footer-section">
                <h3>📱 تواصل معنا</h3>
                <div class="social-icons">
                    <a href="https://www.facebook.com/your-page" target="_blank" title="Facebook">f</a>
                    <a href="https://www.whatsapp.com" target="_blank" title="WhatsApp">W</a>
                    <a href="https://t.me/your-channel" target="_blank" title="Telegram">✈</a>
                    <a href="mailto:your-email@example.com" title="Email">✉</a>
                </div>
            </div>

            <div class="footer-section">
                <h3>ℹ️ معلومات</h3>
                <ul>
                    <li><a href="#about">عن المتجر</a></li>
                    <li><a href="#privacy">سياسة الخصوصية</a></li>
                    <li><a href="#terms">شروط الاستخدام</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h3>💳 طرق الدفع</h3>
                <ul>
                    <li><a href="#payment">تحويل بنكي</a></li>
                    <li><a href="#payment">فودافون كاش</a></li>
                    <li><a href="#payment">اورنج موني</a></li>
                    <li><a href="#payment">محفظة رقمية</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h3>🎯 آخر المنتجات</h3>
                <ul>
                    <li><a href="#subscriptions">الاشتراكات</a></li>
                    <li><a href="#accounts">الحسابات</a></li>
                    <li><a href="#cards">البطاقات</a></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; 2024 TTU STORE - جميع الحقوق محفوظة</p>
        </div>
    `;
    document.body.appendChild(footer);
}

// إنشاء Footer عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", createFooter);
