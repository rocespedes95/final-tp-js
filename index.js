/*el archivo api.json tiene 2 secciones mas de productos, no llegue a hacer las otras 2 secciones que serian
    las secciones de perfumes para mujeres y para niños    */
const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const fragment = document.createDocumentFragment();
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;


let carrito = {};

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    if(localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"));
        pintarCarrito()
    }
})

cards.addEventListener("click", e =>{
    addCarrito(e)
})

items.addEventListener("click", e=>{
    botonAccion(e)
} )

const fetchData = async() => {
    try {
        const res  = await fetch("../api.json")
        const data = await res.json()
       pintar_cards(data[0])
    } 
    catch (error) {
        console.log(error);
    }
}
//se imprimen en el html las cards con los datos del archivo json
const pintar_cards = data => {
    data.forEach(producto => {
        templateCard.querySelector("h4").textContent = producto.title;
        templateCard.querySelector("p").textContent = producto.descripcion;
        templateCard.querySelector("li").textContent = producto.precio;
        templateCard.querySelector("img").setAttribute("src", producto.rutaimg);
        templateCard.querySelector(".btn-dark").dataset.id = producto.id;

        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
        
    })
    cards.appendChild(fragment)
  
}

const addCarrito = e => {
    if(e.target.classList.contains("btn-dark")){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
  const producto = {
    id :objeto.querySelector(".btn-dark").dataset.id ,
    title :objeto.querySelector("h4").textContent ,
    precio : objeto.querySelector("li").textContent, 
    cantidad : 1

  }
  
  if(carrito.hasOwnProperty(producto.id)){
    producto.cantidad = carrito[producto.id].cantidad + 1 
  }
   carrito[producto.id] = {...producto}
  pintarCarrito()
}
//tomo los datos para subir info al carrito
const pintarCarrito = ()=>{
    
    items.innerHTML= "";
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector("th").textContent = producto.id;
        templateCarrito.querySelectorAll("td")[0].textContent = producto.title;
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio;

        const clone  = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
        Toastify({
            text: `Se agregó ${producto.title} ${producto.cantidad}`,
            duration: 1500,
            gravity: "bottom",
            style: {
              background: "linear-gradient(0deg, #002c00, #56ab2f)",
            },
          }).showToast();



    })
     items.appendChild(fragment)
     pintarFooter()
        //subo los datos al local storage
     localStorage.setItem("carrito" , JSON.stringify(carrito))
}

const pintarFooter = () => {
        footer.innerHTML = "";
        if(Object.keys(carrito).length === 0){
            footer.innerHTML = `
            <th scope="row" colspan="5">Carrito vacío - Agrega el que mas te guste!</th>
                `
          return
        }
        const nCantidad = Object.values(carrito).reduce((accu , {cantidad})=> accu + cantidad ,0);
        const nPrecio = Object.values(carrito).reduce((accu,{cantidad,precio})=>accu + cantidad * precio,0)
        
        templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
        templateFooter.querySelector("span").textContent = nPrecio

        const clone = templateFooter.cloneNode(true)
        fragment.appendChild(clone)
        footer.appendChild(fragment)

        const botonVaciar = document.getElementById("vaciar-carrito")
        botonVaciar.addEventListener("click", ()=> {
            carrito ={}
            pintarCarrito()
        })

       
}

 const botonAccion = e => {
 
   //boton de aumentar cantidad del carrito de compras
   if(e.target.classList.contains("btn-info")){
       
        console.log( carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++ ; 
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    //boton de disminuir cantidad del carrito de compras
    if(e.target.classList.contains("btn-danger")){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad-- ;
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
 }