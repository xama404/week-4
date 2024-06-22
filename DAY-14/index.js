const express = require('express');
const { Sequelize, QueryTypes } = require("sequelize");
const config = require("./config/config.json");
const sequelize = new Sequelize(config.development);
const path = require('path');
const hbs = require('hbs');
const app = express();
const port = 3000;

// Itung tanggal
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

// Registering a custom Handlebars helper
hbs.registerHelper('includes', function(array, value) {
    return array.includes(value);
  });


// Fungsi untuk mendapatkan ikon teknologi
function getTechnologyIcon(technology) {
    switch (technology) {
        case 'Node.js':
            return '<i class="fa-brands fa-js"></i>';
        case 'React.js':
            return '<i class="fab fa-react"></i>';
        case 'Next.js':
            return '<i class="fa-solid fa-n"></i>';
        case 'TypeScript':
            return '<i class="fa-brands fa-codepen"></i>';
        default:
            return '';
    }
}

// fungsi waktu format indo
function formatDateIndo(date) {
    return new Date(date).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// app.set
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));

// ini untuk assets
app.use("/assets", express.static(path.join(__dirname, "src/assets")));

// Middleware to process form input
app.use(express.urlencoded({ extended: false }));

// Route untuk home page
app.get('/', (req, res) => {
    res.render('index');
});
// Route contact
app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/testimonial', (req, res) => {
    res.render('testimonial');
});

app.get('/add-project', (req, res) => {
    res.render('add-project');
});


// Route myproject
app.get('/myproject', async (req, res) => {
    const query = `SELECT * FROM "tb_projects"`;
    const projects = await sequelize.query(query, { type: QueryTypes.SELECT });

    projects.forEach(project => {
        // fungsi tahun awal
        if (project.start_date) {
            project.startYear = new Date(project.start_date).getFullYear();
        } else {
            project.startYear = "N/A";
        }

        //fungsi durasi
        if (project.start_date && project.end_date) {
            project.duration = calculateDuration(project.start_date, project.end_date);
        } else {
            project.duration = "N/A";
        }

        // Tambahkan ikon teknologi ke dalam setiap teknologi jika tidak null
        // if (project.technologies) {
        //     project.technologies = project.technologies.map(tech => ({
        //         name: tech,
        //         icon: getTechnologyIcon(tech)
        //     }));
        // } else {
        //     project.technologies = [];
        // }
    });

    res.render('myproject', { projects });
});



// CEK MYPROJECT DETAIL
app.get('/myproject/:id', async (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM "tb_projects" WHERE id = :id`;
    const project = await sequelize.query(query, {
        replacements: { id: id },
        type: QueryTypes.SELECT,
        plain: true
    });

    if (project) {
        // fungsi tahun awal
        project.startYear = new Date(project.start_date).getFullYear();
        project.duration = calculateDuration(project.start_date, project.end_date);

        // format tanggal indo
        project.formattedStartDate = formatDateIndo(project.start_date);
        project.formattedEndDate = formatDateIndo(project.end_date);

        // fungsi iconnya
        project.technologies = project.technologies.map(tech => ({
            name: tech,
            icon: getTechnologyIcon(tech)
        }));

        res.render('projectDetail', { project, getTechnologyIcon });
    } else {
        res.redirect('/myproject');
    }
});


// ADD PROJECT
app.post('/add-project', async (req, res) => {
    const { inputProjectName, startDate, endDate, inputDescription, technologies } = req.body;
    try {
        // Ensure technologies is an array and convert it to the correct format for PostgreSQL
        const formattedTechnologies = Array.isArray(technologies) ? `{${technologies.join(',')}}` : `{${technologies}}`;

        const query = `INSERT INTO "tb_projects" (name, start_date, end_date, description, technologies, image) VALUES (:name, :start_date, :end_date, :description, :technologies, :image)`;
        await sequelize.query(query, {
            replacements: {
                name: inputProjectName,
                start_date: startDate,
                end_date: endDate,
                description: inputDescription,
                technologies: formattedTechnologies,
                image: 'Gambar-1.png'
            },
            type: QueryTypes.INSERT
        });
        console.log('Project Added:', {
            name: inputProjectName,
            start_date: startDate,
            end_date: endDate,
            description: inputDescription,
            technologies: formattedTechnologies,
            image: 'Gambar-1.png'
        });
    } catch (error) {
        console.error('Error adding project:', error);
    }
    res.redirect('/myproject');
});

// GET ID DARI MYPROJECT
app.get('/update-project/:id', async (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM "tb_projects" WHERE id = :id`;
    const project = await sequelize.query(query, {
        replacements: { id: id },
        type: QueryTypes.SELECT,
        plain: true
    });

    if (project) {
        // Tambahkan properti isChecked untuk setiap teknologi
        const allTechnologies = ['Node.js', 'React.js', 'Next.js', 'TypeScript'];
        project.technologies = allTechnologies.map(tech => ({
            name: tech,
            isChecked: project.technologies.includes(tech)
        }));
        res.render('update-project', { project });
    } else {
        res.redirect('/myproject');
    }
});




// UPDATE PROJECT
app.post('/update-project/:id', async (req, res) => {
    const { id } = req.params;
    const { inputProjectName, startDate, endDate, inputDescription, technologies } = req.body;

    // Ensure technologies is an array and convert it to the correct format for PostgreSQL
    const formattedTechnologies = Array.isArray(technologies) ? `{${technologies.join(',')}}` : `{${technologies}}`;

    try {
        const query = `UPDATE "tb_projects" SET name = :name, start_date = :start_date, end_date = :end_date, description = :description, technologies = :technologies, image = :image WHERE id = :id`;
        await sequelize.query(query, {
            replacements: {
                id: id,
                name: inputProjectName,
                start_date: startDate,
                end_date: endDate,
                description: inputDescription,
                technologies: formattedTechnologies,
                image: 'Gambar-1.png'
            },
            type: QueryTypes.UPDATE
        });
        console.log('Project Updated:', {
            id: id,
            name: inputProjectName,
            start_date: startDate,
            end_date: endDate,
            description: inputDescription,
            technologies: formattedTechnologies,
            image: 'Gambar-1.png'
        });
    } catch (error) {
        console.error('Error updating project:', error);
    }
    res.redirect('/myproject');
});



// DELETE PROJECT
app.post('/delete-project/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Cek data sebelum hapus
        const fetchQuery = `SELECT * FROM "tb_projects" WHERE id = :id`;
        const project = await sequelize.query(fetchQuery, {
            replacements: { id: id },
            type: QueryTypes.SELECT,
            plain: true
        });

        if (project) {
            console.log('Project details before deletion:', project);
        } else {
            console.log(`Project with id ${id} not found`);
        }

        // Hapus Project
        const deleteQuery = `DELETE FROM "tb_projects" WHERE id = :id`;
        await sequelize.query(deleteQuery, {
            replacements: { id: id },
            type: QueryTypes.DELETE
        });
        
        console.log(`Project with id ${id} deleted successfully`);
    } catch (error) {
        console.error(`Error deleting project with id ${id}:`, error);
    }
    res.redirect('/myproject');
});

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
