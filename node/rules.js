const rules = {
    "XIAOMI" : {
        "url" : "https://www.mi.com/p/1915.html",
        "rule": `.product-cell@list {
            h3{$name};
            p.desc{$desc};
            p.price{$price};
            img[data-src=$imgUrl];
            a[href=$link];
        }`
    },
    "NUBIYA" : {
        "url" : "https://shop.nubia.com/phone",
        "rule": `#searchBlock li@list {
            h2{$name};
            span{$peizhi};
            img[src=$imgUrl];
            .price span{$price};
            a[href=$link];
        }`
    }
}

module.exports = rules;