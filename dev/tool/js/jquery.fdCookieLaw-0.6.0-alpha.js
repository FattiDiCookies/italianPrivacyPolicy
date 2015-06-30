// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "fdCookieLaw",
				defaults = {
				    config: "config.json",
                    docs: "docs/",
                    page: "",
                    banner: "",
                    bannerPosition: "top",
                    debug: true
		};

		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				// jQuery has an extend method which merges the contents of two or
				// more objects, storing the result in the first object. The first object
				// is generally empty as we don't want to alter the default options for
				// future instances of the plugin
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
                this.privacyDOC = this.settings.docs + "privacy-policy/html/privacy-policy.html";
                this.cookieDOC = this.settings.docs + "cookie-policy/html/informativa-estesa.html";
                this.cookieBANNER = this.settings.docs + "cookie-policy/html/banner/";
                this.cookieSERVICES = this.settings.docs + "cookie-policy/html/services/";
				this.init();
                    
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
				init: function () {
						// Place initialization logic here
						// You already have access to the DOM element and
						// the options via the instance, e.g. this.element
						// and this.settings
						// you can add more functions like the one below and
						// call them like so: this.yourOtherFunction(this.element, this.settings).
					
                    // **** DEBUG **** 
                    if(this.settings.debug === true) console.log(pluginName + ": start... loading config");
                    
                    var plugin = this;
                    
                    $.ajax({
                        url: plugin.settings.config,
                        dataType: 'json',
                        success: function (data) {
                            
                            // Cookie or Privacy policy
                            switch(plugin.settings.page) {
                                case "privacy" :
                                    plugin.getPrivacyPolicy(data);
                                    break;
                                case "cookie" :
                                    plugin.getCookiePolicy(data);
                                    break;
                                default:
                                    //plugin.getCookiePolicy(data);
                                    break;
                            }
                            
                            // Cookie Banner 
                            
                            var bannerData = {
                                cname: data.cookieBanner.cookieName,
                                cvalue: data.cookieBanner.cookieValue,
                                exdays: data.cookieBanner.cookieExpire,
                                acceptOnScroll: data.cookieBanner.acceptOnScroll
                            };
                            
                            
                            if(plugin.settings.banner === true) {
                                bannerData.position = plugin.settings.bannerPosition;
                                //plugin.cookieHunter(plugin,data,bannerData)
                                plugin.getBannerText(plugin,data,bannerData);
                            }
                            
                            if(plugin.settings.banner === "" && data.cookieBanner.active === true) {
                                bannerData.position = data.cookieBanner.position;
                                //plugin.cookieHunter(plugin,data,bannerData)
                                plugin.getBannerText(plugin,data,bannerData);
                            }

                        },
                        error: function() {
                            
                            // **** DEBUG **** 
                            if(plugin.settings.debug === true) console.log(pluginName + ": ajax error loading config file");
                            
                            $(plugin.element).html('<h1>Error!</h1>');
                            
                        }
                    });// end ajax
                    
                    
				},
            
                /* ========================================================= */
                /* PRIVACY POLICY GENERATOR */
                /* This function generates a dynamical Privacy Policy */
                /* ========================================================= */
				getPrivacyPolicy: function (config) {
                    
                    // **** DEBUG **** 
                    if(this.settings.debug === true) console.log(pluginName + ": getPrivacyPolicy() --> load page");
                    
                    var plugin = this;
                    
                    $.ajax({
                        url: plugin.privacyDOC,
                        dataType: 'html',
                        success: function(data) {

                            var markup = data,
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
                            
                            $(plugin.element).html(markup);
                        },
                        error: function() {
                            
                            // **** DEBUG **** 
                            if(plugin.settings.debug === true) console.log(pluginName + ": getPrivacyPolicy() --> ajax error loading privacy policy file");
                            
                            $(plugin.element).html('<h1>Error!</h1>');
                        }
                    });
				},
            
                /* ==================================================== */
                /* COOKIE POLICY GENERATOR */
                /* This function generates a dynamical Cookie Policy    */
                /* ==================================================== */
                getCookiePolicy: function (config) {
                    
                    if(this.settings.debug === true) console.log(pluginName + ": getCookiePolicy()");
                    
                    var plugin = this;
                    
                    $.ajax({
                        url: plugin.cookieDOC,
                        dataType: 'html',
                        success: function (data) {
                            var markup = data;
                            
                            markup = markup.replace(/\[\[NOME SITO\]\]/g, config.globals.site.name);
                            markup = markup.replace(/\[\[URL SITO\]\]/g, config.globals.site.url);
                            markup = markup.replace(/\[\[NOME E COGNOME DEL RESPONSABILE\]\]/g, config.globals.administrator.name);
                            markup = markup.replace(/\[\[ELENCO SERVIZI\]\]/g, '<div id="cookiePolicyServices" class="fdctool__services"></div>');
                            
                            
                            $(plugin.element).html(markup);
                            
                            
                            $.each(config.cookiePolicy.services, function(index) {
                                
                                var catLabel = config.cookiePolicy.services[index].catLabel;
                                var catName = config.cookiePolicy.services[index].catName;
                                var catID = "servicesTool-" + catName;
                                
                                $('#cookiePolicyServices').append('<div id="' + catID + '" class="fdctool__services_cat"></div>');
                                
                                $('#' + catID).append('<h2 class="fdctool__services_cat-title">' + catLabel + '</h2>');                                
                                
                                $.each(config.cookiePolicy.services[index].services, function(key, value) {
                                                                        
                                    if (value === true) {
                                        $.ajax({
                                            url:plugin.cookieSERVICES + key + ".html" ,
                                            dataType: 'html',
                                            success: function(data) {
                                                data = data.replace(/\[\[NOME SITO\]\]/g, config.globals.site.name);
                                                data = data.replace(/\[\[URL SITO\]\]/g, config.globals.site.url);
                                                $('#' + catID).append(data);
                                            },
                                            error: function() {
                                                console.log('error');
                                            }

                                        });
                                    }
                                   
                                });
                            });
                            
                            
                            
                            /*$.each(config.cookiePolicy.services, function(key, value) {
                                if (value === true) {
                                    $.ajax({
                                        url:plugin.cookieSERVICES + key + ".html" ,
                                        dataType: 'html',
                                        success: function(data) {
                                            data = data.replace(/\[\[NOME SITO\]\]/g, config.globals.site.name);
                                            data = data.replace(/\[\[URL SITO\]\]/g, config.globals.site.url);
                                            $('#cookiePolicyServices').append(data);
                                        },
                                        error: function() {
                                            console.log('error');
                                        }
                                        
                                    });
                                }
                            });*/
            
                        },
                        error: function () {
                            if(plugin.settings.debug === true) console.log(pluginName + ": ajax error loading cookie policy file");
                            $(plugin.element).html('<h1>Error!</h1>');
                        } 
                     });//end ajax
                },
            
                /* ====================================================== */
                /* COOKIE BANNER GENERATOR */
                /* This function generates a cookie info banner */
                /* ====================================================== */
                getCookieBanner: function (config,plugin,bannerData) {
                    var bannerMarkup = '';
                        bannerMarkup += '<div id="fdCookieLawBanner" class="fdc-cookielaw__banner '+ bannerData.position +'Banner">';
                        bannerMarkup += '   <div class="fdc-cookielaw__banner-text">';
                        bannerMarkup +=         bannerData.text;
                        bannerMarkup += '   </div>';
                        bannerMarkup += '   <div class="fdc-cookielaw__banner-buttons">';
                        bannerMarkup += '       <a href="'+ config.cookiePolicy.url +'" class="button privacy">Cookie Policy</a>';
                        bannerMarkup += '       <a href="#" id="cookieAccept" class="button accept close" href="'+ config.cookiePolicy.url +'" class="button privacy">Accetto</a>';
                        bannerMarkup += '   </div>';
                        bannerMarkup += '</div>';
                    
                    $('body').append(bannerMarkup);
                    $('body').promise().done(function() {
                        setTimeout(function() {
                            $('#fdCookieLawBanner').addClass('showBanner');
                        }, 100);
                    });
                    
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
                },
            
            
            
                /* ========================================================= */
                /* BANNER TEXT */
                /* Get the right banner text */
                /* ========================================================= */
                getBannerText: function (plugin,config,bannerData) {
                    
                    if (config.cookieBanner.text.customText === false || config.cookieBanner.text.customText === "") {
                        
                        // **** DEBUG **** 
                        if(plugin.settings.debug === true) console.log(pluginName + ': getBannerText() -> load text');
                        
                        var bannerTextFile = "";
                        // Technical
                        if (config.cookieBanner.text.techCookies === true && config.cookieBanner.text.profCookies === false && config.cookieBanner.text.embedCode === false)  {
                            bannerTextFile = "banner_tech.html";
                        }
                        
                        // Technical + Profiling + Embed
                        if (config.cookieBanner.text.techCookies === true && config.cookieBanner.text.profCookies === true && config.cookieBanner.text.embedCode === true)  {
                            bannerTextFile = "banner_tech-embed-prof.html";
                        }
                        
                        // Technical + Embed
                        if (config.cookieBanner.text.techCookies === true && config.cookieBanner.text.profCookies === false && config.cookieBanner.text.embedCode === true)  {
                            bannerTextFile = "banner_tech-embed.html";
                        }
                        
                        // Technical + Profiling
                        if (config.cookieBanner.text.techCookies === true && config.cookieBanner.text.profCookies === true && config.cookieBanner.text.embedCode === false)  {
                            bannerTextFile = "banner_tech-prof.html";
                        }
                        
                        // Profiling + Embed
                        if (config.cookieBanner.text.techCookies === false && config.cookieBanner.text.profCookies === true && config.cookieBanner.text.embedCode === true)  {
                            bannerTextFile = "banner_embed-prof.html";
                        }
                        
                        // Profiling
                        if (config.cookieBanner.text.techCookies === false && config.cookieBanner.text.profCookies === true && config.cookieBanner.text.embedCode === false)  {
                            bannerTextFile = "banner_prof.html";
                        }
                        
                        // Embed
                        if (config.cookieBanner.text.techCookies === false && config.cookieBanner.text.profCookies === false && config.cookieBanner.text.embedCode === false)  {
                            bannerTextFile = "banner_embed.html";
                        }
                        
                        $.ajax({
                            
                            url: plugin.cookieBANNER + bannerTextFile,
                            dataType: 'html',
                            success: function (data) {
                                bannerData.text = data;
                                plugin.cookieHunter(plugin,config,bannerData);
                            },
                            error: function() {
                                // **** DEBUG **** 
                                if(plugin.settings.debug === true) console.log(pluginName + ': getBannerText() -> ajax error on banner text loading!');
                            }
                            
                        });//end ajax
                        
                    } else {
                        
                        // **** DEBUG **** 
                        if(plugin.settings.debug === true) console.log(pluginName + ': getBannerText() -> load custom text');
                       
                        bannerData.text = config.cookieBanner.text.customText;
                        plugin.cookieHunter(plugin,config,bannerData);
                    }
                    
                    
                },
            

                
                /* ############################################################ */
                /* Cookie Handlers */
                /* ############################################################ */
                
            
                /* ============================================================ */
                /* COOKIE HUNTER */
                /* ============================================================ */
                cookieHunter: function (plugin,config,bannerData) {
                    
                    var cookieVal = plugin.readCookie(bannerData.cname);
                    
                    if (cookieVal !== undefined && cookieVal != bannerData.cvalue) {
                        plugin.getCookieBanner(config,plugin,bannerData);
                    }
                    
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
