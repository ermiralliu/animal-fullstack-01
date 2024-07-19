var data = {};
var selectedCollection = [];
get();

async function get(){
    let object = await fetch( "/view", {method: "GET"});
    data = await object.json();
    //console.log(JSON.stringify(data));
    for(const key of Object.keys(data)){
        const table = document.getElementById(`${key}-body`);
        table.innerHTML = createTableInner( data[key] , key);
        const head = document.getElementById(key);
        head.setAttribute("colspan", Object.keys(data[key][0]).length+1);
    }
}

function mainRow(object){
    toAdd = "<tr>";
    for( const key of Object.keys(object) )
        toAdd+=`<td>${key}</td>`;
    return toAdd + "<td>selected</td></tr>";
}

function createTableInner(array, type){
    toAdd = mainRow(array[0]);
    array.forEach( element=>{
        toAdd += createRow(element, type);
    });
    return toAdd;
}

function createRow(object, type){
    let str = '<tr>';
    for(const [key, value] of Object.entries(object))
        str+= `<td> ${value}</td>`;
    str+= `<td> <input type="radio" class=${type} name="select" value=${object._id}></td>`;
    return str + `<tr>`;
}
//show the form section
const showButton = document.getElementById("update");
const form = document.getElementById("mainform");
showButton.addEventListener("click", showButtonListener );

function showButtonListener(event){
    event.preventDefault();
    const radiobtn = document.querySelector('input[name="select"]:checked');
    if(radiobtn == null){
        alert("No entry is selected");
        return;
    }
    const collection = data[radiobtn.className];  //we just use square brackets and a string to get the instance variable of that name
    const thisForm = collection.find( ({_id}) => _id === radiobtn.value);
    //console.log(JSON.stringify(thisForm));
    form.innerHTML = createInputTable(thisForm);

    let array =  document.getElementsByName("_id");
    console.log(array.length);
    array[0].id = "sth2";
   
    array[0].readOnly = true;          //there's only one id and that's after we add it
    selectedCollection = thisForm;

    const moDiv = document.getElementById("mod");        //makes the modal window
    moDiv.className = "modal";

}

function createInputTable(object){
    let str ='<div class="one" id="more"><table id="frmtbl"><tr><td class="inn">Property</td><td>Value</td> </tr>';
    for(const [key, value] of Object.entries(object))
        str+= `<tr ><td class="inn"> ${key} </td><td class="inn"><input class="toChange" name="${key}" value="${value}"></input></td></tr>`;
    return str +`</table><button type="button" onclick="this.disabled=true; updateThem()"> Send </button><button type="button" onclick="window.location.reload()"> Cancel </button> </div>`;    //kishte nje bug kur hiqje modal window dhe s'po e gjeja, keshtu qe e bera t'i beje faqes reload
}

// update section
async function updateThem(){
    console.log("working");
    let conf = confirm("Are you sure you want to update these fields?");
    const form = document.getElementById("mainform");
    const formData = new FormData(form);
    let object = {};
    formData.forEach( (value, key)=>{
        if( !( selectedCollection[key] == value ))  //kontrollojme nese vlerat jane te njejta si fillestaret, nese jane, nuk i dergojme
            object[key] = value;
    });
    const id = selectedCollection['_id'];
    object['type'] = document.querySelector('input[name="select"]:checked').className;
    //console.log( JSON.stringify(object));
    const fetchOptions = {   
                        method: "PUT",
                        headers: new Headers({'Content-Type': 'application/json'}), // Indicates the content
                        body: JSON.stringify(object)
                        }
    try{
        let result = await fetch(`/update/id=${id}`, fetchOptions);
        result = await result.json();
        console.log( JSON.stringify(result));
        alert("Data updated successfully: " + result.response);
    }
    catch(err){
        //console.log( JSON.stringify(result));
        alert("Data not updated successfully");
        console.error(err);
    }
    finally{
        window.location.reload();
    }
}

// //delete section
const deleteButton = document.getElementById("delete");
deleteButton.addEventListener("click", deleteThem);

async function deleteThem(){
    
    const radiobtn = document.querySelector('input[name="select"]:checked');
    if(radiobtn == null){
        alert("No entry is selected");
        return;
    }
    let conf = confirm("Are you sure you want to delete this entry?");
    if(conf === false){
        console.log("User did not confirm");
        return;
    }
    const obj = {
        id: radiobtn.value,
        type: radiobtn.className
    };
    console.log(JSON.stringify(obj));
    try{
        let result = await fetch(`/update/delete:?type=${obj.type}?id=${obj.id}`, {   
                                                method: "DELETE",
                                                headers: {  'Content-type': 'application/json; charset=UTF-8'}, // Indicates the content 
                                                });
        result = await result.json();
        //console.log(JSON.stringify(result));
        alert("Operation successful: " + result.response);
    }catch(err){
        console.error(err);
        alert("Operation unsuccessful");
    }
    finally{
        window.location.reload();
        button.removeEventListener("click", deleteThem);
    }
}