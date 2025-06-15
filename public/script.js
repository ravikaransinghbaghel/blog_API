fetch('/api/blogs')
    .then((res) => res.json())
    .then((data) => {
        cards(data);
        console.log(data);

    })

let admin = localStorage.getItem('admin');
if (admin === 'true') {
    admin = true;
} else {
    admin = false;
}
const user = localStorage.getItem('user');
const blogContainer = document.getElementById('blog-container');
const nav = document.getElementById('nav');

// Show "Add Blog" for admin
const navitem = [
    { navigate: "gotoPage('index')", name: 'Home', show: true },
    { navigate: "gotoPage('login')", name: 'login', show: !admin },
    { navigate: "gotoPage('#')", name: 'Add blog', show: admin },
    { navigate: "sendData('logout', 'logout')", name: 'logout', show: admin },
]

navitem.filter(item => item.show).forEach((item, index) => {
    nav.innerHTML += `<button key='${index}' onclick="${item.navigate}">${item.name}</button>`
})

function formatDateTime(blog_date) {
    const date = new Date(blog_date);

    const options = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    return date.toLocaleString('en-IN', options);
}

// Render blogs
function cards(blogs) {
    if (blogContainer) {
        blogs.forEach(blog => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
      <img src="${blog.cover_img_path}" alt="Blog Image" onclick="console.log('id:', '${blog._id}')">
      <div class="card-content">
        <h3>${blog.title}</h3>
        <p><b>Author:</b> ${blog.author}</p>
        <p><b>Date:</b> ${formatDateTime(blog.createdAt)}</p>
        <p>${blog.content.slice(0, 60)}...</p>
      </div>
      <div class="card-buttons">
        <button onclick="viewBlog(${blog, blog._id})">Learn More</button>
        ${user === 'admin' ? `<button onclick="editBlog('${blog._id}')">Edit</button>
                              <button onclick="deleteBlog('${blog._id}')">Delete</button>` : ''}
      </div>
    `;
            blogContainer.appendChild(card);
        });
    }
}

// Handle Learn More
function viewBlog(blogs, id) {
    const blog = blogs.find(b => b.id === id);
    localStorage.setItem('currentBlog', JSON.stringify(blog));
    window.location.href = 'blog.html';
}

function gotoPage(page) {
    window.location.href = `${page}.html`;
}

function editBlog(id) {
    alert(`Edit blog ${id} - You can implement edit form`);
}

 function deleteBlog(id) {
     if (!confirm('Are you sure you want to delete this blog?')) return;
    fetch(`https://blog-api-hxsk.onrender.com/api/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            
            alert(`${data}`);
        })
        .catch(err => {
            console.error(err);
            alert('Error deleting blog.');
        });
}

async function sendData(url, page_name) {

    try {
        await fetch(`https://blog-api-hxsk.onrender.com/api/${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert(`${page_name}  successfully!`);
        localStorage.setItem('admin', 'false');
        localStorage.setItem('user', 'user');
        gotoPage('index')
    } catch (error) {
        console.error(`Error submitting ${page_name}:`, error);
        alert(`Failed to submit ${page_name}`);
    }

}
