module.exports = function() {

    return {

        title: 'ZefiZan',
        description: 'Portfolio website for ZefiZan',
        copyright: 'Marleen PAUWELS',
        includeSnipcart: true,

        baguetteWidths: [480, 960, 1440, 1920],

        contactName: "name",
        contactEmail: "email",
        contactMessage: "message",
        contactNameError: "Name can not be empty.",
        contactEmailError: "Email address is empty or is invalid.",
        contactMessageError: "Message can not be empty.",
        contactSubmitMessage: "For security reasons we use an extra control step to send us your message.",
        contactSubmit: "submit",

        // -----------------------------------------------------------------------------------------

        getCurrentYear: function() { return (new Date()).getFullYear(); }
        
    };
};

