function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
    const re = /^(08|628)[0-9]{8,}$/;
    return re.test(String(phone));
}

function submitData() {
    const inputName = document.getElementById("inputName").value;
    const inputEmail = document.getElementById("inputEmail").value;
    const inputPhone = document.getElementById("inputPhone").value;
    const inputSubject = document.getElementById("inputSubject").value;
    const inputMessage = document.getElementById("inputMessage").value;

    // Kondisi
    if (inputName === "") {
        alert('Form nama harus diisi!');
    } else if (inputEmail === "") {
        alert('Form email harus diisi!');
    } else if (!validateEmail(inputEmail)) {
        alert('Masukkan alamat email yang valid!');
    } else if (inputPhone === "") {
        alert('Form nomor telepon harus diisi!');
    } else if (!validatePhone(inputPhone)) {
        alert('Masukkan nomor telepon yang valid (minimal 10 digit, diawali dengan 08 atau 628)!');
    } else if (inputSubject === "") {
        alert('Form subjek harus diisi!');
    } else if (inputMessage === "") {
        alert('Form pesan harus diisi!');
    } else {
        console.log(
            `Name : ${inputName}\nEmail : ${inputEmail}\nPhone : ${inputPhone}\nSubject : ${inputSubject}\nMessage : ${inputMessage}`
        );

        const myemail = "teguh@thx.my.id";
        const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${myemail}&su=${encodeURIComponent(inputSubject)}&body=${encodeURIComponent(
            `Halo, Nama saya ${inputName}, \n\n${inputMessage} \n\nHubungi saya dengan email ${inputEmail} dan nomor telepon saya ${inputPhone}`
        )}`;
        window.open(mailtoLink, '_blank');
    }
}
