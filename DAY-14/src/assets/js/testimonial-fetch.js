// Menggunakan fetch untuk mengambil data dari API
const testimonial = fetch("https://api.npoint.io/7aada19d6a9708ecf81b")
  .then(response => {
    if (!response.ok) {
      throw new Error("Error loading data");
    }
    return response.json();
  });

async function allTestimonial() {
  try {
    const response = await testimonial;
    let testimonialHtml = ``;

    response.forEach((item) => {
      testimonialHtml += `
        <div class="testimonial">
          <img src="${item.image}" alt="testimonial" class="profile-testimonial">
          <p class="quote">${item.content}</p>
          <p class="author">- ${item.author}</p>
          <div class="rating">${generateStars(item.rating)}</div>
        </div>`;
    });

    document.getElementById("testimonials").innerHTML = testimonialHtml;
  } catch (error) {
    console.log(error);
  }
}

allTestimonial();

async function filterTestimonials(rating) {
  try {
    const response = await testimonial;
    let testimonialHtml = ``;

    const dataFilter = response.filter((data) => data.rating === rating);
    if (dataFilter.length === 0) {
      testimonialHtml = `<h1> Data not found!</h1>`;
    } else {
      dataFilter.forEach((item) => {
        testimonialHtml += `
          <div class="testimonial">
            <img src="${item.image}" alt="testimonial" class="profile-testimonial">
            <p class="quote">${item.content}</p>
            <p class="author">- ${item.author}</p>
            <div class="rating">${generateStars(item.rating)}</div>
          </div>`;
      });
    }

    document.getElementById("testimonials").innerHTML = testimonialHtml;
  } catch (error) {
    console.log(error);
  }
}

function generateStars(rating) {
  let starsHtml = '';
  for (let i = 0; i < rating; i++) {
    starsHtml += '<i class="fa-sharp fa-solid fa-star fa-sm" style="color: #ff7b00;"></i>';
  }
  return starsHtml;
}
