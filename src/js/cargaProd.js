document.addEventListener("DOMContentLoaded",()=>{

const { createClient } = supabase;

const supabaseUrl = 'https://mcljfvdksggqnqudkzip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbGpmdmRrc2dncW5xdWRremlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTM3MDQsImV4cCI6MjA2Mzc2OTcwNH0.Fk1osUqO6GdbcPchF9PwTAUfkvO5J9F1pOETXaI-Ewo'; // tu clave
const supabaseClient = createClient(supabaseUrl, supabaseKey);

//Carga los productos cargados en la bd a la tienda
async function productos(){
    const {data,error}=await supabaseClient
                .from('productos')
                .select('*');

    if (error) {
        console.error('Error al cargar productos:', error.message);
        return;
    }
    
    const catalogo=document.getElementById('catalogo');

    catalogo.innerHTML="";

    const cont_prod=document.createElement('div');
    cont_prod.className='produc';

    data.forEach(producto=>{
        const card=document.createElement('div');
        card.className='cards';
        card.innerHTML=`
        
            <div>
                <img  class="img" src="${producto.img_url}" alt="${producto.nom_prod}">
            </div>

            <div class="price">
                    <p>$ ${producto.precio}</p>
            </div>

            <div class="nom_prod">
                    <p>${producto.nom_prod}</p>
            </div>

            <button class="add_cart" onclick="add_carrito(this)" data-id="${producto.prod_id}" >Agregar al carrito</button>
        
        `;
        cont_prod.appendChild(card);
    });
    catalogo.appendChild(cont_prod);
}
productos();
});