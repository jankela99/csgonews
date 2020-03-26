window.onload = function(){
    $.ajax({
        url:"assets/data/menu.json",
        method: "GET",
        type: "JSON",
        success: function(data){
            let ispis = "<ul>";
            data.forEach(stavka =>{
                if(strana.indexOf(stavka.href)!==-1){
                    ispis += `
                <li class="aktivan">
                    
                    <a href="${stavka.href}">${stavka.content}</a>
                </li>`;
                }else{
                    ispis += `
                    <li>
                        <a href="${stavka.href}">${stavka.content}</a>
                    </li>`;
                }
                
                
            });
            ispis+="</ul>";

            document.getElementById("navigacija").innerHTML = ispis;
            document.getElementById("respMeni").innerHTML = ispis;
        },
        error: function(err){
            console.error(err);
        }
    });

    $.ajax({
        url: "assets/data/soc.json",
        method: "GET",
        dataType: "json",
        success: function(data){
            let ispis = `<ul class="d-flex justify-content-around w-50">`;
            data.forEach(stavka =>{
                ispis+=`
                <li>
                    <a href="${stavka.href}" target="_blank">
                        <i class="${stavka.icon}" aria-hidden="true"></i>
                    </a>
                </li>`
            });
            ispis+=`</ul>`;

            document.getElementById("socFuter").innerHTML = ispis;
        },
        error: function(err){
            console.error(err);
        }
    });

    $.ajax({
        url: "assets/data/futer.json",
        method: "GET",
        dataType: "json",
        success: function(data){
            let ispis= "<ul>";
            data.forEach(el =>{
                ispis+= `
                <li>
                    <a href="${el.href}" target="_blank">${el.content}</a>
                </li>`;
            });
            ispis+=`</ul>`;

            document.getElementById("linkoviFuter").innerHTML = ispis;
        },
        error: function(err){
            console.error(err);
        }
    })

    
    var strana = window.location.href;
    
    if(strana.indexOf("index.html")!==-1){
        $("#navigacija ul li a [href]").each(function(){
            if(this.href == strana){
                $(this).addClass("aktivan");
            }
        })
    }


    else if(strana.indexOf("teams.html")!==-1){
        pripremaZaTimove();
        document.querySelector("#search").addEventListener("keyup", pretraziTimove);
        document.getElementById("sortEarning").addEventListener("change", sortirajTimove);

    }

    else if(strana.indexOf("news.html")!==-1){
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'showImageNumberLabel': false,
            'disableScrolling': true
        });
        pripremaZaVesti();
        
    }

    else if(strana.indexOf("players.html")!==-1){
        localStorage.setItem("cekiraneZarade", 1);
        localStorage.setItem("cekiraniTimovi", "g");
        pripremaZaIgrace();
        pripremiTimoveFilter();
        document.querySelector("#search").addEventListener("keyup", pretraziIgrace);
        let zaradeIgraca = [[0,200000],[200000,400000],[400000,600000],[600000,800000],[800000,1000000],[1000000,2000000]];
        ispisiZaradeFilter(zaradeIgraca);
        document.getElementById("sortEarning").addEventListener("change", sortirajIgrace);
        if(localStorage){
            localStorage.removeItem("SortZarada");
        }
    }


    else if(strana.indexOf("yourteam.html")!==-1){
        $("#praviTim").hide();
        $("#izLocala").hide();
        if(localStorage){
            var imenaIzLocala = localStorage.getItem("nizImena");
            var idIzLocala = localStorage.getItem("nizIgraci");
            
            if(idIzLocala && imenaIzLocala){
                imenaIzLocala = imenaIzLocala.split(",");
                idIzLocala = idIzLocala.split(",");
                $("#forma").hide();
                $("#inicijalno").hide();
                $("#praviTim").show();
                $("#izLocala").show();
                ispisIzLocala(imenaIzLocala, idIzLocala);
            }
        }
        ispisiDDl();
        $("#btnPosalji").click(proveriFormu);
    }

    $('#strelicaGore').click(function(){
        $('html').animate({scrollTop: 0}, 250);
    });

    $(window).scroll(function(){

        var udaljen = $(this).scrollTop();
        if(udaljen > 200) 
        {
            $('#strelicaGore').css('display','block');
        }
        else
        {
            $('#strelicaGore').css('display', 'none');
        }

    });

    $('.hamburger').click(function(){
        $('.meniResponsive').toggleClass('meniResp1');
        $('.meniResponsive ul li a').click(function(){
            $('.meniResponsive').removeClass('meniResp1');
        });
    });
}

function pripremaZaVesti(){
    $.ajax({
        url: "assets/data/news.json",
        method: "GET",
        dataType: "json",
        success: function(data){
            ispisiVesti(data);
            ispisiNajnovijeVesti(data);
        },
        error: function(err){
            console.error(err);
        }
    })
}

function ispisiNajnovijeVesti(podaci) {
    podaci.sort((a,b) => {
    const datum1 = new Date(a.datum);
    const datum2 = new Date(b.datum);
    return Date.UTC(datum2.getFullYear(), datum2.getMonth(), datum2.getDate()) - Date.UTC(datum1.getFullYear(), datum1.getMonth(), datum1.getDate()); 
    });
    const najnovijeVesti = podaci.slice(0, 3);
    // console.log(najnovijeVesti);
    let ispis ="";
    najnovijeVesti.forEach(vest=>{
        ispis+=`
        <div class=" col-10 p-4 mx-auto vesti1">
            <div class=" p-3">
                <h3 class="text-center pt-3">${vest.naslov}</h3>
                <div class="row d-flex align-items-center mt-3">
                    <div class="col-12 col-lg-6">
                        <img class="img-fluid w-100 p-3" src="assets/images/news/${vest.slika.src}" alt="${vest.slika.alt}">
                    </div>
                    <div class="text-justify col-12 col-lg-6">
                        <p>${vest.tekstovi.glavni}</p>
                        <p>${vest.tekstovi.dodatni1}</p>
                    </div>
                </div>
                <div class="d-flex justify-content-between">
                    <p class="font-weight-bolder linija">Date:&nbsp;<span class="h5">${vest.datum}</span></p>
                    <p class="font-weight-bolder linija">Author: <span class="h5">${vest.autor.ime}</span></pclass="font-weight-bolder">
                </div>
            </div>
        </div>`;
    })
    document.getElementById("najnovijeVesti").innerHTML = ispis;
    $('.vestiSlider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows:false
    });
}

function ispisiVesti(podaci){
    let ispis = "";
    podaci.forEach(vest =>{
        ispis+=`
        <div class=" col-12 col-md-6 col-lg-4 d-flex flex-column p-3">
            <div class="drzac p-3">
                <h3 class="text-center pt-3">${vest.naslov}</h3>
                <div>
                    <a href="assets/images/news/${vest.slika.src}" data-lightbox="paketi"><img class="img-fluid w-100 p-3" src="assets/images/news/${vest.slika.src}" alt="${vest.slika.alt}"></a>
                    <p class="text-justify p-4">${vest.tekstovi.glavni}</p>
                </div>
                <div class="text-center">
                    <input type="button" class="btn btn-danger btnToggle" value="Read more">
                    <div class="tekst pt-4 text-justify">
                        <p>${vest.tekstovi.dodatni1}</p>
                        <p>${vest.tekstovi.dodatni2}</p>
                    </div>
                </div>
                <div class="d-flex justify-content-between pt-5">
                    <p class="font-weight-bolder linija">Date:&nbsp;<span class="h5">${vest.datum}</span></p>
                    <p class="font-weight-bolder linija">Author: <span class="h5">${vest.autor.ime}</span></pclass="font-weight-bolder">
                </div>
            </div>
        </div>`
    });
    document.getElementById("vesti").innerHTML = ispis;
    $(".tekst").hide();
    $(".btnToggle").click(function(){
        if($(this).val()=="Read more"){
            $(this).val("Hide");
        }
        else{
            $(this).val("Read more");
        }
        // alert("radi")
    $(this).next().toggle();
    });
}

function pripremaZaTimove(){
    $.ajax({
        url:"assets/data/teams.json",
        method: "GET",
        dataType: "JSON",
        success: function(data){
            ispisiTimove(data);
        },
        error: function(err){
            console.error(err);
        }
    })
}

function ispisiTimove(timovi){
    let ispis = "";
    timovi.forEach(tim => {
        ispis += `
        <div class="col-12 col-md-6 col-lg-4 text-center p-2 tim mx-auto">
            <div class="p-4 drzac">
            <div class="row">
                <div class="col-12 col-xl-5">
                    <h3 class="h3">${tim.ime}</h3>
                    <img src="assets/images/teams/${tim.photo}" alt="${tim.ime} logo" class="img-fluid">
                </div>
                <div class="col-12 col-xl-7 d-flex flex-column justify-content-center">
                    <p>World ranking:<span class="font-weight-bold"> ${tim.rank}</span></p>
                    <p>Location: <span class="font-weight-bold">${tim.location.name}</span></p>
                    <p>Total Winnings: <span class="font-weight-bold">$${tim.winnings}</span></p>
                    <p>Weeks in top30 for core: <span class="font-weight-bold">${tim.top30weeks}</span></p>
                    <p>Average player age: <span class="font-weight-bold">${tim.averagePlayersAge}</span></p>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <p><span class="font-weight-bold">Plyers:</span> ${ispisIgraca(tim.players)}</p>
                </div>
            </div>
            </div>
        </div>`;
    });
    document.getElementById("teams").innerHTML = ispis;
}

function pripremaZaIgrace(){
    $.ajax({
        url:"assets/data/players.json",
        method: "GET",
        dataType: "JSON",
        success: function(data){
            ispisiIgrace(data);

        },
        error: function(err){
            console.error(err);
        }
    })
}

function ispisiIgrace(podaci){
    let ispis = "";
    podaci.forEach(igrac=>{
        ispis+=`
        <div class="col-12 col-sm-6 col-lg-4 p-3 okvir mx-auto">
            <div class="drzac p-2">
                <div class="row d-flex flex-lg-column flex-xl-row align-items-center">
                    <div class="col-md-4 col-lg-8 col-xl-4">
                        <img class="img-fluid" src="assets/images/players/${igrac.photo}" alt="Photo of ${igrac.nick}">
                    </div>
                    <div class="text-center col-md-8 col-lg-12 col-xl-8 d-flex flex-column">
                        <h2 class="text-sm-center text-md-left text-lg-center text-xl-left">${igrac.nick}</h2>
                        <p class="text-center text-sm-center text-md-left text-lg-center text-xl-left">${igrac.name.firstname} ${igrac.name.lastname}</p>
                        <div class="d-flex justify-content-between linija">
                            <p>Age</p>
                            <p>${igrac.age} years</p>
                        </div>
                        <div class="d-flex justify-content-between linija pt-1">
                            <p>Current team</p>
                            <p>${igrac.team.name}</p>
                        </div>
                        <div class="d-flex justify-content-between linija pt-1">
                            <p>Winnings</p>
                            <p>$${igrac.winnings}</p>
                        </div>
                        <div class="d-flex justify-content-between pt-1">
                            <p>Trophies</p>
                            <p>${igrac.trophies}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
    document.getElementById("players").innerHTML = ispis;
    
}

function ispisIgraca(igraci){
    let ispis ="";
    igraci.forEach((igrac, indeks) =>{
        // console.log(igrac);
        // console.log(indeks);
        indeks == 0 ? ispis+=igrac : ispis+=", "+igrac;
    });
    return ispis;
}

function pretraziIgrace(){
    const uneto = this.value;

    $(":checkbox").prop("checked", false);

    // console.log(uneto);
    $.ajax({
        url: "assets/data/players.json",
        method: "GET",
        dataType: "json",
        success: function(data){
            let filtriraniIgraci = data.filter(igrac =>{
                if(igrac.nick.toLowerCase().indexOf(uneto.toLowerCase()) !== -1 || igrac.name.firstname.toLowerCase().indexOf(uneto.toLowerCase()) !== -1 || igrac.name.lastname.toLowerCase().indexOf(uneto.toLowerCase()) !== -1){
                    return true;
                }
            });
            // console.log(filtriraniIgraci);
            // ispisiIgrace(filtriraniIgraci);
            if(filtriraniIgraci.length!=0){
                ispisiIgrace(filtriraniIgraci);
                
            }else{
                nemaKombinacija();
            }
        },
        error: function(err){
            console.error(err);
        }
    });
}

function pretraziTimove(){
    const uneto = this.value;
    // console.log(uneto);
    $.ajax({
        url: "assets/data/teams.json",
        method: "GET",
        dataType: "json",
        success: function(data){
            let filtriraniTimovi = data.filter(tim =>{
                if(tim.ime.toLowerCase().indexOf(uneto.toLowerCase()) !== -1)
                    return true;
            });
            // ispisiTimove(filtriraniTimovi);
            if(filtriraniTimovi.length!=0){
                ispisiTimove(filtriraniTimovi);
                
            }else{
                nemaKombinacijaTimovi();
            }
        },
        error: function(err){
            console.error(err);
        }
    })
}

function pripremiTimoveFilter(){
    $.ajax({
        url: "assets/data/teams.json",
        method: "GET",
        dataType: "json",
        success: function(data){
            ispisiTimoveFilter(data);
        },
        error: function(err){
            console.error(err);
        }
    })
}

function ispisiTimoveFilter(timovi){
    // console.log(timovi);
    let ispis="";
    timovi.forEach(tim=>{
        ispis+=`
        <div class="form-check">
        <input type="checkbox" class="form-check-input chkTim" data-idTeam="${tim.id}">
        <label class="form-check-label">${tim.ime}</label></div>`;
    });
    document.getElementById("filterTim").innerHTML = ispis;
    $(".chkTim").change(filtrirajpoTimovima);
    // $(".chkTim").click(sortirajSveIgraci);

}

function ispisiZaradeFilter(niz){
    // console.log(niz);
    let ispis = "";
    for(let i = 0; i<niz.length; i++){
        ispis+=`<div class="form-check">
        <input type="checkbox" class="form-check-input chkZarada" data-idZarade="${niz[i][0]}-${niz[i][1]}">
        <div class="d-flex justify-content-between align-left">
            <div><label class="form-check-label">$${niz[i][0]}</label></div>
            <p>-</p>
            <div><label class="form-check-label">$${niz[i][1]}</label></div>
        </div>
        </div>`;
    }
    document.getElementById("filterEarning").innerHTML = ispis;
    $(".chkZarada").click(filtrirajPoZaradiIgraca);
    // $(".chkZarada").change(sortirajSveIgraci);

}



function sortirajIgrace(){
    const izbor = this.value;

    if(localStorage){
        localStorage.setItem("SortZarada", izbor);
    }
    sortirajSveIgraci();
}

function sortirajTimove(){
    const izbor = this.value;
    // console.log(izbor);
    $.ajax({
        url: "assets/data/teams.json",
        method: "GET",
        dataType: "json",
        success: function(data){
            var sortirani = data.sort((a,b)=>{
                if(izbor == "rASC"){
                    if(a.rank> b.rank)
                        return 1;
                    if(a.rank < b.rank)
                        return -1;
                    else
                        return 0;
                }
                if(izbor == "rDESC"){
                    if(a.rank < b.rank)
                        return 1;
                    if(a.rank > b.rank)
                        return -1
                    else
                        return 0;
                }
                if(izbor == "wASC"){
                    if(a.winnings > b.winnings)
                        return 1;
                    if(a.winnings < b.winnings)
                        return -1;
                    else
                        return 0;
                }
                if(izbor == "wDESC"){
                    if(a.winnings < b.winnings)
                        return 1;
                    if(a.winnings > b.winnings)
                        return -1;
                    else
                        return 0;
                }
            });
            ispisiTimove(sortirani);
        }
    })
}

function filtrirajpoTimovima(){
    const izabrani = this.dataset.idteam;
    let nizCekTim = [];
    let cekirani = document.getElementsByClassName("chkTim");
    for(let i=0; i<cekirani.length;i++){
        if(cekirani[i].checked){
            nizCekTim.push(cekirani[i].dataset.idteam);
        }
    }
    // console.log(nizCekTim)

    if(localStorage){
        localStorage.setItem("cekiraniTimovi", JSON.stringify(nizCekTim));
    }

    sortirajSveIgraci();

    
}

function filtrirajPoZaradiIgraca(){
    let izabrani = this.dataset.idzarade;
    console.log(izabrani);
    let nizCekZarade = [];
    let cekirani = document.getElementsByClassName("chkZarada");
    for(let i=0; i<cekirani.length;i++){
        if(cekirani[i].checked){
            nizCekZarade.push(cekirani[i].dataset.idzarade);
        }
    }
    // console.log(nizCekZarade)

    if(localStorage){
        localStorage.setItem("cekiraneZarade", JSON.stringify(nizCekZarade));
    }

    sortirajSveIgraci();

    
}


function ispisiDDl(){
    $.ajax({
        url: "assets/data/players.json",
        method: "GET",
        dataType: "json",
        success: function(data){
            let ispis = `<option value="0">Choose player</option>`;
            data.forEach(igrac => {
                ispis+=`<option value="${igrac.id}">${igrac.nick}</option>`;
            });
            $(".igraci").html(ispis)
        }
    })
}

function proveriFormu(){
    // alert("tu smo");
    let ime = document.getElementById("ime");
    let imeTima = document.getElementById("timIme");
    let igrac1 = document.getElementById("igrac1");
    let igrac2 = document.getElementById("igrac2");
    let igrac3 = document.getElementById("igrac3");
    let igrac4 = document.getElementById("igrac4");
    let igrac5 = document.getElementById("igrac5");

    let imeRegex = /^[A-Z][a-z]{2,19}$/;
    let imeTimaRegex = /^[A-z\d]{2,20}$/;

    let greskaIme = "Name is not in good format.";
    let greskaImeTima = "Teams name is not in good format.";
    let greskaIgrac = "You need to choose player.";
    let greskaIgrac1 = "You need to choose other player.";

    let poljeZaGreskuIme = document.getElementById("greskaIme");
    let poljeZaGreskuImeTima = document.getElementById("greskaTima");
    let poljeZaGreskuIgrac1 = document.getElementById("greskaIgrac1");
    let poljeZaGreskuIgrac2 = document.getElementById("greskaIgrac2");
    let poljeZaGreskuIgrac3 = document.getElementById("greskaIgrac3");
    let poljeZaGreskuIgrac4 = document.getElementById("greskaIgrac4");
    let poljeZaGreskuIgrac5 = document.getElementById("greskaIgrac5");

    var imena = [];
    var igraci = [];
    var greske = [];
    // var validno = true;

    proveriRegEx(ime, imeRegex, poljeZaGreskuIme, greskaIme, imena, greske);
    proveriRegEx(imeTima, imeTimaRegex, poljeZaGreskuImeTima, greskaImeTima, imena, greske);
    proveriIgraca(igrac1,igrac2, igrac3, igrac4, igrac5, poljeZaGreskuIgrac1, greskaIgrac, greskaIgrac1,igraci,greske);
    proveriIgraca(igrac2,igrac1, igrac3, igrac4, igrac5, poljeZaGreskuIgrac2, greskaIgrac, greskaIgrac1,igraci,greske);
    proveriIgraca(igrac3,igrac2, igrac1, igrac4, igrac5, poljeZaGreskuIgrac3, greskaIgrac, greskaIgrac1,igraci,greske);
    proveriIgraca(igrac4,igrac2, igrac3, igrac1, igrac5, poljeZaGreskuIgrac4, greskaIgrac, greskaIgrac1,igraci,greske);
    proveriIgraca(igrac5,igrac2, igrac3, igrac4, igrac1, poljeZaGreskuIgrac5, greskaIgrac, greskaIgrac1,igraci,greske);

    if(greske.length == 0){
        $("#forma").hide();
        $("#inicijalno").hide();
        $("#praviTim").show();
        $("#izLocala").show();
        if(localStorage){
            localStorage.setItem("nizImena", imena);
            localStorage.setItem("nizIgraci", igraci);
            ispisIzLocala(imena,igraci);
        }
    }
}

function proveriRegEx(polje, regex, poljeGreska, greska, niz, greske){
    if(!regex.test(polje.value)){
        poljeGreska.innerHTML = greska;
        polje.style.border = "2px solid red";
        // console.log(greska);
        greske.push(greska);
    }
    else{
        niz.push(polje.value);
        poljeGreska.innerHTML = "";
        polje.style.border = "2px solid green";
    }
}

function proveriIgraca(igrac1, igrac2, igrac3, igrac4, igrac5, poljeZaGresku, greska, greska1, igraci, greske){
    if(igrac1.value == 0){
        poljeZaGresku.innerHTML = greska;
        greske.push(greska)
        igrac1.style.border = "2px solid red";
    }
    else if(!(igrac1.value != igrac2.value && igrac1.value != igrac3.value && igrac1.value != igrac4.value && igrac1.value != igrac5.value)){
        poljeZaGresku.innerHTML = greska1;
        greske.push(greska1)
        igrac1.style.border = "2px solid red";
    }
    else{
        // igraci.push(igrac1.value);
        poljeZaGresku.innerHTML = "";
        igrac1.style.border = "2px solid green";
        igraci.push(igrac1.value)
    }
}

function ispisIzLocala(imena, id){
    
    $.ajax({
        url:"assets/data/players.json",
        method: "GET",
        dataType: "json",
        success: function(data){
            let ispis = `
            <div class="col-12"><div class="row">
            <div class="col-12 text-center mt-4 mb-5">
                <h2>Here is your dream team: <span class="h1">${imena[1]}</span></h2>
            </div></div></div><div class="col-12"><div class="row d-flex justify-content-around mt-2">`;
            const nizIgraca = data.filter(igrac=>{
                for(let i of id){
                    if(igrac.id == i){
                        return true;
                    }
                }
                
            });
            // console.log(nizIgraca);
            nizIgraca.forEach(igrac=>{
                ispis+=`
                <div class="col-sm-6 col-md-4 col-lg-2 p-3">
                    <div class="drzac d-flex flex-column align-items-center p-2">
                    <h4>${igrac.nick}</h4>
                    <img src="assets/images/players/${igrac.photo}" alt="Photo of ${igrac.nick}" class="img-fluid">
                    </div>
                </div>`;
            });
            ispis+=`
            <div class="col-12 text-center mt-5">
                <button type="button" class="btn btn-danger mt-3 mb-5" id="brisiLocal">Make a new one</button>
            </div></div></div>`;

            document.getElementById("izLocala").innerHTML = `
            <h2>Hello ${imena[0]}!</h2>
            <h3>Find out informations about your Dream Team below</h3>`
            document.getElementById("praviTim").innerHTML = ispis;
            $("#brisiLocal").click(brisiLocal);
        }
    });
}

function brisiLocal(){
    if(localStorage){
        localStorage.clear();
    }
    $("#praviTim").hide();
    $("#izLocala").hide();
    $("#forma").show();
    $("#inicijalno").show();
    document.getElementById("formaa").reset();
    $(".skloni").css("border", "none");
}

function sortirajSveIgraci(){
    
    if(localStorage){
        let cekZarade, cekTimovi, cekSort;
        let odcekiraneZarade = [];
        let odcekiraniIgraci = [];
        let igraciNiz = [];
        let konacanNiz = [];
        let zaradeNiz = [];
        if(JSON.parse(localStorage.getItem("cekiraneZarade"))){
            cekZarade = JSON.parse(localStorage.getItem("cekiraneZarade"));
        }
        // console.log(cekZarade);
        if(localStorage.getItem("cekiraniTimovi")!="g"){
            cekTimovi = JSON.parse(localStorage.getItem("cekiraniTimovi"));
        }
        else{
            cekTimovi = localStorage.getItem("cekiraniTimovi");

        }
        // console.log(cekTimovi)
        if(localStorage.getItem("SortZarada")){
            cekSort = localStorage.getItem("SortZarada");
        }
        console.log(cekTimovi)
        // console.log(cekSort)
        // console.log(JSON.parse(localStorage.getItem("cekiraniTimovi")));
        $.ajax({
            url: "assets/data/players.json",
            method: "GET",
            dataType: "json",
            success: function(data){
                if(cekTimovi != "g"){
                    // alert("1");
                    for(let el of cekTimovi){
                        for(let tim of data){
                            if(el == tim.team.id){
                                igraciNiz.push(tim);
                            }
                        }
                    }
                    if(cekSort == "wASC"){
                        igraciNiz.sort((a,b)=>{
                            if(a.winnings > b.winnings)
                                return 1;
                            if(a.winnings < b.winnings)
                                return -1;
                            else
                                return 0;
                        })
                    }
                    if(cekSort == "wDESC"){
                        igraciNiz.sort((a,b)=>{
                            if(a.winnings < b.winnings)
                                return 1;
                            if(a.winnings > b.winnings)
                                return -1;
                            else
                                return 0;
                        })
                    }
                    if(cekZarade!=1){
                        for(let el of cekZarade){
                            zaradeNiz.push(el.split("-"));
                        }
                        for(let nesto of igraciNiz){
                            for(let el of zaradeNiz){
                                if(nesto.winnings>= el[0] && nesto.winnings<= el[1]){
                                    konacanNiz.push(nesto);
                                }
                            }
                        }
                        if(konacanNiz.length!=0){
                            ispisiIgrace(konacanNiz);
                            
                        }else{
                            nemaKombinacija();
                        }
                    }
                    else{
                        ispisiIgrace(igraciNiz);
                    }
                }
                else{
                    // alert("asdasd")
                    if(cekSort == "wASC"){
                        data.sort((a,b)=>{
                            if(a.winnings > b.winnings)
                                return 1;
                            if(a.winnings < b.winnings)
                                return -1;
                            else
                                return 0;
                        })
                    }
                    if(cekSort == "wDESC"){
                        data.sort((a,b)=>{
                            if(a.winnings < b.winnings)
                                return 1;
                            if(a.winnings > b.winnings)
                                return -1;
                            else
                                return 0;
                        })
                    }
                    if(cekSort == "0"){
                        ispisiIgrace(data);
                    }
                    if(cekZarade!=1){
                        for(let el of cekZarade){
                            zaradeNiz.push(el.split("-"));
                        }
                        for(let nesto of data){
                            for(let el of zaradeNiz){
                                if(nesto.winnings>= el[0] && nesto.winnings<= el[1]){
                                    konacanNiz.push(nesto);
                                }
                            }
                        }
                        ispisiIgrace(konacanNiz);
                        // console.log(konacanNiz);
                    }
                    else{
                        ispisiIgrace(data);
                    }
                }
                if(cekZarade == ""){
                    if(cekSort == "wASC"){
                        data.sort((a,b)=>{
                            if(a.winnings > b.winnings)
                                return 1;
                            if(a.winnings < b.winnings)
                                return -1;
                            else
                                return 0;
                        })
                    }
                    if(cekSort == "wDESC"){
                        data.sort((a,b)=>{
                            if(a.winnings < b.winnings)
                                return 1;
                            if(a.winnings > b.winnings)
                                return -1;
                            else
                                return 0;
                        })
                    }
                    if(cekTimovi!="g"){
                        // alert("456")
                        for(let el of cekTimovi){
                            // console.log(el)
                            for(let tim of data){
                                if(el == tim.team.id){
                                    odcekiraneZarade.push(tim);
                                }
                            }
                            
                        }
                        ispisiIgrace(odcekiraneZarade);
                        // console.log(igraciNiz);
                    }
                    if(cekTimovi == ""){
                        
                        ispisiIgrace(data);
                    }
                }else{
                    if(cekTimovi.length==0){
                        ispisiIgrace(data);
                    }
                }
                if(cekTimovi == "" || cekTimovi == "g"){
                    if(cekSort == "wASC"){
                        data.sort((a,b)=>{
                            if(a.winnings > b.winnings)
                                return 1;
                            if(a.winnings < b.winnings)
                                return -1;
                            else
                                return 0;
                        })
                    }
                    if(cekSort == "wDESC"){
                        data.sort((a,b)=>{
                            if(a.winnings < b.winnings)
                                return 1;
                            if(a.winnings > b.winnings)
                                return -1;
                            else
                                return 0;
                        })
                    }
                    // console.log(cekZarade)
                    for(let nesto of data){
                        for(let el of zaradeNiz){
                            if(nesto.winnings>= el[0] && nesto.winnings<= el[1]){
                                odcekiraniIgraci.push(nesto);
                            }
                        }
                    }
                    // console.log(odcekiraniIgraci)
                    ispisiIgrace(odcekiraniIgraci);
                    if(cekZarade=="" || cekZarade =="1"){
                        ispisiIgrace(data);
                        // alert("radiiii")
                    }
                }
            },
            error: function(err){
                console.error(err);
            }
        })
    }
}

function nemaKombinacija(){
    let ispis = `<div class="col-12 text-center mt-5"><h2 class="h2">There are no players for the selected category</h2></div>`

    document.getElementById("players").innerHTML = ispis;
}

function nemaKombinacijaTimovi(){
    let ispis = `<div class="col-12 text-center mt-5"><h2 class="h2">There are no teams for the selected category</h2></div>`

    document.getElementById("teams").innerHTML = ispis;
}
