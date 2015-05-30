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
                    page: "cookie",
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
						
                    if(this.settings.debug === true) console.log(pluginName + ": start... loading config");
                    
                    var plugin = this;
                    
                    $.ajax({
                        url: plugin.settings.config,
                        dataType: 'json',
                        success: function (data) {
                            
                            switch(plugin.settings.page) {
                                case "privacy" :
                                    plugin.getPrivacyPolicy(data);
                                    break;
                                case "cookie" :
                                    plugin.getCookiePolicy(data);
                                    break;
                                default:
                                    plugin.getCookiePolicy(data);
                                    break;
                            }
                            
                            plugin.getCookieBanner(data,plugin);
                        },
                        error: function() {
                            if(plugin.settings.debug === true) console.log(pluginName + ": ajax error loading config file");
                            $(plugin.element).html('<h1>Error!</h1>');
                        }
                    });// end ajax
                    
                    
				},
            
                /* ================================================= */
                /* PRIVACY POLICY GENERATOR */
                /* ================================================= */
				getPrivacyPolicy: function (config) {
                    
                    if(this.settings.debug === true) console.log(pluginName + ": getPrivacyPolicy()");
                    
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
                            if (config.globals.company.vatNumber != "") {
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
                            if(plugin.settings.debug === true) console.log(pluginName + ": ajax error loading privacy policy file");
                            $(plugin.element).html('<h1>Error!</h1>');
                        }
                    });
				},
            
                /* ================================================= */
                /* COOKIE POLICY GENERATOR */
                /* ================================================= */
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
                            markup = markup.replace(/\[\[ELENCO SERVIZI\]\]/g, '<div id="cookiePolicyServices" class=""></div>');
                            
                            
                            $(plugin.element).html(markup);
                            
                            $.each(config.cookiePolicy.services, function(key, value) {
                                if (value === true) {
                                    $.ajax({
                                        url:plugin.cookieSERVICES + key + ".html" ,
                                        dataType: 'html',
                                        async: false,
                                        success: function(data) {
                                            data = data.replace(/\[\[NOME SITO\]\]/g, config.globals.site.name);
                                            data = data.replace(/\[\[URL SITO\]\]/g, config.globals.site.url);
                                            console.log(data);
                                            $('#cookiePolicyServices').append(data);
                                        },
                                        error: function() {
                                            console.log('error');
                                        }
                                        
                                    });
                                    
                                    /*$.get(plugin.cookieSERVICES + key + ".html" , function( data ) {
                                        data = data.replace(/\[\[NOME SITO\]\]/g, config.globals.site.name);
                                        data = data.replace(/\[\[URL SITO\]\]/g, config.globals.site.url);
                                        console.log(data);
                                        $('#cookiePolicyServices').append(data);
                                    });*/
                                }
                            });
            
                        },
                        error: function () {
                            if(plugin.settings.debug === true) console.log(pluginName + ": ajax error loading cookie policy file");
                            $(plugin.element).html('<h1>Error!</h1>');
                        } 
                     });//end ajax
                },
            
                /* ================================================= */
                /* COOKIE BANNER GENERATOR */
                /* ================================================= */
                getCookieBanner: function (config,plugin) {
                    var bannerMarkup = '';
                        bannerMarkup += '<div id="fdCookieLawBanner" class="fdc-cookielaw__banner">';
                        bannerMarkup += '   <div class="fdc-cookielaw__banner-text">';
                        bannerMarkup += '       Questo sito non fa uso di cookie per la profilazione in prima persona.<br>Questo sito fa però uso di cookie tecnici. Questo sito utilizza inoltre embed di codice e servizi esterni. Nell\'informativa estesa sono disponibili i link alle terze parti ove negare i cookies dei terzi che possono profilare se attivati dall\'utente sul sito del terzo.<br>Procedendo nella navigazione o cliccando su "Accetto" si acconsente all\'uso dei cookie.';
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
                    });
                    
                    $(window).on('scroll', function() {
                        $('#fdCookieLawBanner').removeClass('showBanner');
                    });
                    
                    plugin.writeCookie("cookieTest","ready",1);
                    plugin.readCookie("cookieTest");
                },
                
                /* ============================================================ */
                /* Cookie Handler */
                /* ============================================================ */
                
                cookieHunter: function (cname,cvalue,plugin) {
                    cookieVal = plugin.readCookie(cname);
                    if (cookieVal != undefined && cookieVal != cvalue) {
                        plugin.getCookieBanner();
                    }
                },
                
                writeCookie: function(cname, cvalue, exdays) {
                    
                    if(this.settings.debug === true) console.log(pluginName + ': writeCookie(' + cname + ' ' + cvalue + ' ' + exdays +')');
                    
                    var d = new Date();
                    d.setTime(d.getTime() + (exdays*24*60*60*1000));
                    var expires = "expires="+d.toUTCString();
                    document.cookie = cname + "=" + cvalue + "; " + expires;
                },
            
                readCookie: function(cname) {
                    
                    if(this.settings.debug === true) console.log(pluginName + ': readCookie(' + cname + ')');
                    
                    var name = cname + "=";
                    var ca = document.cookie.split(';');
                    for(var i=0; i<ca.length; i++) {
                        var c = ca[i];
                        while (c.charAt(0)==' ') c = c.substring(1);
                        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
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
