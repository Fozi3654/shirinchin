// Shirin Demo — defensive rewrite
(function(){
'use strict';

var products=[
 {id:'choc',name:'کیک شکلاتی ویژه',cat:'کیک',price:795000,desc:'کیک شکلاتی چندلایه با گاناش براق و ورقه‌های شکلات تلخ.',img:'assets/hero-cake.webp',pos:'50% 45%',custom:true},
 {id:'straw',name:'کیک توت‌فرنگی',cat:'کیک',price:825000,desc:'کیک وانیلی لطیف با خامهٔ تازه و توت‌فرنگی روز.',img:'assets/hero-cake.webp',pos:'48% 45%',custom:true},
 {id:'pist',name:'شیرینی پسته‌ای',cat:'شیرینی',price:365000,desc:'تارت کوچک با کرم پسته، زعفران و پستهٔ خردشده.',img:'assets/products.webp',pos:'31% 50%'},
 {id:'mac',name:'ماکارون تمشک',cat:'شیرینی',price:460000,desc:'جعبهٔ شش‌تایی ماکارون بادامی با فیلینگ تمشک.',img:'assets/products.webp',pos:'70% 50%'},
 {id:'pud',name:'دسر زعفرانی',cat:'دسر',price:185000,desc:'دسر لطیف زعفران و گلاب با خلال پسته.',img:'assets/products.webp',pos:'88% 50%'}
];

var storage={
  get:function(k){try{return localStorage.getItem(k);}catch(e){return null;}},
  set:function(k,v){try{localStorage.setItem(k,v);}catch(e){}}
};

var cart=[];
try{cart=JSON.parse(storage.get('shirinCart')||'[]');}catch(e){cart=[];}

var state={page:'shop',filter:'همه',product:null,qty:1,size:'۱۲ نفره',message:'',day:'فردا',time:'۱۴:۰۰ تا ۱۶:۰۰',order:null};

function fmt(n){return n.toLocaleString('fa-IR')+' تومان';}
function save(){storage.set('shirinCart',JSON.stringify(cart));}
function count(){return cart.reduce(function(a,x){return a+x.qty;},0);}
function total(){return cart.reduce(function(a,x){return a+x.price*x.qty;},0);}
function el(s){return document.querySelector(s);}
function img(p,cls){cls=cls||'product-img';return '<img class="'+cls+'" src="'+p.img+'" style="object-position:'+p.pos+'" alt="'+p.name+'">';}
function hdr(){return '<header class="top"><button class="icon" onclick="SH.go(&quot;shop&quot;)">⌂</button><div class="brand">قنادی شیرین</div><span class="demo">دموی تعاملی</span></header>';}

function shop(){
  var list=state.filter==='همه'?products:products.filter(function(p){return p.cat===state.filter;});
  var chips=['همه','کیک','شیرینی','دسر'].map(function(c){return '<button class="chip '+(state.filter===c?'active':'')+'" onclick="SH.filter(&quot;'+c+'&quot;)">'+c+'</button>';}).join('');
  var grid=list.map(function(p){return '<article class="card">'+img(p)+'<div class="card-body"><h3>'+p.name+'</h3><small>'+p.desc.slice(0,42)+'...</small><div class="card-bottom"><span class="price">'+fmt(p.price)+'</span><button class="mini" onclick="SH.go(&quot;detail&quot;,&quot;'+p.id+'&quot;)">مشاهده</button></div></div></article>';}).join('');
  return '<div class="view">'+hdr()+'<section class="hero"><div class="hero-copy"><div class="eyebrow">شیرینیِ لحظه‌های خاص</div><h1>کیک‌های تازه،<br>با عشقِ دست‌ساز</h1><p>برای جشن‌های کوچک و بزرگ؛ تازه پخته، با مواد اولیهٔ خوش‌عطر.</p><button class="btn" onclick="var e=document.getElementById(&quot;products&quot;);if(e)e.scrollIntoView({behavior:&quot;smooth&quot;})">مشاهده محصولات ←</button></div><img src="assets/hero-cake.webp" alt="کیک توت‌فرنگی تازه"></section><main class="content" id="products"><div class="title-row"><h2>محصولات محبوب</h2><span>'+products.length+' محصول</span></div><div class="chips">'+chips+'</div><section class="grid">'+grid+'</section></main>'+floatBtn()+'</div>';
}

function detail(){
  var p=state.product;
  if(!p){state.page='shop';return shop();}
  var custom=p.custom;
  var extra=state.size==='۱۶ نفره'?180000:state.size==='۸ نفره'?-120000:0;
  var html='<div class="view">'+hdr()+'<div class="crumb">فروشگاه / '+p.cat+' / '+p.name+'</div><main class="detail">'+img(p,'detail-image')+'<section><span class="eyebrow">'+p.cat+' تازه</span><h1>'+p.name+'</h1><p>'+p.desc+'</p><div class="price">'+fmt(p.price+extra)+'</div>';
  if(custom){
    var sizes=['۸ نفره','۱۲ نفره','۱۶ نفره'].map(function(s){return '<button class="option '+(state.size===s?'selected':'')+'" onclick="SH.size(&quot;'+s+'&quot;)">'+s+'</button>';}).join('');
    html+='<div class="controls"><label>اندازه کیک</label><div class="options">'+sizes+'</div></div><div class="controls"><label>متن روی کیک <small>(اختیاری)</small></label><input class="textinput" value="'+state.message+'" oninput="SH.msg(this.value)" placeholder="مثلاً: تولدت مبارک آوا"></div>';
  }
  html+='<div class="controls"><label>تعداد</label><div class="quantity"><button onclick="SH.qty(-1)">−</button><b>'+state.qty+'</b><button onclick="SH.qty(1)">+</button></div></div><button class="btn wide" onclick="SH.add(&quot;'+p.id+'&quot;)">افزودن به سبد خرید · '+fmt((p.price+extra)*state.qty)+'</button></section></main>'+floatBtn()+'</div>';
  return html;
}

function floatBtn(){return '<button class="floating-cart" onclick="SH.go(&quot;cart&quot;)">سبد خرید ('+count()+')</button>';}

function cartPage(){
  if(!cart.length)return '<div class="view">'+hdr()+'<main class="empty"><h1>سبد خرید شما خالی است</h1><p>یک شیرینی خوشمزه انتخاب کنید و سفارش آزمایشی‌تان را شروع کنید.</p><button class="btn" onclick="SH.go(&quot;shop&quot;)">بازگشت به فروشگاه</button></main></div>';
  var items=cart.map(function(x){return '<div class="cart-item">'+img(x)+'<div class="info"><b>'+x.name+'</b>'+(x.size?'<small> · '+x.size+'</small>':'')+(x.message?'<small> · «'+x.message+'»</small>':'')+'<div class="price">'+fmt(x.price)+'</div></div><div class="quantity"><button onclick="SH.change(&quot;'+x.key+'&quot;,-1)">−</button><b>'+x.qty+'</b><button onclick="SH.change(&quot;'+x.key+'&quot;,1)">+</button></div><button class="remove" onclick="SH.remove(&quot;'+x.key+'&quot;)">حذف</button></div>';}).join('');
  return '<div class="view">'+hdr()+'<main class="cart"><h1>سبد خرید</h1>'+items+'<div class="summary"><div class="sumrow"><span>مجموع</span><span class="price">'+fmt(total())+'</span></div><button class="btn wide" onclick="SH.go(&quot;checkout&quot;)">ادامه سفارش ←</button></div></main></div>';
}

function checkout(){
  var days=['امروز','فردا','پس‌فردا','شنبه'].map(function(x){return '<button class="slot '+(state.day===x?'selected':'')+'" onclick="SH.day(&quot;'+x+'&quot;)">'+x+'</button>';}).join('');
  var times=['۱۰:۰۰ تا ۱۲:۰۰','۱۴:۰۰ تا ۱۶:۰۰','۱۷:۰۰ تا ۱۹:۰۰'].map(function(x){return '<button class="slot '+(state.time===x?'selected':'')+'" onclick="SH.time(&quot;'+x+'&quot;)">'+x+'</button>';}).join('');
  return '<div class="view">'+hdr()+'<main class="checkout"><h1>زمان تحویل</h1><div class="formcard"><div class="notice">این یک دموی تعاملی است؛ پرداخت، ارسال و ثبت واقعی سفارش انجام نمی‌شود.</div><h3>روز تحویل</h3><div class="days">'+days+'</div><h3>ساعت تحویل</h3><div class="times">'+times+'</div><div class="fields"><input value="ناهید رضایی" aria-label="نام" placeholder="نام گیرنده"><input value="به انتخاب شما" aria-label="یادداشت" placeholder="یادداشت سفارش"></div><button class="btn wide" onclick="SH.finish()">ثبت سفارش آزمایشی ←</button></div></main></div>';
}

function done(){
  var o=state.order;
  if(!o){try{o=JSON.parse(storage.get('shirinOrder')||'null');}catch(e){o=null;}}
  if(!o){state.page='shop';return shop();}
  var items=o.cart.map(function(x){return '<div class="sumrow"><span>'+x.name+' × '+x.qty+'</span><span>'+fmt(x.price*x.qty)+'</span></div>';}).join('');
  return '<div class="view">'+hdr()+'<main class="confirmation"><div class="check">✓</div><h1>سفارش آزمایشی ثبت شد</h1><p>ممنون از شما؛ این سفارش فقط در مرورگر شبیه‌سازی شده است.</p><div class="orderbox"><b>شماره سفارش: '+o.id+'</b><p>تحویل: '+o.day+'، ساعت '+o.time+'</p>'+items+'<hr><div class="sumrow"><span>مجموع</span><span class="price">'+fmt(o.total)+'</span></div></div><button class="btn" onclick="SH.go(&quot;shop&quot;)">شروع سفارش جدید</button></main></div>';
}

function render(){
  try{
    var v;
    if(state.page==='shop')v=shop();
    else if(state.page==='detail')v=detail();
    else if(state.page==='cart')v=cartPage();
    else if(state.page==='checkout')v=checkout();
    else v=done();
    var app=el('#app');
    if(app)app.innerHTML=v;
  }catch(err){
    var app=el('#app');
    if(app)app.innerHTML='<div style="padding:60px;text-align:center;color:#ad1745;font-family:Tahoma"><h1>خطا در بارگذاری</h1><p>'+(err.message||err)+'</p></div>';
  }
}

window.SH={
  go:function(p,id){state.page=p;if(id)state.product=products.find(function(x){return x.id===id;});window.scrollTo(0,0);render();},
  filter:function(c){state.filter=c;render();},
  size:function(s){state.size=s;render();},
  msg:function(v){state.message=v;},
  qty:function(d){state.qty=Math.max(1,state.qty+d);render();},
  day:function(d){state.day=d;render();},
  time:function(t){state.time=t;render();},
  change:function(key,d){var x=cart.find(function(i){return i.key===key;});if(!x)return;x.qty+=d;if(x.qty<1)cart=cart.filter(function(i){return i.key!==key;});save();render();},
  remove:function(key){cart=cart.filter(function(i){return i.key!==key;});save();render();},
  add:function(id){
    var p=products.find(function(x){return x.id===id;});
    if(!p)return;
    var extra=state.size==='۱۶ نفره'?180000:state.size==='۸ نفره'?-120000:0;
    var price=p.price+extra;
    var key=id+'-'+(p.custom?state.size:'')+'-'+(state.message||'');
    var found=cart.find(function(x){return x.key===key;});
    if(found)found.qty+=state.qty;
    else cart.push({id:p.id,name:p.name,cat:p.cat,img:p.img,pos:p.pos,key:key,qty:state.qty,price:price,size:(p.custom?state.size:''),message:state.message});
    save();
    this.go('cart');
  },
  finish:function(){
    var o={id:'SH-'+Math.floor(100000+Math.random()*899999),cart:cart.slice(),day:state.day,time:state.time,total:total()};
    storage.set('shirinOrder',JSON.stringify(o));
    cart=[];save();state.order=o;
    this.go('done');
  }
};

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',render);}else{render();}

})();
