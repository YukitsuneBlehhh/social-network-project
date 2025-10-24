const urlbase = 'https://jsonplaceholder.typicode.com/posts' //URL con la que se interactua
let posts = [] //Inicializacion de posteos en vacio

function getData(){
    fetch(urlbase)
    .then(res => res.json())
    .then(data => {
        posts = data
        renderPostList()
    })
    .catch(error => console.error('Error al llamar a la API: ', error))
}

getData()

function renderPostList(){
    const postlist = document.getElementById('postList')
    postlist.innerHTML = '';

    posts.forEach(post => {
        const listItem = document.createElement('li')
        listItem.classList.add('postItem')
        listItem.innerHTML = `
        <strong>${post.title}</strong>
        <p>${post.body}</p>
        <button onclick = "editPost(${post.id})"> Editar </button>
        <button onclick = "deletePost(${post.id})"> Eliminar </button>

        <div id="editForm-${post.id}" class="editForm" style="display=none">
           <label for="editTitle">Título: </label>
           <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
           <label for="editBody"> Comentario: </label>
           <textarea id="editBody-${post.id}"<required>${post.body}</textarea>
           <button onclick="updatePost(${post.id})"> Actualizar </button>
        </div>
        `

        postlist.appendChild(listItem)
    })
}

function postData() {
    const postTitleInput = document.getElementById('postTitle');
    const postBodyInput = document.getElementById('postBody');
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;

    if (postTitle.trim() == '' || postBody.trim() == '') {
        alert('Los campos son obligatorios')
        return
    }

    fetch(urlbase, {
        method: 'POST',
        body: JSON.stringify({
            title: postTitle,
            body: postBody,
            userID      : 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        })

.then((res) => res.json())
.then(data => {
    posts.unshift(data)
    renderPostList();
    postTitleInput.value = ''
    postBodyInput.value = ''
})

.catch(error => console.error('Error al querer crear posteo: ', error))
}



function editPost(id) {
    const editForm = document.getElementById(`editForm-${id}`);
    editForm.style.display = (editForm.style.display == 'none') ? 'none' : 'block'
}



function updatePost(id){
    const editTitle = document.getElementById(`editTitle-${id}`).value;
    const editBody = document.getElementById(`editBody-${id}`).value;

    fetch(`${urlbase}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: id,
            title: editTitle,
            body: editBody,
            userID      : 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(res => res.json())
    .then(data => {
        const index = posts.findIndex(post => post.id === data.id)
        if(index != -1){
            posts[index] = data
        }else {
            alert('Hubo un error al actualizar el mensaje')
        }
        renderPostList()
    })
    .catch(error => console.error('Error al querer actualizar posteo: ', error))

}

function deletePost(id){
    fetch(`${urlbase}/${id}`, {
        method: 'DELETE',
    })
    .then(res => {
        if(res.ok){
            posts = posts.filter(post => post.id != id)
            renderPostList();
        } else{
            alert('Hubo un error y no se pudo eliminar el mensaje')
        }
    })
    .catch (error => console.error('Hubo un error: ', error))
}