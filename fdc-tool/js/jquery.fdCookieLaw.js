;(function ( $, window, document, undefined ) {

	"use strict";

		// Create the defaults once
		var pluginName = "fdCookieLaw",
				defaults = {
				    config: "config.json",
                    docs: "docs/docs.complete.json",
                    page: "",
                    banner: "",
                    bannerPosition: "",
                    acceptOnScroll: "",
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
					
                    // **** DEBUG **** 
                    if(this.settings.debug === true) console.log(pluginName + ": start");
                    
                    var plugin = this;
                    
                    this.plugInit(plugin);
                    
				},
            
                plugInit: function (plugin) {
                
                    this.getConfig(plugin);
                    
                },
                
                /* ========================================================= */
                /* LOAD CONFIG */
                /* ========================================================= */
            
                getConfig: function (plugin) {
                    
                    // **** DEBUG **** 
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
                            
                            // **** DEBUG **** 
                            if(plugin.settings.debug === true) console.log(pluginName + ": getConfig() -> ajax error loading config file");
                            
                            $(plugin.element).html('<h1>Error!</h1>');
                            
                        }
                    });// end ajax
                },
            
                /* ========================================================= */
                /* GET ALL DOCS DATA */
                /* ========================================================= */
                getDocsData: function (plugin,config,pageActive,bannerActive,bannerData) {
                    
                    // **** DEBUG **** 
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
                            // **** DEBUG **** 
                            if(this.settings.debug === true) console.log(pluginName + ": getDocsData() -> ajax error loading docs");
                        }
                    });//end ajax
                },
                
                /* ========================================================= */
                /* SET BANNER */
                /* ========================================================= */
                setBanner: function (plugin,config,docs,bannerData) {
                
                    // **** DEBUG **** 
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
                    
                    // **** DEBUG **** 
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
                    
                    // **** DEBUG **** 
                    if(this.settings.debug === true) console.log(pluginName + ": getCookiePolicy()");
                    

                    var markup = docs.cookie_policy_docs['informativa-estesa'];

                    markup = markup.replace(/\[\[NOME SITO\]\]/g, config.globals.site.name);
                    markup = markup.replace(/\[\[URL SITO\]\]/g, config.globals.site.url);
                    markup = markup.replace(/\[\[NOME E COGNOME DEL RESPONSABILE\]\]/g, config.globals.administrator.name);
                    markup = markup.replace(/\[\[ELENCO SERVIZI\]\]/g, '<div id="cookiePolicyServices" class="fdctool__services"></div>');


                    $(plugin.element).html(markup);

                    plugin.getServices(plugin,config,docs);
            

                },
                
                /* ==================================================== */
                /* Services Text */
                /* ==================================================== */
            
                getServices: function (plugin,config,docs) {
                    $.each(config.cookiePolicy.services, function(index) {
                        
                        if (this.active === true) {
                        
                            var catLabel = config.cookiePolicy.services[index].catLabel;
                            var catName = config.cookiePolicy.services[index].catName;
                            var catID = "servicesTool-" + catName;

                            $('#cookiePolicyServices').append('<div id="' + catID + '" class="fdctool__services_cat"></div>');

                            $('#' + catID).append('<h2 class="fdctool__services_cat-title">' + catLabel + '</h2>');                                

                            $.each(config.cookiePolicy.services[index].services, function(key, value) {

                                if (value === true) {
                                    var markup = docs.cookie_policy_docs[key];
                                    // Prevent code failure if docs.complete.json is not consistent
                                    if(typeof markup !== 'undefined') {
                                        markup = markup.replace(/\[\[NOME SITO\]\]/g, config.globals.site.name);
                                        markup = markup.replace(/\[\[URL SITO\]\]/g, config.globals.site.url);
                                        $('#' + catID).append(markup);  
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
                    
                    // **** DEBUG **** 
                    if(this.settings.debug === true) console.log(pluginName + ": getCookieBanner() -> load banner");
                    
                    var cookieHunter = plugin.cookieHunter(plugin,bannerData);
                    
                    // if cookie is not found load banner
                    if (cookieHunter === false) {
                        
                        // banner text
                        bannerData.text = plugin.getBannerText(plugin,config,docs,bannerData);
                        bannerData.textLink = '<a href="'+ config.cookiePolicy.url +'" title="Informativa Estesa">Informativa Estesa</a>';
                        
                        bannerData.text = bannerData.text.replace(/\[\[INFORMATIVA-ESTESA\]\]/g, bannerData.textLink);
                        
                        // banner markup
                        var bannerMarkup = '';
                            bannerMarkup += '<div id="fdCookieLawBanner" class="fdc-cookielaw__banner '+ bannerData.position +'Banner">';
                            bannerMarkup += '   <div class="fdc-cookielaw__banner-text">';
                            bannerMarkup +=         bannerData.text;
                            bannerMarkup += '   </div>';
                            bannerMarkup += '   <div class="fdc-cookielaw__banner-buttons">';
                            bannerMarkup += '       <a href="'+ config.cookiePolicy.url +'" class="button privacy">Informativa Estesa</a>';
                            bannerMarkup += '       <a href="#" id="cookieAccept" class="button accept close" href="'+ config.cookiePolicy.url +'" class="button privacy">OK</a>';
                            bannerMarkup += '   </div>';
                            bannerMarkup += '</div>';
                        
                        // load banner
                        $('body').append(bannerMarkup);
                        $('body').promise().done(function() {
                            setTimeout(function() {
                                $('#fdCookieLawBanner').addClass('showBanner');
                            }, 100);
                        });
                        
                        // cookie policy accept
                        $('.close').on('click', function(e) {
                            e.preventDefault();
                            $('#fdCookieLawBanner').removeClass('showBanner');
                            plugin.writeCookie(bannerData.cname,bannerData.cvalue,bannerData.exdays);
                        });

                        if (bannerData.acceptOnScroll === true) {
                            $(window).one('scroll', function() {
                                $('#fdCookieLawBanner').removeClass('showBanner');
                                plugin.writeCookie(bannerData.cname,bannerData.cvalue,bannerData.exdays);
                            });
                        }
                        
                        
                    }
                    
                    
                },
            
            
            
                /* ========================================================= */
                /* BANNER TEXT */
                /* Get the right banner text */
                /* ========================================================= */
                getBannerText: function (plugin,config,docs,bannerData) {
                    
                    var bannerText = "";
                    
                    if (config.cookieBanner.text.customText === false || config.cookieBanner.text.customText === "") {
                        
                        // **** DEBUG **** 
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
                        
                        // **** DEBUG **** 
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
                    
                    if(this.settings.debug === true) console.log(pluginName + ': writeCookie(' + cname + ' ' + cvalue + ' ' + exdays +')');
                    
                    var d = new Date();
                    d.setTime(d.getTime() + (exdays*24*60*60*1000));
                    var expires = "expires="+d.toUTCString();
                    document.cookie = cname + "=" + cvalue + "; " + expires;
                },
                
                /* ============================================================ */
                /* read cookie value */
                /* ============================================================ */
                readCookie: function(cname) {
                    
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
