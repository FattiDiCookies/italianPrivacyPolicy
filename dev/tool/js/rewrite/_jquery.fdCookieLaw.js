(function ( $, window, document ) {
    
    
    /*
    ***************************************************************************************
    ***************************************************************************************
        
        DEV NOTES: 
            @update [version number] update marker
            @NEW-IDEA (commented code under develope) ... must be fixed or removed
            @TODO (something to do)
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
            bannerRejectButton: false, // @update 1.6.0
            bannerRejectButtonLabel: "Solo necessari", // @update 1.7.0
            bannerAcceptAllButtonLabel: "Accetto tutto", // @update 1.7.0
            bannerPrivacyButtonLabel: "Informativa estesa", // @update 1.7.0
            bannerCloseButton: true, // @update 1.6.0
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
            //var plugin = this;
            this.plugInit(false);

        },

        plugInit: function (reloadAfterReject) {

            this.getConfig(reloadAfterReject);

        },

        /* ========================================================= */
        /* LOAD CONFIG */
        /* ========================================================= */

        getConfig: function (plugin, reloadAfterReject) {

            // @DEBUG 
            if(this.settings.debug === true) console.log(pluginName + ": getConfig() -> loading config");
            
            $.ajax({
                url: this.settings.config,
                dataType: 'json',
                success: (config) => {

                    //@update 1.6.0
                    // Assegno valori dei nuovi parametri di config
                    // Questi due parametri vengono gestiti da due opzioni dirette del plugin jQuery
                    if (config.cookieBanner.rejectButton !== "undefined") {
                        this.settings.bannerRejectButton = config.cookieBanner.rejectButton;
                    }

                    if (config.cookieBanner.closeButton !== "undefined") {
                        this.settings.bannerCloseButton = config.cookieBanner.closeButton;
                    }
                    
                    var loadDocs = false,
                        pageActive = false,
                        bannerActive = false,
                        bannerData = {};

                    // Check if banner is active 
                    if(this.settings.banner === true || config.cookieBanner.active === true) {

                        bannerData = {
                            cname: config.cookieBanner.cookieName,
                            cvalue: config.cookieBanner.cookieValue,
                            cvalue_rejected: config.cookieBanner.cookieValueRejected, // @update 1.3.1
                            exdays: config.cookieBanner.cookieExpire,
                            // @update 1.7.0
                            buttons_label: {
                                bannerRejectButtonLabel: (config.cookieBanner.buttons_label.bannerRejectButtonLabel !== ""  && config.cookieBanner.buttons_label.bannerRejectButtonLabel !== false) ? config.cookieBanner.buttons_label.bannerRejectButtonLabel : this.settings.bannerRejectButtonLabel,
                                bannerAcceptAllButtonLabel: (config.cookieBanner.buttons_label.bannerAcceptAllButtonLabel !== "" && config.cookieBanner.buttons_label.bannerAcceptAllButtonLabel !== false ) ? config.cookieBanner.buttons_label.bannerAcceptAllButtonLabel : this.settings.bannerAcceptAllButtonLabel,
                                bannerPrivacyButtonLabel: (config.cookieBanner.buttons_label.bannerPrivacyButtonLabel !== "" && config.cookieBanner.buttons_label.bannerPrivacyButtonLabel !== false) ? config.cookieBanner.buttons_label.bannerPrivacyButtonLabel : this.settings.bannerPrivacyButtonLabel,
                            }
                        };

                        // if cookie is not found load banner
                        var cookieHunter = this.cookieHunter(bannerData);
                        if (cookieHunter === false) {
                            loadDocs = true;
                            bannerActive = true;

                            // Callback OnNotAccepted @update 1.2.0
                            if (this.settings.callbackOnNotAccepted !== null && reloadAfterReject === false ) this.settings.callbackOnNotAccepted();

                        }else{
                            // Callback OnAccepted
                            if (this.settings.callbackOnAccepted !== null ) this.settings.callbackOnAccepted();
                        }

                    }

                    if (this.settings.page !== "") {
                        loadDocs = true;
                        pageActive = true;
                    }

                    // Load JsonDocsData only if is required
                    if (loadDocs === true) {
                        this.getDocsData(config,pageActive,bannerActive,bannerData);
                    }


                },
                error: () => {

                    // @DEBUG 
                    if(this.settings.debug === true) console.log(pluginName + ": getConfig() -> ajax error loading config file");

                    $(this.element).html('<h1>Error!</h1>');

                }
            });// end ajax
        },

        /* ========================================================= */
        /* GET ALL DOCS DATA */
        /* ========================================================= */
        getDocsData: function (config,pageActive,bannerActive,bannerData) {

            // @DEBUG 
            if(this.settings.debug === true) console.log(pluginName + ": getDocsData() -> loading documents");

            $.ajax({
                url: this.jsonDocs,
                dataType: 'json',
                success: (docs) => {

                    if (bannerActive !== false) {
                        //plugin.bannerCallback(plugin,config,docs);
                        this.setBanner(config,docs,bannerData);
                    }

                    if (pageActive !== false) {
                        // Cookie or Privacy policy
                        switch(this.settings.page) {
                            case "privacy" :
                                this.getPrivacyPolicy(config,docs);
                                break;
                            case "cookie" :
                                this.getCookiePolicy(config,docs);
                                break;
                            default:
                                //this.getCookiePolicy(data);
                                break;
                        }
                    }

                },
                error: () => {
                    // @DEBUG 
                    if(this.settings.debug === true) console.log(pluginName + ": getDocsData() -> ajax error loading docs");
                }
            });//end ajax
        },

        /* ========================================================= */
        /* SET BANNER */
        /* ========================================================= */
        setBanner: function (config,docs,bannerData) {

            // @DEBUG 
            if(this.settings.debug === true) console.log(pluginName + ": setBanner() -> start banner");

            if(this.settings.acceptOnScroll === "") {
                bannerData.acceptOnScroll = config.cookieBanner.acceptOnScroll;
            }else{
                bannerData.acceptOnScroll = this.settings.acceptOnScroll;
            }


            if(this.settings.banner === true) {
                bannerData.position = config.cookieBanner.position;
                this.getCookieBanner(config,docs,bannerData);
            }

            if(this.settings.banner === "" && this.settings.banner !== false && config.cookieBanner.active === true) {
                bannerData.position = config.cookieBanner.position;
                this.getCookieBanner(config,docs,bannerData);
            }

        },
        
        /* ========================================================= */
        /* PRIVACY POLICY SERVICES MARKUP GENERATOR */
        /* ========================================================= */
        generateListMarkup: function (src_array) {
              
            var array_length = src_array.length,
                markup = "",
                stringEnd = "";
                
            if (array_length > 0) {

                markup = "<ul>";

                $.each(src_array, function (index,value) {
                    stringEnd = (index === array_length - 1) ? "." : ";";
                    markup += "<li>" + value + stringEnd + "</li>";
                });

                markup += "</ul>";

            } else {

                markup = "";

            }
            
            return markup;
        },

        /* ========================================================= */
        /* PRIVACY POLICY GENERATOR */
        /* This function generates a dynamical Privacy Policy */
        /* ========================================================= */
        getPrivacyPolicy: function (config,docs) {

            // @DEBUG 
            if(this.settings.debug === true) console.log(pluginName + ": getPrivacyPolicy() --> load page");
            if(this.settings.debug === true) console.log(pluginName + ": getPrivacyPolicy() --> docs: " + JSON.stringify(docs));

            var markup = docs.privacy_policy_docs['privacy-policy'],
                services_docs = { // @update 1.5.0
                    hosting: docs.privacy_policy_docs.hosting,
                    newsletter: docs.privacy_policy_docs.newsletter,
                    contactform: docs.privacy_policy_docs.contactform,
                    ecommerce: docs.privacy_policy_docs.ecommerce,
                    siteaccount: docs.privacy_policy_docs.siteaccount
                },
                service_markup = "",
                services_markup = "",
                services_thirdparty_markup = "",
                personalDataMarkup = "",
                deviceDataMarkup = "", // @update 1.3.3
                //deviceDataLenght, // @update 1.3.3 (retrocompatibilità)
                deviceDataLenght = config.privacyPolicy.deviceData.length, // @update 1.3.3 commentato per retrocompatibilità (dovrà essere reinserito alla versione 1.5.0)
                pesonalDataLenght = config.privacyPolicy.personalData.length, 
                purposesMarkup = "",
                purposesDataLenght = config.privacyPolicy.purposes.length,
                itemStart = "",
                itemEnd = "",
                stringEnd = "";

            
            // device data // @update 1.3.3
            deviceDataMarkup += '<p><strong>' + config.privacyPolicy.deviceDataTitle + '</strong><br>';
            deviceDataMarkup += '<small><em>' + config.privacyPolicy.deviceDataDesc + '</em></small></p>';
            $.each(config.privacyPolicy.deviceData, function (index, value) {
                stringEnd = (index === deviceDataLenght - 1) ? "." : ";";
                itemStart = (index === 0) ? "<ul>" : "";
                itemEnd = (index === deviceDataLenght - 1) ? "</ul>" : "";
                deviceDataMarkup += itemStart + '<li>' + value + stringEnd + '</li>' + itemEnd;
            });
            
            // personal data // @update 1.3.3
            personalDataMarkup += '<p><strong>' + config.privacyPolicy.personalDataTitle + '</strong><br>';
            personalDataMarkup += '<small><em>' + config.privacyPolicy.personalDataDesc + '</em></small></p>';
            $.each(config.privacyPolicy.personalData, function (index, value) {
                stringEnd = (index === pesonalDataLenght - 1) ? "." : ";";
                itemStart = (index === 0) ? "<ul>" : "";
                itemEnd = (index === pesonalDataLenght - 1) ? "</ul>" : "";
                personalDataMarkup += itemStart + '<li>' + value + stringEnd + '</li>' + itemEnd;
            });

            // purposes // @update 1.3.3
            $.each(config.privacyPolicy.purposes, function (index, value) {
                stringEnd = (index === purposesDataLenght - 1) ? "." : ";";
                itemStart = (index === 0) ? "<ul>" : "";
                itemEnd = (index === purposesDataLenght - 1) ? "</ul>" : "";
                purposesMarkup += itemStart + '<li>' + value + stringEnd + '</li>' + itemEnd;
            });
            
            
            // @NEW-CODE [author(Gix075)] ------------------------------- * 
            // @update 1.5.0 nuove funzionalità relative al GDPR
            
            // @DEBUG 
            if(this.settings.debug === true) console.log(pluginName + ": getPrivacyPolicy() --> load services");
            
            // CONTACT FORM @update 1.5.0
            if (config.privacyPolicy.contactForm.active === true) {
                
                service_markup = this.generateListMarkup(config.privacyPolicy.contactForm.personalData);
                services_docs.contactform = services_docs.contactform.replace(/\[\[CONTACTFORM DATA\]\]/g,service_markup);
                
                service_markup = this.generateListMarkup(config.privacyPolicy.contactForm.storage);
                services_docs.contactform = services_docs.contactform.replace(/\[\[CONTACTFORM DATA STORAGE\]\]/g,service_markup);
                
                services_markup += services_docs.contactform;
                
            }
            
            // USER ACCOUNT @update 1.5.0
            if (config.privacyPolicy.account.active === true) {
                
                service_markup = this.generateListMarkup(config.privacyPolicy.account.personalData);
                services_docs.siteaccount = services_docs.siteaccount.replace(/\[\[ACCOUNT DATA\]\]/g,service_markup);
                
                service_markup = this.generateListMarkup(config.privacyPolicy.account.storage);
                services_docs.siteaccount = services_docs.siteaccount.replace(/\[\[ACCOUNT DATA STORAGE\]\]/g,service_markup);
                
                services_markup += services_docs.siteaccount;
                
            }
            
            // ECOMMERCE @update 1.5.0
            if (config.privacyPolicy.ecommerce.active === true) {
                
                service_markup = this.generateListMarkup(config.privacyPolicy.ecommerce.personalData);
                services_docs.ecommerce = services_docs.ecommerce.replace(/\[\[ECOMMERCE DATA\]\]/g,service_markup);
                
                service_markup = this.generateListMarkup(config.privacyPolicy.account.storage);
                services_docs.ecommerce = services_docs.ecommerce.replace(/\[\[ECOMMERCE DATA STORAGE\]\]/g,service_markup);
                
                services_markup += services_docs.ecommerce;
                
            }
            
            // THIRD PARTY DATA STORAGE @update 1.5.0
            if (config.privacyPolicy.thirdpartyDataStorage !== false) {
                
                
                // HOSTING
                if (config.privacyPolicy.thirdpartyDataStorage.hosting.home !== false && config.privacyPolicy.thirdpartyDataStorage.hosting.home !== "") {
                    config.privacyPolicy.thirdpartyDataStorage.hosting.provider = '<a href="' + config.privacyPolicy.thirdpartyDataStorage.hosting.home + '">' + config.privacyPolicy.thirdpartyDataStorage.hosting.provider + '</a>';
                } 
                
                if (config.privacyPolicy.thirdpartyDataStorage.hosting.policy !== false && config.privacyPolicy.thirdpartyDataStorage.hosting.policy !== "") {
                    config.privacyPolicy.thirdpartyDataStorage.hosting.policy = '<a href="' + config.privacyPolicy.thirdpartyDataStorage.hosting.policy + '">' + config.privacyPolicy.thirdpartyDataStorage.hosting.policy + '</a>';
                } else {
                    config.privacyPolicy.thirdpartyDataStorage.hosting.policy = "";
                }
                
                services_docs.hosting = services_docs.hosting.replace(/\[\[HOSTING PROVIDER\]\]/g,config.privacyPolicy.thirdpartyDataStorage.hosting.provider);
                services_docs.hosting = services_docs.hosting.replace(/\[\[HOSTING DATACENTER\]\]/g,config.privacyPolicy.thirdpartyDataStorage.hosting.datacenter);
                services_docs.hosting = services_docs.hosting.replace(/\[\[HOSTING DATA ADMINISTRATOR\]\]/g,config.privacyPolicy.thirdpartyDataStorage.hosting.data_administrator);
                services_docs.hosting = services_docs.hosting.replace(/\[\[HOSTING POLICY\]\]/g,config.privacyPolicy.thirdpartyDataStorage.hosting.policy);
                
                
                // NEWSLETTER
                if (config.privacyPolicy.thirdpartyDataStorage.newsletter.active !== false) {
                    
                    
                    if (config.privacyPolicy.thirdpartyDataStorage.newsletter.home !== false && config.privacyPolicy.thirdpartyDataStorage.newsletter.home !== "") {
                        config.privacyPolicy.thirdpartyDataStorage.newsletter.provider = '<a href="' + config.privacyPolicy.thirdpartyDataStorage.newsletter.home + '">' + config.privacyPolicy.thirdpartyDataStorage.newsletter.provider + '</a>';
                    } 

                    if (config.privacyPolicy.thirdpartyDataStorage.newsletter.policy !== false && config.privacyPolicy.thirdpartyDataStorage.newsletter.policy !== "") {
                        config.privacyPolicy.thirdpartyDataStorage.newsletter.policy = '<a href="' + config.privacyPolicy.thirdpartyDataStorage.newsletter.policy + '">' + config.privacyPolicy.thirdpartyDataStorage.newsletter.policy + '</a>';
                    } else {
                        config.privacyPolicy.thirdpartyDataStorage.newsletter.policy = "";
                    }
                    
                    services_docs.newsletter = services_docs.newsletter.replace(/\[\[NEWSLETTER PROVIDER\]\]/g,config.privacyPolicy.thirdpartyDataStorage.newsletter.provider);
                    services_docs.newsletter = services_docs.newsletter.replace(/\[\[NEWSLETTER DATACENTER\]\]/g,config.privacyPolicy.thirdpartyDataStorage.newsletter.datacenter);
                    services_docs.newsletter = services_docs.newsletter.replace(/\[\[NEWSLETTER DATA ADMINISTRATOR\]\]/g,config.privacyPolicy.thirdpartyDataStorage.newsletter.data_administrator);
                    services_docs.newsletter = services_docs.newsletter.replace(/\[\[NEWSLETTER PROVIDER POLICY\]\]/g,config.privacyPolicy.thirdpartyDataStorage.newsletter.policy);
                
                } else {
                    
                    services_docs.newsletter = "";
                    
                }
                
                
                services_thirdparty_markup += services_docs.hosting;
                services_thirdparty_markup += services_docs.newsletter;
                
                
            }
            
            markup = markup.replace(/\[\[SERVIZI DI TERZE PARTI\]\]/g, services_thirdparty_markup);
            markup = markup.replace(/\[\[SERVIZI DI PRIMA PARTE\]\]/g, services_markup);
            
            // @/NEW-CODE ----------------------------------------------- * 

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
            markup = markup.replace(/\[\[DATI PERSONALI\]\]/g, personalDataMarkup); // @update 1.3.3
            markup = markup.replace(/\[\[SCOPI RACCOLTA DATI\]\]/g, purposesMarkup); // @update 1.3.3
            
            // @TODO Rimuovere parte commentata
            
            // @update 1.4.5
            // controllo per retrocompatibilità
            // nel caso in cui il json non sia aggiornato sostituisce il valore mancante 
            // del luogo del trattamento con l'indirizzo aziendale
            // rimuovere controllo alla versione 1.5.0
            /*if (config.globals.dataStorageLocation !== undefined && config.globals.dataStorageLocation !== "") {
                markup = markup.replace(/\[\[LUOGO TRATTAMENTO\]\]/g, config.globals.dataStorageLocation);  
            }else{
                markup = markup.replace(/\[\[LUOGO TRATTAMENTO\]\]/g, config.globals.company.address); 
            }*/
            
            markup = markup.replace(/\[\[LUOGO TRATTAMENTO\]\]/g, config.globals.dataStorageLocation);
            
            
            
            // place markup on element
            $(this.element).html(markup);

        },

        /* ==================================================== */
        /* COOKIE POLICY GENERATOR */
        /* This function generates a dynamical Cookie Policy    */
        /* ==================================================== */
        getCookiePolicy: function (config,docs) {

            // @DEBUG 
            if(this.settings.debug === true) console.log(pluginName + ": getCookiePolicy()");
            if(this.settings.debug === true) console.log(pluginName + ": getCookiePolicy() config: " + JSON.stringify(config));
            if(this.settings.debug === true) console.log(pluginName + ": getCookiePolicy() docs: " + JSON.stringify(docs));


            var markup = docs.cookie_policy_docs['informativa-estesa'];
            
            if(this.settings.debug === true) console.log(pluginName + ": getCookiePolicy() markup: " + JSON.stringify(markup));

            markup = markup.replace(/\[\[NOME SITO\]\]/g, config.globals.site.name);
            markup = markup.replace(/\[\[URL SITO\]\]/g, config.globals.site.url);
            markup = markup.replace(/\[\[NOME E COGNOME DEL RESPONSABILE\]\]/g, config.globals.administrator.name);
            markup = markup.replace(/\[\[ELENCO SERVIZI\]\]/g, '<div id="cookiePolicyServices" class="fdctool__services panel-group" role="tablist" aria-multiselectable="true"></div>');
            markup = markup.replace(/\[\[PRIVACY-POLICY\]\]/g, '<a href="'+ config.privacyPolicy.url +'" class="fdc-cookielaw__privacy-link">LINK</a>');

            $(this.element).html(markup);

            var buttons = '',
                cookieData = {
                    cname: config.cookieBanner.cookieName,
                    cvalue: config.cookieBanner.cookieValue,
                    cvalue_rejected: config.cookieBanner.cookieValueRejected, // @update 1.3.1
                    exdays: config.cookieBanner.cookieExpire
                },
                cookieHunter = this.cookieHunter(cookieData),
                btnClasses = {
                    accept: (this.settings.bootstrap === true) ? 'btn btn-primary' : 'button',
                    reject: (this.settings.bootstrap === true) ? 'btn btn-danger' : 'button button-red'
                };


            buttons +=  '<div class="fdc-cookielaw__policy-buttons">'+
                        '    <button class="' + btnClasses.accept + ' on-policypage fdc-cookielaw__accept-button">Acconsento all\'uso dei cookie</button>'+
                        '    <button class="' + btnClasses.reject + ' on-policypage fdc-cookielaw__reject-button">Rimuovo il consenso all\'uso dei cookie</button>'+
                        '</div>';

            $(this.element).append(buttons);

            console.log('cookieHunter VAR: ' + cookieHunter)

            if (cookieHunter === false) {
                $('.fdc-cookielaw__reject-button.on-policypage').hide();
                $('.fdc-cookielaw__accept-button.on-policypage').fadeIn();
            }else{
                $('.fdc-cookielaw__accept-button.on-policypage').hide();
                $('.fdc-cookielaw__reject-button.on-policypage').fadeIn();
            } 



            // cookie policy accept
            this.cookieAcceptClick(cookieData);
            this.cookieRejectClick(cookieData);

            this.getServices(config,docs);


        },

        /* ==================================================== */
        /* Services Text */
        /* ==================================================== */

        getServices: function (config,docs) {
            $.each(config.cookiePolicy.services, (index, element) => {

                if (element.active === true) {

                    var catLabel = config.cookiePolicy.services[index].catLabel,
                        catName = config.cookiePolicy.services[index].catName,
                        catID = "servicesTool-" + catName,
                        collapseClass = (index === 0) ? ' collapse in' : ' collapse',
                        bootstrapCss = {
                            panel: (this.settings.bootstrap === true) ? " panel panel-default" : "",
                            panelHeading: (this.settings.bootstrap === true) ? " panel-heading" : "",
                            panelTitle: (this.settings.bootstrap === true) ? " panel-title" : "",
                            panelCollapse: (this.settings.bootstrap === true) ? " panel-collapse" + collapseClass : "",
                            panelBody: (this.settings.bootstrap === true) ? " panel-body" : ""
                        };

                    $('#cookiePolicyServices').append('<div id="' + catID + '" class="fdctool__services_cat panel' + bootstrapCss.panel + '"></div>');


                    $('#' + catID).append('<div class="fdctool__services_cat-heading' + bootstrapCss.panelHeading + '" role="tab" id="' + catID + 'Heading"> <h4 class="fdctool__services_cat-title' + bootstrapCss.panelTitle + '"><a role="button" data-toggle="collapse" data-parent="#' + catID + '" href="#' + catID + 'Collapse" aria-expanded="true" aria-controls="' + catID + 'Collapse">' + catLabel + '</a></h4></div>');
                    $('#' + catID).append('<div id="' + catID + 'Collapse" class="fdctool__services_cat-items' + bootstrapCss.panelCollapse + '" role="tabpanel" aria-labelledby="' + catID + 'Heading"><div class="fdctool__services_cat-items-body' + bootstrapCss.panelBody + '"></div></div>'); 



                    $.each(config.cookiePolicy.services[index].services, (key, value) => {

                        if (value === true) {
                            var markup = docs.cookie_policy_docs[key];
                            
                            // @NEW-CODE Gix075 ----------------------------------------- * 
                            markup += this.serviceChoise_buttonBar_markup(config, key); // @update 1.3.0
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
            this.serviceChoise_buttonBar_click(config); // @update 1.3.0
            // /@NEW-CODE ----------------------------------------------- * 
        },
        
        /* ========================================================= */
        /* BANNER TEXT */
        /* Get the right banner text */
        /* ========================================================= */
        getBannerText: function (config,docs) {

            var bannerText = "";

            if (config.cookieBanner.text.customText === false || config.cookieBanner.text.customText === "") {

                // @DEBUG 
                if(this.settings.debug === true) console.log(pluginName + ': getBannerText() -> load text');

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
                if(this.settings.debug === true) console.log(pluginName + ': getBannerText() -> load custom text');
                
                bannerText = config.cookieBanner.text.customText;
            }

            return bannerText;

        },

        /* ====================================================== */
        /* COOKIE BANNER GENERATOR */
        /* This function generates a cookie info banner */
        /* ====================================================== */
        getCookieBanner: function (config,docs,bannerData) {

            // @DEBUG 
            if(this.settings.debug === true) console.log(pluginName + ": getCookieBanner() -> load banner");

            var cookieHunter = this.cookieHunter(bannerData);

            // if cookie is not found load banner
            if (cookieHunter === false) {

                // banner text
                bannerData.text = this.getBannerText(config,docs);
                bannerData.textLink = '<a href="'+ config.cookiePolicy.url +'" title="Informativa Estesa">informativa estesa</a>';

                bannerData.text = bannerData.text.replace(/\[\[INFORMATIVA-ESTESA\]\]/g, bannerData.textLink);
                bannerData.text = bannerData.text.replace(/\[\[NOME SITO\]\]/g, config.globals.site.name);


                // banner markup
                var closeButtonMarkup = '<div class="fdc-cookielaw__banner-close fdc-cookielaw__reject-button"><span>X</span></div>',           
                    bannerMarkup = '<div id="fdCookieLawBanner" class="fdc-cookielaw__banner '+ bannerData.position +'Banner">',
                    //@update 1.6.0
                    // cookieData aggiunto per rifiuto cookie alla chiusura (tramite x o pulsante "solo necessari") del banner
                    cookieData = {
                        cname: config.cookieBanner.cookieName,
                        cvalue: config.cookieBanner.cookieValue,
                        cvalue_rejected: config.cookieBanner.cookieValueRejected, // @update 1.3.1
                        exdays: config.cookieBanner.cookieExpire
                    };
                    
                    

                if (this.settings.bootstrap === true) {
                    // bootstrap markup
                    bannerMarkup += '   <div class="container-fluid">';
                    bannerMarkup += '       <div class="row">';
                    bannerMarkup += '           <div class="fdc-cookielaw__banner-text col-md-12">';
                    bannerMarkup +=                 bannerData.text;
                    bannerMarkup += '           </div>';
                    bannerMarkup += '       </div>';
                    bannerMarkup += '       <div class="row">';
                    bannerMarkup += '           <div class="fdc-cookielaw__banner-buttons col-md-12">';
                    bannerMarkup += '               <a href="'+ config.cookiePolicy.url +'" class="btn btn-primary privacy">' + bannerData.buttons_label.bannerPrivacyButtonLabel + '</a>';
                    if(this.settings.bannerRejectButton === true) {
                        bannerMarkup += '               <a href="#" class="btn btn-danger fdc-cookielaw__reject-button">' + bannerData.buttons_label.bannerRejectButtonLabel + '</a>';
                    }
                    bannerMarkup += '               <a href="#" id="cookieAccept" class="btn btn-success accept fdc-cookielaw__accept-button">' + bannerData.buttons_label.bannerAcceptAllButtonLabel + '</a>';
                    bannerMarkup += '           </div>';
                    bannerMarkup += '       </div>';
                    bannerMarkup += '   </div>';
                }else{
                    // common markup
                    bannerMarkup += '   <div class="fdc-cookielaw__banner-text">';
                    bannerMarkup +=         bannerData.text;
                    bannerMarkup += '   </div>';
                    bannerMarkup += '   <div class="fdc-cookielaw__banner-buttons">';
                    bannerMarkup += '       <a href="'+ config.cookiePolicy.url +'" class="button privacy">' + bannerData.buttons_label.bannerPrivacyButtonLabel + '</a>';
                    if(this.settings.bannerRejectButton === true) {
                        bannerMarkup += '               <a href="#" class="button button-red reject fdc-cookielaw__reject-button">' + bannerData.buttons_label.bannerRejectButtonLabel + '</a>';
                    }
                    bannerMarkup += '       <a href="#" id="cookieAccept" class="fdc-cookielaw__accept-button button accept button-green">' + bannerData.buttons_label.bannerAcceptAllButtonLabel + '</a>';
                    bannerMarkup += '   </div>';
                }

                if(this.settings.bannerCloseButton === true) {
                    bannerMarkup += closeButtonMarkup;
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
                this.cookieAcceptClick(bannerData);
                this.cookieRejectClick(cookieData);

                if (bannerData.acceptOnScroll === true) {
                    $(window).one('scroll', function() {
                        $('#fdCookieLawBanner').removeClass('showBanner');
                        setTimeout(function () {
                            $('#fdCookieLawBanner').remove();
                        },1000);
                        this.writeCookie(bannerData.cname,bannerData.cvalue,bannerData.exdays);
                    });
                }


            }       

        },

        /* ========================================================= */
        /* COOKIE POLICY ACCEPT
        /* ========================================================= */
        cookieAcceptClick: function (cookieData) {
            // cookie policy accept
            $('.fdc-cookielaw__accept-button').on('click', (e) => {
                e.preventDefault();
                this.cookieAccept(cookieData, true);
            });
        },
        
        cookieAccept: function (cookieData, acceptAllServices) {
            $('#fdCookieLawBanner').removeClass('showBanner');
            setTimeout(function () {
                $('#fdCookieLawBanner').remove();
            },1000);
            $('.fdc-cookielaw__accept-button.on-policypage').hide();
            $('.fdc-cookielaw__reject-button.on-policypage').fadeIn();
            this.writeCookie(cookieData.cname, cookieData.cvalue, cookieData.exdays);


            // @NEW-CODE Gix075 ----------------------------------------- * 
            // @update 1.3.0
            if(acceptAllServices === true) {
                this.servicesChoise_handleAll(cookieData.cname, true);
                this.serviceChoise_buttonBar_acceptAllUpdate();
            }
            // /@NEW-CODE ----------------------------------------------- * 

            // Callback OnAccepted
            if ( this.settings.callbackOnAccepted !== null ) this.settings.callbackOnAccepted();
        },

        /* ========================================================= */
        /* COOKIE POLICY REJECT
        /* ========================================================= */
        // @TODO: verificare dopo il click l'esistenza del banner e se non esiste caricarlo
        // @TODO: testare bene se la soluzione proposta funziona

        cookieRejectClick: function (cookieData) {
            // cookie policy accept
            $('.fdc-cookielaw__reject-button').on('click', (e) => {
                e.preventDefault();    
                this.cookieReject(cookieData);
            });
        },
        
        cookieReject: function (cookieData) {
            this.writeCookie(cookieData.cname,cookieData.cvalue_rejected,cookieData.exdays);
                
            // @NEW-CODE Gix075 ----------------------------------------- * 
            // @update 1.3.0
            this.servicesChoise_handleAll(cookieData.cname, false);
            // /@NEW-CODE ----------------------------------------------- * 

            
            //@update 1.6.0 (parte reintrodotta)
            if ( $('#fdCookieLawBanner').length > 0 ) {
                console.log('banner exists on reject');
                $('#fdCookieLawBanner').removeClass('showBanner');
                /* $('.fdc-cookielaw__reject-button.on-policypage').hide();
                $('.fdc-cookielaw__accept-button.on-policypage').fadeIn(); */
            }else {
                this.plugInit(true);
            }
           
            
            // @update 1.6.0 rimosso
            //plugin.plugInit(plugin,true); 

            // Callback OnRejected
            if ( this.settings.callbackOnRejected !== null ) this.settings.callbackOnRejected();
        },

        

        // @NEW-CODE Gix075 ----------------------------------------- * 
        // @update 1.3.0
        /* ####################################################################################### */
        /* SERVICES & COOKIE USER SETTINGS  */
        /* ####################################################################################### */
        
        
        // @NEW-CODE Gix075 ----------------------------------------- * 
        // @update 1.3.4
        // Public method for service choise control
        searchService: function(serviceName,callbackOnTrue,callbackOnFalse) {
            
            // @DEBUG 
            if(this.settings.debug === true) console.log(pluginName + ": searchService() -> start");
            
            $.ajax({
                url: this.settings.config,
                dataType: 'json',
                success: (config) => {
                    // @DEBUG 
                    if(this.settings.debug === true) console.log(pluginName + ": searchService() -> get config");
                    if(this.settings.debug === true) console.log(pluginName + ": config: " + JSON.stringify(config));
                    var servicesCookie = this.serviceChoise_serviceHunter(config, serviceName);
                    if (servicesCookie === true) {
                        callbackOnTrue();
                    }else{
                        callbackOnFalse();
                    }
                },
                error: () => {
                    // @DEBUG 
                    if(this.settings.debug === true) console.log(pluginName + ": searchService() -> AJAXERROR! getting config");
                }
            });
        },
        // @NEW-CODE ----------------------------------------- * 
        
        
        /* ================================================================ */
        /* Single Service Hunter */
        /* Tests if a service is accepted by the user */
        /* ================================================================ */
        serviceChoise_serviceHunter: function(config, service) {

            if(this.settings.debug === true) console.log(pluginName + ": serviceChoise_serviceHunter() -> launching readCookie");
            
            var servicesCookieName = config.cookieBanner.cookieName + "_services",
                currentCookie = this.readCookie(servicesCookieName),
                result;
            
            currentCookie = currentCookie.split(',');
            result = ($.inArray(service, currentCookie) === -1) ? false : true;
            
            return result;
            
        },
        
        /* ================================================================ */
        /* Single Service Handler */
        /* ================================================================ */
        serviceChoise_handleServiceCookie: function(config, service, action, launch_callback) {

            if(this.settings.debug === true) console.log(pluginName + ": serviceChoise_handleServiceCookie() -> launching readCookie");
            
            var servicesCookieName = config.cookieBanner.cookieName + "_services",
                currentCookie = this.readCookie(servicesCookieName),
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
                        // @NEW-CODE Gix075 ----------------------------------------- * 
                        // @update 1.4.0
                        // add single service cookie
                        this.writeCookie(config.cookieBanner.cookieName + '_' + service, "true", config.cookieBanner.cookieExpire);
                        // @/NEW-CODE ----------------------------------------------- * 
                    }else{
                        callbackData.allowed_services = [service];
                        newCookieValue = service;  
                        this.cookieAccept(cookieData, false);
                        // @NEW-CODE Gix075 ----------------------------------------- * 
                        // @update 1.4.0
                        // add single service cookie
                        this.writeCookie(config.cookieBanner.cookieName + '_' + service, "true", config.cookieBanner.cookieExpire);
                        // @/NEW-CODE ----------------------------------------------- * 
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
                            this.cookieReject(cookieData);        
                        }
                        // @NEW-CODE Gix075 ----------------------------------------- * 
                        // @update 1.4.0
                        this.writeCookie(config.cookieBanner.cookieName + '_' + service, "false", config.cookieBanner.cookieExpire);
                        // @/NEW-CODE ----------------------------------------------- * 
                    }
                    break;
            }
            
            if (this.settings.callbackOnChoiseChange !== null && launch_callback === true) {
                this.settings.callbackOnChoiseChange(callbackData);
            }
            
            this.writeCookie(servicesCookieName, newCookieValue, config.cookieBanner.cookieExpire);
            
            
        },
        
        /* ================================================================ */
        /* All services Handler */
        /* ================================================================ */
        servicesChoise_handleAll: function (cookieName, action) {
            
            var servicesCookieName = cookieName + "_services";  
                
                $.ajax({
                    url: this.settings.config,
                    dataType: 'json',
                    success: (config) => {
                        // @DEBUG 
                        if(this.settings.debug === true) console.log(pluginName + ': servicesChoise_acceptAll() -> config loaded!');
                        if(action === true) {
                            $.each(config.cookiePolicy.services, (index) => {
                                if (this.active === true) { 
                                    $.each(config.cookiePolicy.services[index].services, (key, value) => {
                                        if(value === true) this.serviceChoise_handleServiceCookie(config, key, "add", false);
                                    });
                                }
                            });
                        }else{
                            this.writeCookie(servicesCookieName, 'rejected', 365);
                            // @NEW-CODE Gix075 ----------------------------------------- * 
                            // @update 1.4.0
                            $.each(config.cookiePolicy.services, (index) => {
                                $.each(config.cookiePolicy.services[index].services, (key) => {
                                    this.serviceChoise_handleServiceCookie(config, key, "remove", false);
                                });
                            });
                            // @/NEW-CODE ----------------------------------------------- * 
                        }

                    },
                    error: () => {
                        // @DEBUG 
                        if(this.settings.debug === true) console.log(pluginName + ': servicesChoise_acceptAll() -> AJAX ERROR!');
                    }
                });
                
            
            // get configuration file
            
        },
        
        /* ================================================================ */
        /* Single Service Choise Button Bar Generator */
        /* Generates a button bar for each service in Cookie Policy */
        /* ================================================================ */
        serviceChoise_buttonBar_markup: function (config, service) {
            
            var acceptBtnDisabled,
                rejectacceptBtnDisabled,
                elementClass,
                btnAcceptClass,
                btnRejectClass,
                choiseLabelAccepted = 'accettato',
                choiseLabelRejected = 'non accettato',
                panelClasses = {},
                markup;
            
            if(this.serviceChoise_serviceHunter(config, service) === true) {
                acceptBtnDisabled = ' disabled="disabled"';
                rejectacceptBtnDisabled = '';
                elementClass = 'accepted';
            }else{
                acceptBtnDisabled = '';
                rejectacceptBtnDisabled = ' disabled="disabled"';
                elementClass = 'rejected';
            }
            
            if(this.settings.bootstrap === true) {
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
        serviceChoise_buttonBar_click: function (config) {
            
            $('.fdctool__services_item-choise').find('.item-choise-btn').on('click', (e) => {
                e.preventDefault();

                console.log('clicked target: ' + e.target);
                
                var service = $(e.target).closest('.fdctool__services_item-choise').data('cookie'),
                    msgDiv = $(e.target).closest('.fdctool__services_item-choise').find('.fdctool__services_item-choise-msg');
                
                console.log('clicked service: ' + service);
                msgDiv.hide();
                
                if ($(e.target).hasClass('accept')) {
                    this.serviceChoise_handleServiceCookie(config, service, "add", true);
                    $(e.target).attr('disabled',true);
                    $(e.target).closest('.fdctool__services_item-choise').find('.reject').attr('disabled',false);
                    $(e.target).closest('.fdctool__services_item-choise').removeClass('rejected');
                    $(e.target).closest('.fdctool__services_item-choise').addClass('accepted');
                }else{
                    this.serviceChoise_handleServiceCookie(config, service, "remove", true);
                    $(e.target).attr('disabled',true);
                    $(e.target).closest('.fdctool__services_item-choise').find('.accept').attr('disabled',false);
                    $(e.target).closest('.fdctool__services_item-choise').removeClass('accepted');
                    $(e.target).closest('.fdctool__services_item-choise').addClass('rejected');
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
        serviceChoise_buttonBar_acceptAllUpdate: function () {
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
        cookieHunter: function (bannerData) {

            if(this.settings.debug === true) console.log(pluginName + ': cookieHunter() bannerData: ' + bannerData);
            if(this.settings.debug === true) console.log(pluginName + ': cookieHunter() launch readCookie');

            var cookieVal = this.readCookie(bannerData.cname);
            var bannerNeeded;
            
            if (cookieVal !== undefined && cookieVal !== bannerData.cvalue && cookieVal !== bannerData.cvalue_rejected) {
                bannerNeeded = false;
            }else{
                bannerNeeded = true;
            }

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
