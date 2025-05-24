import utilities from "../../utilities.js";
import store from "../../store.js";
export default {
  template: await utilities.getPage("/js/components/contact-section/index.html"),
  data() {
    return {
      store,
      utilities,
      inputName: "",
      inputSubject: "",
      inputMessage: "",
      api: "https://script.google.com/macros/s/AKfycbwZj7HPNroJve8I6g83ORori0VWZBlq6abRA-9804vshfQxMQEKJwOsTRnORWSVHSbb/exec",
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

      if (this.inputName !== "" && this.inputSubject !== "" && this.inputMessage !== "") {
        this.sendMessage();
      } else alert("please fill out all the required fields to send a message.");
    },
  },
};
