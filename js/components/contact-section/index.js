import utilities from "../../utilities.js";
import store from "../../store.js";
export default {
  template: await utilities.getPage("/js/components/contact-section/index.html"),
  data() {
    return {
      store,
      utilities,
      inputName: "",
      inputEmail: "",
      inputSubject: "",
      inputMessage: "",
      api: "https://script.google.com/macros/s/AKfycby0sPCTGk0W4QZhO5njp0THu2o0TR-FE8mCIV1DKQVmaaQmFis_Gn9Oa2pRnWci5l0b/exec?jurdilaw",
    };
  },
  computed: {
    // sendMessage() {
    //     return `mailto:${this.store.contact.email}?subject=${encodeURIComponent(this.inputSubject)}&body=${encodeURIComponent('Name: ' + this.inputName + ' - \n\n' + this.inputMessage)}`
    // }
  },
  methods: {
    sendMessage() {
      let payload = {
        email: this.inputEmail,
        name: this.inputName,
        subject: this.inputSubject,
        message: this.inputMessage,
      };
      fetch(this.api, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(payload),
      }).then((res) => {
        console.log(res);
        alert("Thanks! Your message has been sent successfully.");
      });
    },
    sendMessageTo() {
      //   location.href = this.sendMessage;
      const isValidEmail = (email) => {
        // Regular expression for email validation
        // This regex is a common pattern for validating email addresses.
        // It checks for:
        // - Characters before the '@' symbol (local part): letters, numbers,
        //   and some special characters like ._%+-
        // - An '@' symbol
        // - Characters after the '@' symbol (domain part): letters, numbers,
        //   and hyphens, followed by a dot '.' and then 2 or more letters
        //   for the top-level domain (e.g., .com, .org)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Test the email against the regex
        return emailRegex.test(email);
      };
      if (!isValidEmail(this.inputEmail)) {
        alert("Invalid email format");
        return null;
      }
      if (this.inputName !== "" && this.inputSubject !== "" && this.inputMessage !== "" && this.inputEmail !== "") {
        this.sendMessage();
      } else alert("please fill out all the required fields to send a message.");
    },
  },
};
