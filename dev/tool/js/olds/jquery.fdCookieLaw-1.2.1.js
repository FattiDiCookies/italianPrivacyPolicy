;(function ( $, window, document, undefined ) {
    
    /*
    ***************************************************************************************
        DEV NOTES: 
            @update [version number] running code changes that need test and debug
            @NEW UPGRADE (commented code under develope) ... must be fixed or removed
            @TO-DO (something to do)
            @DEBUG (debug lines)
    ***************************************************************************************
    */

	"use strict";

		// Create the defaults once
		var pluginName = "fdCookieLaw",
				defaults = {
				    config: "config.json",
                    docs: "docs/docs.complete.json",
                    page: "",
                    banner: "",
                    bannerPosition: "",
                    bootstrap: false,
                    // @NEW UPGRADE : addBodyMargin 
                    // addBodyMargin: true,
                    acceptOnScroll: "",
                    callbackOnAccepted: null, //function
                    callbackOnNotAccepted: null, //function @update 1.2.0
                    callbackOnRejected: null, //function
                    debug: true
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
                    
                    // @NEW UPGRADE : addBodyMargin 
                    // this.settings.bodyMargin = (this.settings.addBodyMargin === true) ? $('body').css('margin-bottom') : null;
                    // this.settings.newBodyMargin = 0;
                    
                    var plugin = this;
                    this.plugInit(plugin, false); // @update 1.2.1
                    
				},
                
                // @update 1.2.1
                plugInit: function (plugin, reloadAfterReject) {
                
                    this.getConfig(plugin, reloadAfterReject);
                    
                },
                
                /* ========================================================= */
                /* LOAD CONFIG */
                /* ========================================================= */
                
                // @update 1.2.1
                getConfig: function (plugin, reloadAfterReject) {
                    
                    // @DEBUG 
                    if(this.settings.debug === true) console.log(pluginName + ": getConfig() -> loading config");
                    
                    $.ajax({
                        url: plugin.settings.config,
                        dataType: 'json',
                        success: function (config) {
                            
                            var loadDocs = false,
                                pageActive = false,
                                bannerActive = false,
                                bannerData = {};
                            
                            // Check if banner is active 
                            if(plugin.settings.banner === true || config.cookieBanner.active === true) {
                                
                                bannerData = {
                                    cname: config.cookieBanner.cookieName,
                                    cvalue: config.cookieBanner.cookieValue,
                                    exdays: config.cookieBanner.cookieExpire
                                };
                                
                                // if cookie is not found load banner
                                var cookieHunter = plugin.cookieHunter(plugin,bannerData);
                                if (cookieHunter === false) {
                                    loadDocs = true;
                                    bannerActive = true;
                                    
                                    // Callback OnNotAccepted @update 1.2.0 and @update 1.2.1
                                    if (plugin.settings.callbackOnNotAccepted !== null && reloadAfterReject === false) plugin.settings.callbackOnNotAccepted();
                                    
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
                        pesonalDataLenght = config.privacyPolicy.personalData.length,
                        purposesMarkup = "",
                        purposesDataLenght = config.privacyPolicy.purposes.length,
                        itemStart = "",
                        itemEnd = "",
                        stringEnd = "";
                    
                    // personal data
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
                                // @TO-DO: inserire qui classi bootstrap
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
                                // @NEW UPGRADE : addBodyMargin 
                                // if (plugin.settings.addBodyMargin === true) plugin.bodyAddMargin('#fdCookieLawBanner');
                            }, 100);
                        });
                        
                        // cookie policy accept
                        plugin.cookieAcceptClick(plugin,bannerData);

                        if (bannerData.acceptOnScroll === true) {
                            $(window).one('scroll', function() {
                                $('#fdCookieLawBanner').removeClass('showBanner');
                                // @update 1.2.1
                                setTimeout(function () {
                                    $('#fdCookieLawBanner').remove();
                                },1000);
                                // @NEW UPGRADE : addBodyMargin 
                                // if (plugin.settings.addBodyMargin === true) plugin.bodyResetMargin(plugin.settings.bodyMargin);
                                plugin.writeCookie(bannerData.cname,bannerData.cvalue,bannerData.exdays);
                            });
                        }
                        
                        
                    }       
                    
                },
                
                // @NEW UPGRADE : addBodyMargin 
                /*
                bodyAddMargin: function(bannerElement) {
                    console.log('ADD NEW MARGIN');
                    $('body').css('margin-bottom',$(bannerElement).height() + 20);
                },
                bodyResetMargin: function(originalMargin) {
                    console.log('RESET MARGIN');
                    $('body').css('margin-bottom',originalMargin);
                },*/
                
                /* ========================================================= */
                /* COOKIE POLICY ACCEPT
                /* ========================================================= */
                cookieAcceptClick: function (plugin,cookieData) {
                    // cookie policy accept
                    $('.fdc-cookielaw__accept-button').on('click', function(e) {
                        e.preventDefault();
                        
                        // @update 1.2.1
                        $('#fdCookieLawBanner').removeClass('showBanner');
                        setTimeout(function () {
                            $('#fdCookieLawBanner').remove();
                        },1000);
                        
                        // @NEW UPGRADE : addBodyMargin 
                        // if (plugin.settings.addBodyMargin === true) plugin.bodyResetMargin(plugin.settings.bodyMargin);
                        
                        $('.fdc-cookielaw__accept-button.on-policypage').hide();
                        $('.fdc-cookielaw__reject-button.on-policypage').fadeIn();
                        plugin.writeCookie(cookieData.cname,cookieData.cvalue,cookieData.exdays);
                        // Callback OnAccepted
                        if ( plugin.settings.callbackOnAccepted !== null ) plugin.settings.callbackOnAccepted();
                    });
                },
            
                /* ========================================================= */
                /* COOKIE POLICY REJECT
                /* ========================================================= */
            
                
                // @TO-DO: verificare dopo il click l'esistenza del banner e se non esiste caricarlo
                
                cookieRejectClick: function (plugin,cookieData) {
                    // cookie policy accept
                    $('.fdc-cookielaw__reject-button').on('click', function(e) {
                        e.preventDefault();
                        
                        /* // @update 1.2.1 Da rimuovere dopo test
                        $('#fdCookieLawBanner').addClass('showBanner');
                        $('.fdc-cookielaw__reject-button.on-policypage').hide();
                        $('.fdc-cookielaw__accept-button.on-policypage').fadeIn();*/
                        
                        // @NEW UPGRADE : addBodyMargin 
                        // if (plugin.settings.addBodyMargin === true) plugin.bodyAddMargin('#fdCookieLawBanner');
                        
                        plugin.writeCookie(cookieData.cname,"rejected",cookieData.exdays);
                        plugin.plugInit(plugin,true); // @update 1.2.1

                        
                        // Callback OnRejected
                        if ( plugin.settings.callbackOnRejected !== null ) plugin.settings.callbackOnRejected();
                    });
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
            

                
                /* ############################################################ */
                /* Cookie Handlers */
                /* ############################################################ */
                
            
                /* ============================================================ */
                /* COOKIE HUNTER */
                /* ============================================================ */
                cookieHunter: function (plugin,bannerData) {
                    
                    var cookieVal = plugin.readCookie(bannerData.cname);
                    var bannerNeeded = (cookieVal !== undefined && cookieVal !== bannerData.cvalue) ? false : true;
                    
                    return bannerNeeded;
                    
                },
                
                /* ============================================================ */
                /* set cookie */
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
                /* read cookie value */
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
