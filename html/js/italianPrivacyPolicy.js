function setPrivacy(element,jsonConfig) {
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
            $(element).find('.companyVatNumber').text(data.company.vatNumber);
            $(element).find('.adminName').text(data.administrator.name);
            $(element).find('.adminSurname').text(data.administrator.surname);
             

            $(element).find('#personalData').html(personalDataMarkup);
            $(element).find('#purposesData').html(purposesMarkup);
            
        },
        
        error: function () {
            console.log('setPrivacy(): Ajax Error!');
        }
    });
}