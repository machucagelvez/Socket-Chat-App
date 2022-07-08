const miFormulario = document.querySelector('form')
const url = 'http://localhost:8080/api/auth/'

miFormulario.addEventListener('submit', (e) => {
  e.preventDefault()
  const formData = {}

  for (const element of miFormulario.elements) {
    if (element.name.length > 0) {
      formData[element.name] = element.value
    }
  }
  fetch(url + 'login', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((resp) => resp.json())
    .then(({ msg, token }) => {
      if (msg) {
        return console.log(msg)
      }
      localStorage.setItem('token', token)
      window.location = 'chat.html'
    })
    .catch((error) => console.log(error))
})

function handleCredentialResponse(response) {
  //Google token: ID_TOKEN
  // console.log('id_token', response.credential)
  const body = { id_token: response.credential }
  fetch(url + 'google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then(({ token }) => {
      localStorage.setItem('token', token)
      window.location = 'chat.html'
    })
    .catch(console.warn)
}

const button = document.getElementById('google_signout')
button.onclick = () => {
  console.log(google.accounts.id)
  google.accounts.id.disableAutoSelect()

  //Signout de google:
  google.accounts.id.revoke(localStorage.getItem('token'), (done) => {
    localStorage.clear()
    location.reload() //recarga la página
  })
}
