fetch('/api/blogs')
    .then((res) => res.json())
    .then((data) => {
        cards(data);
        console.log(data);

    })

const user = localStorage.getItem('user');
const blogContainer = document.getElementById('blog-container');
const nav = document.getElementById('nav');

// Show "Add Blog" for admin
if (user === 'admin') {
    const addBlog = document.createElement('button');
    addBlog.textContent = "Add Blog";
    nav.appendChild(addBlog);
}

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
      <img src="${blog.cover_img_path}" alt="Blog Image">
      <div class="card-content">
        <h3>${blog.title}</h3>
        <p><b>Author:</b> ${blog.author}</p>
        <p><b>Date:</b> ${formatDateTime(blog.createdAt)}</p>
        <p>${blog.content.slice(0, 60)}...</p>
      </div>
      <div class="card-buttons">
        <button onclick="viewBlog(${blog,blog._id})">Learn More</button>
        ${user === 'admin' ? `<button onclick="editBlog(${blog._id})">Edit</button>
                              <button onclick="deleteBlog(${blog._id})">Delete</button>` : ''}
      </div>
    `;
            blogContainer.appendChild(card);
        });
    }
}

// Handle Learn More
function viewBlog(blogs,id) {
    const blog = blogs.find(b => b.id === id);
    localStorage.setItem('currentBlog', JSON.stringify(blog));
    window.location.href = 'blog.html';
}

function goToLogin() {
    window.location.href = 'login.html';
}

function editBlog(id) {
    alert(`Edit blog ${id} - You can implement edit form`);
}

function deleteBlog(id) {
    alert(`Delete blog ${id} - You can connect with API`);
}
