// Inisialisasi array untuk menyimpan data proyek
let projectsData = [];

function submitProject(event) {
  // Mencegah form dari submit default
  event.preventDefault();

  // Mengambil nilai dari form input
  let projectName = document.getElementById("inputProjectName").value;
  let projectStartDate = document.getElementById("inputStartDate").value;
  let projectEndDate = document.getElementById("inputEndDate").value;
  let projectDescription = document.getElementById("inputDescription").value;
  let projectTechnologies = [];
  let projectImage = document.getElementById("inputImage").files;

  // Cek teknologi yang dipilih dan tambahkan ikon Font Awesome
  if (document.getElementById("techNodeJs").checked) {
    projectTechnologies.push('<i class="fa-brands fa-js"></i> Node.js');
  }
  if (document.getElementById("techReactJs").checked) {
    projectTechnologies.push('<i class="fab fa-react"></i> ReactJs');
  }
  if (document.getElementById("techNextJs").checked) {
    projectTechnologies.push('<i class="fa-solid fa-n"></i> NextJs');
  }
  if (document.getElementById("techTypeScript").checked) {
    projectTechnologies.push('<i class="fa-brands fa-codepen"></i> TypeScript');
  }

  // Validasi input
  if (!projectName || !projectStartDate || !projectEndDate || !projectDescription || projectTechnologies.length === 0 || projectImage.length == 0) {
    alert("Please fill out all the fields and select at least one technology, and upload an image.");
    return;
  }

  // Mengambil URL dari file gambar yang di-upload
  if (projectImage.length > 0) {
    projectImage = URL.createObjectURL(projectImage[0]);
  } else {
    projectImage = 'path-to-default-image.jpg'; // Ganti dengan path ke gambar default jika tidak ada gambar yang di-upload
  }

  // Membuat objek proyek baru
  let newProject = {
    name: projectName,
    startDate: projectStartDate,
    endDate: projectEndDate,
    description: projectDescription,
    technologies: projectTechnologies,
    image: projectImage,
    postedDate: new Date() // Menyimpan waktu posting
  };

  // Menambahkan proyek baru ke array
  projectsData.push(newProject);

  // Memanggil fungsi untuk menampilkan semua proyek
  renderProjects();
}

function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 31) {
    return `${diffDays} Day`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} Month`;
  } else {
    const years = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30);
    return `${years} Year ${remainingMonths} Month`;
  }
}

function timeSince(date) {
  const now = new Date();
  const secondsPast = (now.getTime() - new Date(date).getTime()) / 1000;

  if (secondsPast < 60) {
    return `${Math.floor(secondsPast)} seconds ago`;
  }
  if (secondsPast < 3600) {
    return `${Math.floor(secondsPast / 60)} minutes ${Math.floor(secondsPast % 60)} seconds ago`;
  }
  if (secondsPast < 86400) {
    return `${Math.floor(secondsPast / 3600)} hours ${Math.floor((secondsPast % 3600) / 60)} minutes ago`;
  }
  if (secondsPast < 2592000) {
    return `${Math.floor(secondsPast / 86400)} days ${Math.floor((secondsPast % 86400) / 3600)} hours ago`;
  }
  if (secondsPast < 31536000) {
    return `${Math.floor(secondsPast / 2592000)} months ${Math.floor((secondsPast % 2592000) / 86400)} days ago`;
  }
  return `${Math.floor(secondsPast / 31536000)} years ${Math.floor((secondsPast % 31536000) / 2592000)} months ago`;
}
function renderProjects() {
  let projectsContainer = document.getElementById("projectsContainer");
  projectsContainer.innerHTML = ""; // Mengosongkan container

  // Loop melalui semua data proyek dan membuat HTML untuk setiap proyek
  projectsData.forEach((project, index) => {
      const startYear = new Date(project.startDate).getFullYear();
      const duration = calculateDuration(project.startDate, project.endDate);
      const postedTime = timeSince(project.postedDate);

      const projectCard = `
          <div class="container col-lg-3 col-md-4 col-sm-12 mb-4">
              <div class="project-card card h-100">
                  <img src="${project.image}" class="card-img-top" alt="Project Image">
                  <div class="card-body">
                      <h5 class="card-title">${project.name} - ${startYear}</h5>
                      <p class="card-text">Durasi: ${duration}</p>
                      <p class="card-text">${project.description}</p>
                      <p class="text-muted posted-time">${postedTime}</p>
                      <div class="project-technologies">
                          ${project.technologies.map(tech => `<span> ${tech}</span>`).join(' ')}
                      </div>
                  </div>
                  <div class="project-actions">
                    <button class="button edit">Edit</button>
                    <button class="button delete" onclick="deleteProject(${index})">Delete</button>
                  </div>
              </div>
          </div>
      `;

      projectsContainer.innerHTML += projectCard;
  });
}






function deleteProject(index) {
  projectsData.splice(index, 1);
  renderProjects();
}

// Pastikan untuk memanggil fungsi ini di akhir file untuk menampilkan proyek saat halaman dimuat
renderProjects();

// Update renderProjects setiap detik
setInterval(renderProjects, 1000);
