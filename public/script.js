const getBlog = async () => {

    let res = await fetch('/api/blogs');
    let data = await res.json();
    cards(data);
    return data;
}


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
    { navigate: "gotoPage('login')", name: 'desktop', show: !admin },
    { navigate: "gotoPage('addBlog')", name: 'Add blog', show: admin },
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
        <button onclick="viewBlog('${blog._id}')">Learn More</button>
        ${user === 'admin' ? `<button onclick="editBlog('${blog._id}')">Edit</button>
                              <button onclick="deleteBlog('${blog._id}','${blog.cover_img_id}')">Delete</button>` : ''}
      </div>
    `;
            blogContainer.appendChild(card);
        });
    }
}

// Handle Learn More
async function viewBlog(id) {
    const BlogData = await getBlog();
    // console.log(BlogData);
    const blog = BlogData.find(item => item._id === id)

    // console.log('blog:', blog);

    localStorage.setItem('currentBlog', JSON.stringify(blog));
    window.location.href = 'blog.html';

}

function gotoPage(page) {
    window.location.href = `${page}.html`;
}

function editBlog(id) {
    alert(`Edit blog ${id} - You can implement edit form`);
}

function deleteBlog(id, post_id) {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    fetch(`/api/delete/${id}/${post_id}`, {
        method: 'DELETE',
    })
        .then(res => res.json())
        .then((data) => {
            // console.log(data);
            alert(`${data.message}`);
        })
        .catch(err => {
            console.error(err);
            alert('Error deleting blog.');
        });
}

async function sendData(url, page_name) {

    try {
        await fetch(`/api/${url}`, {
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

getBlog()