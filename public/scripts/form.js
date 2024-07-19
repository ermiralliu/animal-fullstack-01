"use strict"

const buttons = document.querySelectorAll('.animal-button');
{
    const header = document.getElementById('animal');
    const container = document.getElementById('specific-div');
    const the_form = document.getElementById('the-form');
    function buttonListener(type){
        const subs = type.substring(0, type.length -1)
        if(header.textContent === subs)
            return;
        header.textContent = subs;
        container.removeChild( document.getElementById('specific') );
        container.appendChild( forms[type] );
        the_form.action = `../insert/${type}`
    };
    buttons.forEach( button => button.addEventListener("click", ()=> buttonListener(button.id)));
}

const forms = {};
{   //makes it more readable ig
    forms.Dogs = document.getElementById('specific'); //since we start with the dog innerHTML;
    forms.Cats = makeForm(['Origin ', 'Temperament ', 'Colors ']);      //cat is basically dog with less steps here    
    forms.Birds = makeForm(['Species ','Family ','Habitat ','Place_found ', 'Diet (separate different foods with a comma)', 'Weight (in kg) ', 'Height (in cm) ']);           //making the bird in place using an arrow function
    Object.freeze(forms);
}

function createTextbox(label){
    const name = label.charAt(0).toLowerCase() + label.substring(1, label.indexOf(' '));
    const row = document.createElement('tr');
    const data = { label: document.createElement('td'), input: document.createElement('td') };
    data.label.textContent = label;
    
    const input = document.createElement('input');
    input.name = name;
    data.input.appendChild(input);

    row.appendChild( data.label );
    row.appendChild( data.input );
    
    return row;
}

function makeForm( array ){
    const table = document.createElement('table');
    table.id = 'specific';
    for(const label of array)
        table.appendChild(createTextbox(label));
    return table;
}