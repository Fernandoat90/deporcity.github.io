const { createClient } = supabase;

const supabaseUrl = 'https://mcljfvdksggqnqudkzip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbGpmdmRrc2dncW5xdWRremlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTM3MDQsImV4cCI6MjA2Mzc2OTcwNH0.Fk1osUqO6GdbcPchF9PwTAUfkvO5J9F1pOETXaI-Ewo'; // tu clave
const supabaseClient = createClient(supabaseUrl, supabaseKey);


async function add_carrito(btn){

    const producId=btn.dataset.id;
    const localUser= sessionStorage.getItem("user_id");

    console.log("producto:"+typeof(producId));
    console.log("usuario:"+typeof(localUser));

    const {data,error}=await supabaseClient
                        .from('carrito')
                        .insert([{usu_id:localUser,prod_id:producId}]);

    if(error){
        alert("Error al registrar: " + error.message);
        console.error(error);
    }else{
        console.log("producto agregado");
        alert("Producto agregado");
    }
}

async function loadChart(){
    const localUser= sessionStorage.getItem("user_id");
    const {data,error}=await supabaseClient
                        .from('carrito')
                        .select(`*,
                            productos(
                            nom_prod,
                            precio,
                            img_url)`)
                            .eq('usu_id',localUser);
    if(error){
        alert("Error al registrar: " + error.message);
        console.error(error);
    }else{
        console.log(data)
    }



    const prodContent=document.getElementById('cart-prod');
    
    data.forEach(producto=> {
        
        const prodAlta=document.createElement('div');
        prodAlta.className='userProd';
        prodAlta.innerHTML=`
            <div>
                <img class="img" src="${producto.productos.img_url}" alt="${producto.productos.nom_prod}">
            </div>

            <div class="nom_prod">
                    <p>${producto.productos.nom_prod}</p>
            </div>

            <div class="price">
                    <p>$ ${producto.productos.precio}</p>
            </div>

            <div class="btn-del">
                <button class="btnDelete" onclick="deleteProd(this)" data-id="${producto.id}">
                    <img src="./src/img/trash-static.png" class="static" alt="Eliminar">
                    <img src="./src/img/trash-animate.gif" class="animate" alt="Eliminar">
                </button>
            </div>

        `;
        prodContent.appendChild(prodAlta);
        
    });
    
    let total=0
    data.forEach(price=>{
        total+=price.productos.precio;
    })
    const cantidad=document.createElement('p');
    cantidad.innerHTML='<strong>Cantidad de productos:</strong> '+data.length+' Unidades---------------------------- <strong>Total</strong>: $'+total;
    prodContent.append(cantidad);
    
}

async function deleteProd(btn){
    const elimProd=btn.dataset.id;
    const prodContent=document.getElementById('cart-prod');

    const {data,error}=await supabaseClient
                        .from('carrito')
                        .delete()
                        .eq('id',elimProd);
    
    if(error){
        alert("Error al eliminar producto: " + error.message);
        console.error(error);
    }else{
        console.log('Producto eliminado exitosamente');
        prodContent.innerHTML='';
        loadChart();
    }

}
