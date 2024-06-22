const testimonial = new Promise((resolve, reject) => {  
    const xhr = new XMLHttpRequest();
    //xhr adalah xml http request
    // berguna untuk memanggil API

    //API adalah Application Programming Interface
    //API adalah sebuah data / kumpulan data yang tersedia dari server
    //yang dapat digunakan untuk dikelola 
    xhr.open("GET","https://api.npoint.io/6891d3f8a56fa9fede48", true);
    // GET => Metode
    // yg kedua => alamat API
    // yg ke 3 =>sebuah izin

    // funsgi true => mengizinkan asyncronus (dijalankan secra bersama)
    // fungsi false => membiarkan tetap syncronus (dijalankan secara berurutan)
    xhr.onload = function () {
        if(xhr.status == 200){
            resolve(JSON.parse(xhr.response));     
        }else{
            reject("Error Load Data");
        }
    };
    xhr.onerror = function () {
        reject("404 Not Found");
    };

    xhr.send();
});
    
async function showTestimonial(){
    try{
      const response = await testimonial;
      let testimonialHtml = ``;

      response.forEach((item) => {
        testimonialHtml +=`
        <div class="testimonial">         
        <img src="${item.image}" alt="ini gambar testi" class="profile-testimonial">
            <p class="quote">${item.content}</p>
            <p class="author">-${item.author}</p>
            <p class="author">${item.rating} <i class="fa-regular fa-star"></i></p>
        </div>`;
        });

        document.getElementById('testimonials').innerHTML = testimonialHtml

    } catch(error) {
        console.log(error);
    }
}

//callback -> pemanggilan fungsi kembali

showTestimonial();

async function filterTestimonials(rating) {
    try {
        const response = await testimonial;
        let testimonialHtml = ``;
        const dataFilter = response.filter((data) => data.rating === rating);
        if (dataFilter.length === 0) {
            testimonialHtml = `<h1> Data Not Found</h1>`;
        } else {
            dataFilter.forEach((data) => {
                testimonialHtml += `
                <div class="testimonial">         
                <img src="${data.image}" alt="ini gambar testi" class="profile-testimonial">
                    <p class="quote">${data.content}</p>
                    <p class="author">-${data.author}</p>
                    <p class="author">${data.rating} <i class="fa-regular fa-star"></i></p>
                </div>`;
            });
        }

     document.getElementById('testimonials').innerHTML = testimonialHtml;
    
    } catch(error) { 
        console.log(error);
    }
}