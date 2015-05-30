/*function setPrivacy(element,jsonConfig) {
    $.ajax({
        url: jsonConfig,
        dataType: 'json',
        success: function (data) {

            // personal data
            var personalDataMarkup = "",
                pesonalDataLenght = data.personalData.length,
                purposesMarkup = "",
                purposesDataLenght = data.purposes.length,
                stringEnd = "";
            
            $.each(data.personalData, function (index, value) {
                stringEnd = (index === pesonalDataLenght - 1) ? "." : ";";
                personalDataMarkup += '<li>' + value + stringEnd + '</li>';
            });

            // purposes
            $.each(data.purposes, function (index, value) {
                stringEnd = (index === purposesDataLenght - 1) ? "." : ";";
                purposesMarkup += '<li>' + value + stringEnd + '</li>';
            });

            $(element).find('.siteURL').text(data.site.url);
            $(element).find('.siteName').text(data.site.name);
            $(element).find('.siteEmail').text(data.site.email);
            $(element).find('.companyName').text(data.company.name);
            $(element).find('.companyAddress').text(data.company.address);
            if (data.company.vatLabel != "") $(element).find('.companyVatNumber').text(data.company.vatLabel+" "+data.company.vatNumber);
            $(element).find('.adminName').text(data.administrator.name);
            $(element).find('.adminSurname').text(data.administrator.surname);
             

            $(element).find('#personalData').html(personalDataMarkup);
            $(element).find('#purposesData').html(purposesMarkup);
            
        },
        
        error: function () {
            console.log('setPrivacy(): Ajax Error!');
        }
    });
}*/

function fdcCookieLawTool() {
    
    this.getPrivacy = function (element) {
        var dataS = "";
         $.ajax({
            url: 'config.json',
            dataType: 'json',
            success: function (data) {
                
                var config = data;
                
                $.ajax({
                    url: 'docs/privacy-policy/html/privacy-policy.html',
                    dataType: 'html',
                    success: function(data) {
                        
                        var markup = data,
                            personalDataMarkup = "",
                            pesonalDataLenght = config.privacyPolicy.personalData.length,
                            purposesMarkup = "",
                            purposesDataLenght = config.privacyPolicy.purposes.length,
                            itemStart = "";
                            itemEnd = "";
                            stringEnd = "";
            
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
                        
                        $('#privacyPolicy').html(markup);
                    },
                    error: function() {
                        console.log('fdcCookieLawTool.getPrivacy(): Ajax Error!');
                    }
                });
                
            },
            error: function () {
                console.log('fdcCookieLawTool.getPrivacy(): Ajax Error!');
            } 
         });
        
    }, //end of getPrivacy()
    
    this.getCookiePolicy = function (element) {
        $.ajax({
            url: jsonConfig,
            dataType: 'json',
            success: function (data) {},
            error: function () {
                console.log('fdcCookieLawTool.getPrivacy(): Ajax Error!');
            } 
         });
    }// end of getCookiePolicy()
    
}
