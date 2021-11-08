let lakh = " Lac";
let crore = " Cr";
let billion = " Bn";
let currencySymbol = "₹ "

//INR Currency With Name
function currencyWithNameFormater(num) {
if(num===""||num===null){return 0}
else if (num >= 1000000000) {
    num = (num / 1000000000).toFixed(2) + billion;
     let currency = currencySymbol+num
    return currency
}else if (num >= 10000000) {
    num = (num / 10000000).toFixed(2) + crore;
     let currency = currencySymbol+num
    return currency
}else if (num >= 100000) {
    num = (num / 100000).toFixed(2) + lakh;
     let currency = currencySymbol+num
    return currency
}else{
	let n1, n2;
    num = (num).toFixed(2) + '' || '';
    n1 = num.split('.');
    n2 = n1[1] || null;
    n1 = n1[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    num = n2 ? n1 + '.' + n2 : n1;
    let currency = currencySymbol+num
    return currency;
}
}


//INR Currency 
function currencyFormater(num) {
    if(num===""||num===null){return 0}
    else{
	let n1, n2;
    num = (num).toFixed(2) + '' || '';
    n1 = num.split('.');
    n2 = n1[1] || null;
    n1 = n1[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    num = n2 ? n1 + '.' + n2 : n1;
    let currency = currencySymbol+num
    return currency;
    }

}

//number Formater
function numberFormater(num) {
    if(num===""||num===null){return 0}
    else{
    let n1, n2;
        num = (num).toFixed(2) + '' || '';
        n1 = num.split('.');
        n2 = n1[1] || null;
        n1 = n1[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        if(n2!=0){num = n2 ? n1 + '.' + n2 : n1;}
        else{num =n1}
        let currency = num
        return currency;
    }
}

    export { currencyWithNameFormater,currencyFormater,numberFormater};