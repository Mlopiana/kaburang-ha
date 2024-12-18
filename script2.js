 const postsContainer = document.getElementById('posts');
        const postForm = document.getElementById('postForm');
        const editPane = document.getElementById('editPane');
        const editTitle = document.getElementById('editTitle');
        const editBody = document.getElementById('editBody');
        const saveEditButton = document.getElementById('saveEdit');
        const cancelEditButton = document.getElementById('cancelEdit');

        let editingPostId = null;

        // Fetch and display posts
        let localPosts = []; // Store fetched posts locally

// Fetch and display posts
const fetchPosts = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();

    localPosts = posts.slice(0, 10); // Keep only the first 10 posts
    renderPosts();
};

// Render posts from local state
const renderPosts = () => {
    postsContainer.innerHTML = '';
    localPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <div class="buttons">
                <button class="edit" onclick="openEditPane(${post.id})">Edit</button>
                <button class="delete" onclick="deletePost(${post.id})">Delete</button>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
};

// Add a new post
postForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;

    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({ title, body }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
    });

    const newPost = await response.json();
    localPosts.unshift(newPost); // Add to local state
    renderPosts();
    alert('Post added!');
    postForm.reset();
});

// Open the edit pane
const openEditPane = (id) => {
    const post = localPosts.find(post => post.id === id);
    if (post) {
        editingPostId = id;
        editTitle.value = post.title;
        editBody.value = post.body;
        editPane.style.display = 'block';
    }
};

// Save edited post
saveEditButton.addEventListener('click', async () => {
    const title = editTitle.value;
    const body = editBody.value;

    if (title && body) {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${editingPostId}`, {
            method: 'PUT',
            body: JSON.stringify({ title, body }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });

        if (response.ok) {
            const postIndex = localPosts.findIndex(post => post.id === editingPostId);
            if (postIndex > -1) {
                localPosts[postIndex] = { ...localPosts[postIndex], title, body }; // Update local state
                renderPosts();
                alert('Post updated!');
                editPane.style.display = 'none';
            }
        } else {
            alert('Failed to update post.');
        }
    }
});

// Delete a post
const deletePost = async (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            localPosts = localPosts.filter(post => post.id !== id); // Remove from local state
            renderPosts();
            alert('Post deleted!');
        } else {
            alert('Failed to delete post.');
        }
    }
};

// Initial fetch
fetchPosts();