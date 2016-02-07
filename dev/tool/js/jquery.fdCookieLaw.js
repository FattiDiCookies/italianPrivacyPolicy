;(function ( $, window, document, undefined ) {
    
    
    /*
    ***************************************************************************************
    ***************************************************************************************
        
        DEV NOTES: 
            @update [version number] update marker
            @NEW-IDEA (commented code under develope) ... must be fixed or removed
            @TO-DO (something to do)
            @DEBUG (debug lines)
            
            @NEW-CODE [author(github username)] ---------------------- * 
            
                Author New Code Block
                
            @/NEW-CODE ----------------------------------------------- * 
    
    ***************************************************************************************
    ***************************************************************************************
    */
    
	"use strict";
    
    var pluginName = "fdCookieLaw",
        defaults = {
            config: "config.json",
            docs: "docs/docs.complete.json",
            page: "",
            banner: "",
            bannerPosition: "",
            bootstrap: false,
            acceptOnScroll: "",
            callbackOnAccepted: null, //function
            callbackOnNotAccepted: null, //function @update 1.2.0
            callbackOnRejected: null, //function
            // @NEW-CODE Gix075 ----------------------------------------- * 
            callbackOnChoiseChange: null,  // @update 1.3.0
            // /@NEW-CODE ----------------------------------------------- * 
            debug: false
    };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element = element;

        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.jsonDocs = this.settings.docs;

        this.init(); 

    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {

            // @DEBUG 
            if(this.settings.debug === true) console.log(pluginName + ": start");
            var plugin = this;
            this.plugInit(plugin, false);

        },

        plugInit: function (plugin, reloadAfterReject) {

            this.getConfig(plugin, reloadAfterReject);

        },

        /* ========================================================= */
        /* LOAD CONFIG */
        /* ========================================================= */

        getConfig: function (plugin, reloadAfterReject) {

            // @DEBUG 
            if(this.settings.debug === true) console.log(pluginName + ": getConfig() -> loading config");
            
            $.ajax({
                url: plugin.settings.config,
                dataType: 'json',
                success: function (config) {
                    
                    // @TO-DO: inserire funzione per retrocompatibilità con vecchio file di configurazione
                    
                    // @update 1.3.1
                    // Qui assegno manualmente il valore "rejected" al parametro di configurazione
                    // config.cookieBanner.cookieValueRejected
                    config.cookieBanner.cookieValueRejected = (config.cookieBanner.cookieValueRejected !== "undefined") ? config.cookieBanner.cookieValueRejected : "rejected";
                    // Questo serve solo per gestire la retrocompatibilità con la vecchia configurazione
                    // Quando il vecchio file di config sarà completamente deprecato,
                    // questa riga dovrà essere eliminata
                    

                    var loadDocs = false,
                        pageActive = false,
                        bannerActive = false,
                        bannerData = {};

                    // Check if banner is active 
                    if(plugin.settings.banner === true || config.cookieBanner.active === true) {

                        bannerData = {
                            cname: config.cookieBanner.cookieName,
                            cvalue: config.cookieBanner.cookieValue,
                            cvalue_rejected: config.cookieBanner.cookieValueRejected, // @update 1.3.1
                            exdays: config.cookieBanner.cookieExpire
                        };

                        // if cookie is not found load banner
                        var cookieHunter = plugin.cookieHunter(plugin,bannerData);
                        if (cookieHunter === false) {
                            loadDocs = true;
                            bannerActive = true;

                            // Callback OnNotAccepted @update 1.2.0
                            if (plugin.settings.callbackOnNotAccepted !== null && reloadAfterReject === false ) plugin.settings.callbackOnNotAccepted();

                        }else{
                            // Callback OnAccepted
                            if (plugin.settings.callbackOnAccepted !== null ) plugin.settings.callbackOnAccepted();
                        }

                    }

                    if (plugin.settings.page !== "") {
                        loadDocs = true;
                        pageActive = true;
                    }

                    // Load JsonDocsData only if is required
                    if (loadDocs === true) {
                        plugin.getDocsData(plugin,config,pageActive,bannerActive,bannerData);
                    }


                },
                error: function() {

                    // @DEBUG 
                    if(plugin.settings.debug === true) console.log(pluginName + ": getConfig() -> ajax error loading config file");

                    $(plugin.element).html('<h1>Error!</h1>');

                }
            });// end ajax
        },

        /* ========================================================= */
        /* GET ALL DOCS DATA */
        /* ========================================================= */
        getDocsData: function (plugin,config,pageActive,bannerActive,bannerData) {

            // @DEBUG 
            if(this.settings.debug === true) console.log(pluginName + ": getDocsData() -> loading documents");

            $.ajax({
                url: plugin.jsonDocs,
                dataType: 'json',
                success: function (docs) {

                    if (bannerActive !== false) {
                        //plugin.bannerCallback(plugin,config,docs);
                        plugin.setBanner(plugin,config,docs,bannerData);
                    }

                    if (pageActive !== false) {
                        // Cookie or Privacy policy
                        switch(plugin.settings.page) {
                            case "privacy" :
                                plugin.getPrivacyPolicy(plugin,config,docs);
                                break;
                            case "cookie" :
                                plugin.getCookiePolicy(plugin,config,docs);
                                break;
                            default:
                                //plugin.getCookiePolicy(data);
                                break;
                        }
                    }

                },
                error: function() {
                    // @DEBUG 
                    if(this.settings.debug === true) console.log(pluginName + ": getDocsData() -> ajax error loading docs");
                }
            });//end ajax
        },

        /* ========================================================= */
        /* SET BANNER */
        /* ========================================================= */
        setBanner: function (plugin,config,docs,bannerData) {

            // @DEBUG 
            if(this.settings.debug === true) console.log(pluginName + ": setBanner() -> start banner");

            if(plugin.settings.acceptOnScroll === "") {
                bannerData.acceptOnScroll = config.cookieBanner.acceptOnScroll;
            }else{
                bannerData.acceptOnScroll = plugin.settings.acceptOnScroll;
            }


            if(plugin.settings.banner === true) {
                bannerData.position = plugin.settings.bannerPosition;
                plugin.getCookieBanner(config,plugin,docs,bannerData);
            }

            if(plugin.settings.banner === "" && plugin.settings.banner !== false && config.cookieBanner.active === true) {
                bannerData.position = config.cookieBanner.position;
                plugin.getCookieBanner(config,plugin,docs,bannerData);
            }

        },

        /* ========================================================= */
        /* PRIVACY POLICY GENERATOR */
        /* This function generates a dynamical Privacy Policy */
        /* ========================================================= */
        getPrivacyPolicy: function (plugin,config,docs) {

            // @DEBUG 
            if(this.settings.debug === true) console.log(pluginName + ": getPrivacyPolicy() --> load page");

            var markup = docs.privacy_policy_docs['privacy-policy'],
                personalDataMarkup = "",
                deviceDataMarkup = "", // @update 1.3.3
                deviceDataLenght, // @update 1.3.3 (retrocompatibilità)
                //deviceDataLenght = config.privacyPolicy.deviceData.length;, // @update 1.3.3 commentato per retrocompatibilità (dovrà essere reinserito alla versione 1.5.0)
                pesonalDataLenght = config.privacyPolicy.personalData.length, 
                purposesMarkup = "",
                purposesDataLenght = config.privacyPolicy.purposes.length,
                itemStart = "",
                itemEnd = "",
                stringEnd = "";
            
            
            // @update 1.3.3
            // Controlli per vecchi file di configurazione (rimuovere alla versione 1.5.0)
            
            if ( config.privacyPolicy.deviceDataTitle !== undefined && config.privacyPolicy.deviceDataTitle !== "") {
                config.privacyPolicy.deviceDataTitle = config.privacyPolicy.deviceDataTitle;
            }else{
                config.privacyPolicy.deviceDataTitle = "Dati relativi al dispositivo dell'utente";
            }
            
            if ( config.privacyPolicy.deviceDataDesc !== undefined && config.privacyPolicy.deviceDataDesc !== "") {
                config.privacyPolicy.deviceDataDesc = config.privacyPolicy.deviceDataDesc;
            }else{
                config.privacyPolicy.deviceDataDesc = "Sono dati raccolti automaticamente dal sistema che riguardano il dispositivo con il quale viene navigato il sito. I dati così raccolti vengono conservati in forma completamente anonima e sono consultabili solo in forma aggreta. In alcuni casi l'indirizzo ip viene anonimizzato sottraendo ad esso le ultime tre cifre.";
            }
            
            if ( config.privacyPolicy.deviceData !== undefined && config.privacyPolicy.deviceData !== "") {
                config.privacyPolicy.deviceData = config.privacyPolicy.deviceData;
                deviceDataLenght = config.privacyPolicy.deviceData.length;
            }else{
                config.privacyPolicy.deviceData = [
                    "indirizzo internet protocol (IP)",
                    "tipo di browser",
                    "dispositivo usato per connettersi al sito",
                    "internet service provider (ISP)",
                    "data e orario di visita",
                    "pagina web di provenienza del visitatore (referral) e di uscita",
                    "numero di click"
                ];
                deviceDataLenght = config.privacyPolicy.deviceData.length;
            }
            
            if ( config.privacyPolicy.personalDataTitle !== undefined && config.privacyPolicy.personalDataTitle !== "") {
                config.privacyPolicy.personalDataTitle = config.privacyPolicy.personalDataTitle;
            }else{
                config.privacyPolicy.personalDataTitle = "Dati personali dell'utente";
            }
            
            if ( config.privacyPolicy.personalDataDesc !== undefined && config.privacyPolicy.personalDataDesc !== "") {
                config.privacyPolicy.personalDataDesc = config.privacyPolicy.personalDataDesc;
            }else{
                config.privacyPolicy.personalDataDesc = "I dati personali dell'utente vengono rilasciati volontariamente, dove espressamente richiesto, e sono conservati secondo le modalità descritte.";
            }
            
            
            // device data 
            // @update 1.3.3
            deviceDataMarkup += '<p><strong>' + config.privacyPolicy.deviceDataTitle + '</strong><br>';
            deviceDataMarkup += '<small><em>' + config.privacyPolicy.deviceDataDesc + '</em></small></p>';
            $.each(config.privacyPolicy.deviceData, function (index, value) {
                stringEnd = (index === deviceDataLenght - 1) ? "." : ";";
                itemStart = (index === 0) ? "<ul>" : "";
                itemEnd = (index === deviceDataLenght - 1) ? "</ul>" : "";
                deviceDataMarkup += itemStart + '<li>' + value + stringEnd + '</li>' + itemEnd;
            });
            
            // personal data
            personalDataMarkup += '<p><strong>' + config.privacyPolicy.personalDataTitle + '</strong><br>';
            personalDataMarkup += '<small><em>' + config.privacyPolicy.personalDataDesc + '</em></small></p>';
            $.each(config.privacyPolicy.personalData, function (index, value) {
                stringEnd = (index === pesonalDataLenght - 1) ? "." : ";";
                itemStart = (index === 0) ? "<ul>" : "";
                itemEnd = (index === pesonalDataLenght - 1) ? "</ul>" : "";
                personalDataMarkup += itemStart + '<li>' + value + stringEnd + '</li>' + itemEnd;
            });

            // purposes
            $.each(config.privacyPolicy.purposes, function (index, value) {
                stringEnd = (index === purposesDataLenght - 1) ? "." : ";";
                itemStart = (index === 0) ? "<ul>" : "";
                itemEnd = (index === purposesDataLenght - 1) ? "</ul>" : "";
                purposesMarkup += itemStart + '<li>' + value + stringEnd + '</li>' + itemEnd;
            });

            markup = markup.replace(/\[\[NOME SITO\]\]/g, config.globals.site.name);
            markup = markup.replace(/\[\[URL SITO\]\]/g, config.globals.site.url);
            markup = markup.replace(/\[\[SOCIETA-RESPONSABILE\]\]/g, config.globals.company.name);
            markup = markup.replace(/\[\[INDIRIZZO\]\]/g, config.globals.company.address);
            if (config.globals.company.vatNumber !== "") {
                var vatNumber = config.globals.company.vatLabel+" "+config.globals.company.vatNumber;
                markup = markup.replace(/\[\[PIVA\]\]/g, vatNumber);
            }

            markup = markup.replace(/\[\[NOME E COGNOME DEL RESPONSABILE\]\]/g, config.globals.administrator.name);
            markup = markup.replace(/\[\[EMAIL DI CONTATTO\]\]/g, config.globals.site.email);
            markup = markup.replace(/\[\[DATI DISPOSITIVO\]\]/g, deviceDataMarkup); // @update 1.3.3
            markup = markup.replace(/\[\[DATI PERSONALI\]\]/g, personalDataMarkup);
            markup = markup.replace(/\[\[SCOPI RACCOLTA DATI\]\]/g, purposesMarkup);

            // place markup on element
            $(plugin.element).html(markup);

        },

        /* ==================================================== */
        /* COOKIE POLICY GENERATOR */
        /* This function generates a dynamical Cookie Policy    */
        /* ==================================================== */
        getCookiePolicy: function (plugin,config,docs) {

            // @DEBUG 
            if(this.settings.debug === true) console.log(pluginName + ": getCookiePolicy()");


            var markup = docs.cookie_policy_docs['informativa-estesa'];

            markup = markup.replace(/\[\[NOME SITO\]\]/g, config.globals.site.name);
            markup = markup.replace(/\[\[URL SITO\]\]/g, config.globals.site.url);
            markup = markup.replace(/\[\[NOME E COGNOME DEL RESPONSABILE\]\]/g, config.globals.administrator.name);
            markup = markup.replace(/\[\[ELENCO SERVIZI\]\]/g, '<div id="cookiePolicyServices" class="fdctool__services panel-group" role="tablist" aria-multiselectable="true"></div>');
            markup = markup.replace(/\[\[PRIVACY-POLICY\]\]/g, '<a href="'+ config.privacyPolicy.url +'" class="fdc-cookielaw__privacy-link">LINK</a>');

            $(plugin.element).html(markup);

            var buttons = '',
                cookieData = {
                    cname: config.cookieBanner.cookieName,
                    cvalue: config.cookieBanner.cookieValue,
                    cvalue_rejected: config.cookieBanner.cookieValueRejected, // @update 1.3.1
                    exdays: config.cookieBanner.cookieExpire
                },
                cookieHunter = this.cookieHunter(plugin,cookieData),
                btnClasses = {
                    accept: (plugin.settings.bootstrap === true) ? 'btn btn-primary' : 'button',
                    reject: (plugin.settings.bootstrap === true) ? 'btn btn-danger' : 'button button-red'
                };


            buttons +=  '<div class="fdc-cookielaw__policy-buttons">'+
                        '    <button class="' + btnClasses.accept + ' on-policypage fdc-cookielaw__accept-button">Acconsento all\'uso dei cookie</button>'+
                        '    <button class="' + btnClasses.reject + ' on-policypage fdc-cookielaw__reject-button">Rimuovo il consenso all\'uso dei cookie</button>'+
                        '</div>';

            $(plugin.element).append(buttons);

            if (cookieHunter === false) {
                $('.fdc-cookielaw__reject-button.on-policypage').hide();
                $('.fdc-cookielaw__accept-button.on-policypage').fadeIn();
            }else{
                $('.fdc-cookielaw__accept-button.on-policypage').hide();
                $('.fdc-cookielaw__reject-button.on-policypage').fadeIn();
            } 



            // cookie policy accept
            plugin.cookieAcceptClick(plugin,cookieData);
            plugin.cookieRejectClick(plugin,cookieData);

            plugin.getServices(plugin,config,docs);


        },

        /* ==================================================== */
        /* Services Text */
        /* ==================================================== */

        getServices: function (plugin,config,docs) {
            $.each(config.cookiePolicy.services, function(index) {

                if (this.active === true) {

                    var catLabel = config.cookiePolicy.services[index].catLabel,
                        catName = config.cookiePolicy.services[index].catName,
                        catID = "servicesTool-" + catName,
                        collapseClass = (index === 0) ? ' collapse in' : ' collapse',
                        // @TO-DO: inserire qui classi bootstrap accordion (fatto? controllare e rimuovere to-do)
                        bootstrapCss = {
                            panel: (plugin.settings.bootstrap === true) ? " panel panel-default" : "",
                            panelHeading: (plugin.settings.bootstrap === true) ? " panel-heading" : "",
                            panelTitle: (plugin.settings.bootstrap === true) ? " panel-title" : "",
                            panelCollapse: (plugin.settings.bootstrap === true) ? " panel-collapse" + collapseClass : "",
                            panelBody: (plugin.settings.bootstrap === true) ? " panel-body" : ""
                        };

                    $('#cookiePolicyServices').append('<div id="' + catID + '" class="fdctool__services_cat panel' + bootstrapCss.panel + '"></div>');


                    $('#' + catID).append('<div class="fdctool__services_cat-heading' + bootstrapCss.panelHeading + '" role="tab" id="' + catID + 'Heading"> <h4 class="fdctool__services_cat-title' + bootstrapCss.panelTitle + '"><a role="button" data-toggle="collapse" data-parent="#' + catID + '" href="#' + catID + 'Collapse" aria-expanded="true" aria-controls="' + catID + 'Collapse">' + catLabel + '</a></h4></div>');
                    $('#' + catID).append('<div id="' + catID + 'Collapse" class="fdctool__services_cat-items' + bootstrapCss.panelCollapse + '" role="tabpanel" aria-labelledby="' + catID + 'Heading"><div class="fdctool__services_cat-items-body' + bootstrapCss.panelBody + '"></div></div>'); 



                    $.each(config.cookiePolicy.services[index].services, function(key, value) {

                        if (value === true) {
                            var markup = docs.cookie_policy_docs[key];
                            
                            // @NEW-CODE Gix075 ----------------------------------------- * 
                            markup += plugin.serviceChoise_buttonBar_markup(plugin, config, key); // @update 1.3.0
                            // /@NEW-CODE ----------------------------------------------- * 
                            
                            // Prevent code failure if docs.complete.json is not consistent
                            if(typeof markup !== 'undefined') {
                                markup = markup.replace(/\[\[NOME SITO\]\]/g, config.globals.site.name);
                                markup = markup.replace(/\[\[URL SITO\]\]/g, config.globals.site.url);
                                $('#' + catID).find('.fdctool__services_cat-items-body').append(markup);  
                            }
                        }

                    });

                }


            });
            
            // @NEW-CODE Gix075 ----------------------------------------- * 
            plugin.serviceChoise_buttonBar_click(plugin, config); // @update 1.3.0
            // /@NEW-CODE ----------------------------------------------- * 
        },
        
        /* ========================================================= */
        /* BANNER TEXT */
        /* Get the right banner text */
        /* ========================================================= */
        getBannerText: function (plugin,config,docs,bannerData) {

            var bannerText = "";

            if (config.cookieBanner.text.customText === false || config.cookieBanner.text.customText === "") {

                // @DEBUG 
                if(plugin.settings.debug === true) console.log(pluginName + ': getBannerText() -> load text');

                // Technical
                if (config.cookieBanner.text.techCookies === true && config.cookieBanner.text.profCookies === false)  {
                    bannerText = docs.cookie_policy_docs.banner_tech;
                }

                // Technical + Profiling
                if (config.cookieBanner.text.techCookies === true && config.cookieBanner.text.profCookies === true)  {
                    bannerText = docs.cookie_policy_docs['banner_tech-prof'];
                }

                // Profiling
                if (config.cookieBanner.text.techCookies === false && config.cookieBanner.text.profCookies === true)  {
                    bannerText = docs.cookie_policy_docs.banner_prof;
                }


            } else {

                // @DEBUG 
                if(plugin.settings.debug === true) console.log(pluginName + ': getBannerText() -> load custom text');

                bannerText = config.cookieBanner.text.customText;
            }

            return bannerText;

        },

        /* ====================================================== */
        /* COOKIE BANNER GENERATOR */
        /* This function generates a cookie info banner */
        /* ====================================================== */
        getCookieBanner: function (config,plugin,docs,bannerData) {

            // @DEBUG 
            if(this.settings.debug === true) console.log(pluginName + ": getCookieBanner() -> load banner");

            var cookieHunter = plugin.cookieHunter(plugin,bannerData);

            // if cookie is not found load banner
            if (cookieHunter === false) {

                // banner text
                bannerData.text = plugin.getBannerText(plugin,config,docs,bannerData);
                bannerData.textLink = '<a href="'+ config.cookiePolicy.url +'" title="Informativa Estesa">informativa estesa</a>';

                bannerData.text = bannerData.text.replace(/\[\[INFORMATIVA-ESTESA\]\]/g, bannerData.textLink);
                bannerData.text = bannerData.text.replace(/\[\[NOME SITO\]\]/g, config.globals.site.name);


                // banner markup
                var bootstrapClass = (plugin.settings.bootstrap === true) ? "bootstrap" : "no-bootstrap",
                    bannerMarkup = '<div id="fdCookieLawBanner" class="fdc-cookielaw__banner '+ bannerData.position +'Banner">';

                if (plugin.settings.bootstrap === true) {
                    // bootstrap markup
                    bannerMarkup += '   <div class="container-fluid">';
                    bannerMarkup += '       <div class="row">';
                    bannerMarkup += '           <div class="fdc-cookielaw__banner-text col-md-12">';
                    bannerMarkup +=                 bannerData.text;
                    bannerMarkup += '           </div>';
                    bannerMarkup += '       </div>';
                    bannerMarkup += '       <div class="row">';
                    bannerMarkup += '           <div class="fdc-cookielaw__banner-buttons col-md-12">';
                    bannerMarkup += '               <a href="'+ config.cookiePolicy.url +'" class="btn btn-primary privacy">Informativa Estesa</a>';
                    bannerMarkup += '               <a href="#" id="cookieAccept" class="btn btn-primary accept fdc-cookielaw__accept-button" href="'+ config.cookiePolicy.url +'" class="button privacy">OK</a>';
                    bannerMarkup += '           </div>';
                    bannerMarkup += '       </div>';
                    bannerMarkup += '   </div>';
                }else{
                    // common markup
                    bannerMarkup += '   <div class="fdc-cookielaw__banner-text">';
                    bannerMarkup +=         bannerData.text;
                    bannerMarkup += '   </div>';
                    bannerMarkup += '   <div class="fdc-cookielaw__banner-buttons">';
                    bannerMarkup += '       <a href="'+ config.cookiePolicy.url +'" class="button privacy">Informativa Estesa</a>';
                    bannerMarkup += '       <a href="#" id="cookieAccept" class="button accept fdc-cookielaw__accept-button" href="'+ config.cookiePolicy.url +'" class="button privacy">OK</a>';
                    bannerMarkup += '   </div>';
                }

                bannerMarkup += '</div>';


                // load banner
                $('body').append(bannerMarkup);
                $('body').promise().done(function() {
                    setTimeout(function() {
                        $('#fdCookieLawBanner').addClass('showBanner');
                    }, 100);
                });

                // cookie policy accept
                plugin.cookieAcceptClick(plugin,bannerData);

                if (bannerData.acceptOnScroll === true) {
                    $(window).one('scroll', function() {
                        $('#fdCookieLawBanner').removeClass('showBanner');
                        setTimeout(function () {
                            $('#fdCookieLawBanner').remove();
                        },1000);
                        plugin.writeCookie(bannerData.cname,bannerData.cvalue,bannerData.exdays);
                    });
                }


            }       

        },

        /* ========================================================= */
        /* COOKIE POLICY ACCEPT
        /* ========================================================= */
        cookieAcceptClick: function (plugin, cookieData) {
            // cookie policy accept
            $('.fdc-cookielaw__accept-button').on('click', function(e) {
                e.preventDefault();
                plugin.cookieAccept(plugin, cookieData, true);
            });
        },
        
        cookieAccept: function (plugin, cookieData, acceptAllServices) {
            $('#fdCookieLawBanner').removeClass('showBanner');
            setTimeout(function () {
                $('#fdCookieLawBanner').remove();
            },1000);
            $('.fdc-cookielaw__accept-button.on-policypage').hide();
            $('.fdc-cookielaw__reject-button.on-policypage').fadeIn();
            plugin.writeCookie(cookieData.cname, cookieData.cvalue, cookieData.exdays);


            // @NEW-CODE Gix075 ----------------------------------------- * 
            // @update 1.3.0
            if(acceptAllServices === true) {
                plugin.servicesChoise_handleAll(plugin, cookieData.cname, true);
                plugin.serviceChoise_buttonBar_acceptAllUpdate(plugin);
            }
            // /@NEW-CODE ----------------------------------------------- * 

            // Callback OnAccepted
            if ( plugin.settings.callbackOnAccepted !== null ) plugin.settings.callbackOnAccepted();
        },

        /* ========================================================= */
        /* COOKIE POLICY REJECT
        /* ========================================================= */
        // @TO-DO: verificare dopo il click l'esistenza del banner e se non esiste caricarlo
        // @TO-DO: testare bene se la soluzione proposta funziona

        cookieRejectClick: function (plugin,cookieData) {
            // cookie policy accept
            $('.fdc-cookielaw__reject-button').on('click', function(e) {
                e.preventDefault();    
                plugin.cookieReject(plugin, cookieData);
            });
        },
        
        cookieReject: function (plugin,cookieData) {
            plugin.writeCookie(cookieData.cname,cookieData.cvalue_rejected,cookieData.exdays);
                
            // @NEW-CODE Gix075 ----------------------------------------- * 
            // @update 1.3.0
            plugin.servicesChoise_handleAll(plugin, cookieData.cname, false);
            // /@NEW-CODE ----------------------------------------------- * 

            /* 
            @update 1.2.1 (parte rimossa)
            if ( $('#fdCookieLawBanner').length > 0 ) {
                $('#fdCookieLawBanner').addClass('showBanner');
                $('.fdc-cookielaw__reject-button.on-policypage').hide();
                $('.fdc-cookielaw__accept-button.on-policypage').fadeIn();
            }else {
                plugin.plugInit(plugin,true);
            }
            */
            
            // @update 1.2.1
            plugin.plugInit(plugin,true); 

            // Callback OnRejected
            if ( plugin.settings.callbackOnRejected !== null ) plugin.settings.callbackOnRejected();
        },

        

        // @NEW-CODE Gix075 ----------------------------------------- * 
        // @update 1.3.0
        /* ####################################################################################### */
        /* SERVICES & COOKIE USER SETTINGS  */
        /* ####################################################################################### */
        
        
        /* ================================================================ */
        /* Single Service Hunter */
        /* Tests if a service is accepted by the user */
        /* ================================================================ */
        serviceChoise_serviceHunter: function(plugin, config, service) {
            
            var servicesCookieName = config.cookieBanner.cookieName + "_services",
                currentCookie = plugin.readCookie(servicesCookieName),
                result;
            
            currentCookie = currentCookie.split(',');
            result = ($.inArray(service, currentCookie) === -1) ? false : true;
            
            return result;
            
        },
        
        /* ================================================================ */
        /* Single Service Handler */
        /* ================================================================ */
        serviceChoise_handleServiceCookie: function(plugin, config, service, action, launch_callback) {
            
            var servicesCookieName = config.cookieBanner.cookieName + "_services",
                currentCookie = plugin.readCookie(servicesCookieName),
                newCookieValue,
                callbackData = {
                    action: action,
                    changed: service,
                    allowed_services: ""
                },
                cookieData = {
                    cname: config.cookieBanner.cookieName,
                    cvalue: config.cookieBanner.cookieValue,
                    cvalue_rejected: config.cookieBanner.cookieValueRejected, // @update 1.3.1
                    exdays: config.cookieBanner.cookieExpire
                };
            
            switch(action) {
                case "add":
                    
                    if(currentCookie !== undefined && currentCookie !== "" && currentCookie !== cookieData.cvalue_rejected) {
                        currentCookie = currentCookie.split(',');
                        if($.inArray(service, currentCookie) === -1) currentCookie.push(service);
                        callbackData.allowed_services = currentCookie;
                        newCookieValue = currentCookie.toString(); 
                    }else{
                        callbackData.allowed_services = [service];
                        newCookieValue = service;  
                        plugin.cookieAccept(plugin, cookieData, false);
                    }
                    
                    break;
                    
                case "remove":
                    if(currentCookie !== undefined && currentCookie !== "") {
                        currentCookie = currentCookie.split(',');
                        var index = currentCookie.indexOf(service);
                        if (index > -1) {
                            currentCookie.splice(index, 1);
                        }    
                        callbackData.allowed_services = currentCookie;
                        newCookieValue = currentCookie.toString(); 
                        if (newCookieValue === "") {
                            callbackData.allowed_services = [];
                            newCookieValue = cookieData.cvalue_rejected;
                            plugin.cookieReject(plugin, cookieData);
                        }
                        
                    }
                    break;
            }
            
            if (plugin.settings.callbackOnChoiseChange !== null && launch_callback === true) {
                plugin.settings.callbackOnChoiseChange(callbackData);
            }
            
            plugin.writeCookie(servicesCookieName, newCookieValue, config.cookieBanner.cookieExpire);
            
            
        },
        
        /* ================================================================ */
        /* All services Handler */
        /* ================================================================ */
        servicesChoise_handleAll: function (plugin, cookieName, action) {
            
            var servicesCookieName = cookieName + "_services";
            
            if(action === true) {
                
                $.ajax({
                    url: plugin.settings.config,
                    dataType: 'json',
                    success: function (config) {
                        // @DEBUG 
                        if(plugin.settings.debug === true) console.log(pluginName + ': servicesChoise_acceptAll() -> config loaded!');

                        $.each(config.cookiePolicy.services, function(index) {
                            if (this.active === true) { 
                                $.each(config.cookiePolicy.services[index].services, function(key, value) {
                                    if(value === true) plugin.serviceChoise_handleServiceCookie(plugin, config, key, "add", false);
                                });
                            }
                        });

                    },
                    error: function () {
                        // @DEBUG 
                        if(plugin.settings.debug === true) console.log(pluginName + ': servicesChoise_acceptAll() -> AJAX ERROR!');
                    }
                });
                
            }else{
                plugin.writeCookie(servicesCookieName, 'rejected', 365);
            }
            // get configuration file
            
        },
        
        /* ================================================================ */
        /* Single Service Choise Button Bar Generator */
        /* Generates a button bar for each service in Cookie Policy */
        /* ================================================================ */
        serviceChoise_buttonBar_markup: function (plugin, config, service) {
            
            var acceptBtnDisabled,
                rejectacceptBtnDisabled,
                elementClass,
                btnAcceptClass,
                btnRejectClass,
                choiseLabelAccepted = 'accettato',
                choiseLabelRejected = 'non accettato',
                panelClasses = {},
                markup;
            
            if(plugin.serviceChoise_serviceHunter(plugin, config, service) === true) {
                acceptBtnDisabled = ' disabled="disabled"';
                rejectacceptBtnDisabled = '';
                elementClass = 'accepted';
            }else{
                acceptBtnDisabled = '';
                rejectacceptBtnDisabled = ' disabled="disabled"';
                elementClass = 'rejected';
            }
            
            if(plugin.settings.bootstrap === true) {
                btnAcceptClass = "btn btn-primary";
                btnRejectClass = "btn btn-danger";
                panelClasses.panel = "panel panel-default ";
                panelClasses.heading = "panel-heading ";
                panelClasses.title = "panel-title ";
                panelClasses.body = "panel-body ";
            }else{
                btnAcceptClass = "button";
                btnRejectClass = "button button-red";
                panelClasses.panel = "";
                panelClasses.heading = "";
                panelClasses.title = "";
                panelClasses.body = "";
            }
            
            markup =    ' <div class="' + panelClasses.panel + 'fdctool__services_item-choise ' + elementClass + '" data-cookie="' + service + '">\n' +
                        '   <div class="' + panelClasses.heading + 'fdctool__services_item-choise-heading">\n' +
                        '       <h6 class="' + panelClasses.title + 'fdctool__services_item-choise-title">La tua scelta: <span class="choise-label accepted"><span class="glyphicon glyphicon-ok-circle"></span> ' + choiseLabelAccepted + '</span><span class="choise-label rejected"><span class="glyphicon glyphicon-ban-circle"></span> ' + choiseLabelRejected + '</span></h6>\n' +
                        '   </div>\n' +
                        '   <div class="' + panelClasses.body + 'fdctool__services_item-choise-panelbody">\n' +
                        '       <p>Decidi se attivare o meno questo cookie. Ricorda che disabilitando questo cookie potresti non poter usufruire di alcuni servizi offerti da questo sito.</p>\n' +
                        '       <div class="fdctool__services_item-choise-buttons">\n' +
                        '           <button class="' + btnAcceptClass + ' item-choise-btn accept"' + acceptBtnDisabled + '>Abilita</button>\n' +
                        '           <button class="' + btnRejectClass + ' item-choise-btn reject"' + rejectacceptBtnDisabled + '>Disabilita</button>\n' +
                        '       </div>\n' +
                        '       <div class="fdctool__services_item-choise-msg">\n' +
                        '           <span class="glyphicon glyphicon-floppy-saved"></span> La tua scelta è stata salvata!\n' +
                        '       </div>\n' +
                        '    </div>\n' +
                        ' </div>';
            
            return markup; 
            
        },
        
        
        /* ================================================================ */
        /* Choise Button Click Handler */
        /* Update Services Cookie on Click */
        /* ================================================================ */
        serviceChoise_buttonBar_click: function (plugin,config) {
            
            $('.fdctool__services_item-choise').find('.item-choise-btn').on('click', function (e) {
                e.preventDefault();
                
                var service = $(this).closest('.fdctool__services_item-choise').data('cookie'),
                    msgDiv = $(this).closest('.fdctool__services_item-choise').find('.fdctool__services_item-choise-msg');
                
                msgDiv.hide();
                
                if ($(this).hasClass('accept')) {
                    plugin.serviceChoise_handleServiceCookie(plugin, config, service, "add", true);
                    $(this).attr('disabled',true);
                    $(this).closest('.fdctool__services_item-choise').find('.reject').attr('disabled',false);
                    $(this).closest('.fdctool__services_item-choise').removeClass('rejected');
                    $(this).closest('.fdctool__services_item-choise').addClass('accepted');
                }else{
                    plugin.serviceChoise_handleServiceCookie(plugin, config, service, "remove", true);
                    $(this).attr('disabled',true);
                    $(this).closest('.fdctool__services_item-choise').find('.accept').attr('disabled',false);
                    $(this).closest('.fdctool__services_item-choise').removeClass('accepted');
                    $(this).closest('.fdctool__services_item-choise').addClass('rejected');
                }
                msgDiv.fadeIn();
                setTimeout(function() {
                    msgDiv.fadeOut();
                },2000);
            });
        },
        
        /* ================================================================ */
        /* Choise Buttons Bar Update (all services accepted) */
        /* ================================================================ */
        serviceChoise_buttonBar_acceptAllUpdate: function (plugin) {
            $('.fdctool__services_item-choise').removeClass('rejected');
            $('.fdctool__services_item-choise').addClass('accepted');
            $('.fdctool__services_item-choise').find('.item-choise-btn.accept').attr('disabled',true);
            $('.fdctool__services_item-choise').find('.item-choise-btn.reject').attr('disabled',false);
        },

        /* ####################################################################################### */
        
        
        // @/NEW-CODE ----------------------------------------------- * 




        /* ####################################################################################### */
        /* COOKIE HANDLERS */
        /* ####################################################################################### */


        /* ============================================================ */
        /* Cookie Hunter */
        /* ============================================================ */
        cookieHunter: function (plugin,bannerData) {

            var cookieVal = plugin.readCookie(bannerData.cname);
            var bannerNeeded = (cookieVal !== undefined && cookieVal !== bannerData.cvalue) ? false : true;

            return bannerNeeded;

        },

        /* ============================================================ */
        /* Set Cookie */
        /* ============================================================ */
        writeCookie: function(cname, cvalue, exdays) {

            // @DEBUG 
            if(this.settings.debug === true) console.log(pluginName + ': writeCookie(' + cname + ' ' + cvalue + ' ' + exdays +')');

            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/ ";

        },

        /* ============================================================ */
        /* Read Cookie Value */
        /* ============================================================ */
        readCookie: function(cname) {

            // @DEBUG 
            if(this.settings.debug === true) console.log(pluginName + ': readCookie(' + cname + ')');

            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) === 0) return c.substring(name.length,c.length);
            }
            return "";
        }


    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };

})( jQuery, window, document );
