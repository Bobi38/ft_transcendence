const form = document.getElementById('login');

const data = {
    email: form.email.value,
    password: form.password.value
};

console.log(data.email + "  " + data.password);

const reponse = await fetch('/login', {
    method: 'POST',
    body: JSON.stringify(data)
});

const result = await reponse.json();
console.log(reponse);
if (reponse.success)
    alert ("Connection success");
else
    alert ("Error =" + reponse.message);