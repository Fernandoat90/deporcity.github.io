//conexión a la BD supabase
const { createClient } = supabase;

const supabaseUrl = 'https://mcljfvdksggqnqudkzip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbGpmdmRrc2dncW5xdWRremlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTM3MDQsImV4cCI6MjA2Mzc2OTcwNH0.Fk1osUqO6GdbcPchF9PwTAUfkvO5J9F1pOETXaI-Ewo'; // tu clave
const supabaseClient = createClient(supabaseUrl, supabaseKey);

//Validacion de acceso al usuario
async function valid_usu() {

  let usu = document.getElementById("usu").value.trim();
  let pass = document.getElementById("pass").value.trim();

  const {data,error}=await supabaseClient
                    .from('usuarios')
                    .select('usu_id,usu_nom , password')
                    .eq('usu_nom',usu)
                    .eq('password',pass)
                    .single();

  if (error) {
    document.getElementById("error").textContent = "Usuario o contraseña inválido";
    console.error("Error en validación:", error.message);
    return;
  }

  if (data) {
    sessionStorage.setItem("aproved", "true");
    sessionStorage.setItem("user_id",data.usu_id);
    window.location.href = "index.html";
  } else {
    document.getElementById("error").textContent = "Usuario o contraseña inválido";
  }

}


//Registro de usuario
function regist(){
    
    const form=document.getElementById("form-log");
    
    form.innerHTML=`
    <label for="new-usu">Usuario</label>
    <input type="text" id="new-usu" placeholder="Ej:miguel" required />
    <label for="mail">Mail</label>
    <input type="text" id="mail" placeholder="Ej:*****@mail.com" required />
    <label for="new-pass">Password</label>
    <input type="password" id="new-pass" placeholder="*******" required />
    <label for="repeat-pass">Repetir Contraseña</label>
    <input type="password" id="repeat-pass" placeholder="*******" required />
    <button type="button" onclick="registrar()" id="ok-regis" disabled>Registrar</button>
    <p id="error"></p>
    <p>¿Ya tienes una cuenta? <a href="#" onclick="cargarLogin()">Inicia Sesion</a></p>
    `;

    samePass();

}

//Comparacion de password
function samePass(){
        const pass1=document.getElementById("new-pass");
    const pass2=document.getElementById("repeat-pass");
    

    pass2.addEventListener("input",()=>{
        if(pass2.value===""){
            pass2.style.backgroundColor="white";
            document.getElementById("ok-regis").disabled=true;
        }else if(pass2.value!==pass1.value){
            pass2.style.backgroundColor="red";
            document.getElementById("ok-regis").disabled=true;
        }else{
            pass2.style.backgroundColor="lightgreen";
            document.getElementById("ok-regis").disabled=false;
        }
      })
}

//Loggin inicial
function cargarLogin(){
    const form = document.getElementById("form-log");

    form.innerHTML = `
        <label for="usu">Usuario</label>
        <input type="text" id="usu" placeholder="Ej:miguel" required />
        <label for="pass">Password</label>
        <input type="password" id="pass" placeholder="******" required />
        <button type="button" onclick="valid_usu()">Confirmar</button>
        <p id="error"></p>
        <p>¿No tienes un usuario?<a href="#" onclick="regist()">¡¡Registrate!!</a></p>
    `;
}

//Registro de usuario
async function registrar(){

    const usu=document.getElementById("new-usu").value.trim();
    const mail=document.getElementById("mail").value.trim();
    const contra=document.getElementById("new-pass").value.trim();
    
    const result_mail=await verifMail(mail);

    const result_usu=await verifUsu(usu);

    if(result_mail){
      const form = document.getElementById("form-log");
      let error=document.getElementById("error");
      error.innerHTML="Mail ya registrado";
      error.style.color="red";
      form.appendChild(error);
      return;
    }else if(result_usu){
      const form = document.getElementById("form-log");
      let error=document.getElementById("error");
      error.innerHTML="Nombre de Usuario ya registrado";
      error.style.color="red";
      form.appendChild(error);
      return;
    }
    
    const {data,error}=await supabaseClient
                      .from('usuarios')
                      .insert([{usu_nom:usu,mail:mail,password:contra}]);

    if(error){
      alert("Error al registrar: " + error.message);
      console.error(error);
    }else{
      alert("¡Usuario creado correctamente!");
      cargarLogin();
    }
}

//Verifica si el mail y el usuario existe cuando se envia el formulario
async function verifMail(mail){
  const {data,error}=await supabaseClient
                    .from('usuarios')
                    .select('*')
                    .eq('mail',mail)
                    .single();

  if (error && error.code !== 'PGRST116') {
    
    console.error("Error al verificar mail:", error.message);
    return true;
  }

  return !!data;
}

async function verifUsu(usu){
  const {data,error}=await supabaseClient
                    .from('usuarios')
                    .select('*')
                    .eq('usu_nom',usu)
                    .single();

  if (error && error.code !== 'PGRST116') {
    
    console.error("Error al verificar usuario:", error.message);
    return true;
  }

  return !!data;
}