const createContact = (event: SubmitEvent) => {
    event.preventDefault();
    
    let name: string | undefined;
    let email: string | undefined;
    let phone: string | undefined;
    let postalcode: string | undefined;

    const nameElement = document.getElementById('contactName');
    if(nameElement instanceof HTMLInputElement){
        name = nameElement.value;
    } else {
        console.log('Cannot find element with id of contactName');
    }

    const emailElement = document.getElementById('contactEmail');
    if(emailElement instanceof HTMLInputElement){
        email = emailElement.value;
    } else {
        console.log('Cannot find element with id of contactEmail');
    }

    const phoneElement = document.getElementById('contactPhone');
    if(phoneElement instanceof HTMLInputElement){
        phone = phoneElement.value;
    } else {
        console.log('Cannot find element with id of contactPhone');
    }

    const postalcodeElement = document.getElementById('contactPostalcode');
    if(postalcodeElement instanceof HTMLInputElement){
        postalcode = postalcodeElement.value;
    } else {
        console.log('Cannot find element with id of contactPostalcode');
    }

    const setErrors = {
        name: '',
        email: '',
        phone: '',
        postalcode: '',
    }

    if(name?.trim().length === 0){
        setErrors.name = 'Name is required';
    }

    if(email?.trim().length === 0){
        setErrors.email = 'Email is required';
    }

    if(phone?.trim().length === 0){
        setErrors.phone = 'Phone is required';
    }

    if(postalcode?.trim().length === 0){
        setErrors.postalcode = 'Postal code is required';
    }

    const errorElement = document.getElementById('error');
    if (errorElement) errorElement.innerText = setErrors.name;
    
    const errorEmailElement = document.getElementById('errorEmail');
    if (errorEmailElement) errorEmailElement.innerText = setErrors.email;
    
    const errorPhoneElement = document.getElementById('errorPhone');
    if (errorPhoneElement) errorPhoneElement.innerText = setErrors.phone;
    
    const errorPostalcodeElement = document.getElementById('errorPostalcode');
    if (errorPostalcodeElement) errorPostalcodeElement.innerText = setErrors.postalcode;

    const hasError = Object.keys(setErrors).some((key) => setErrors[key] !== '');

    if(!hasError){
        fetch('data/create', {
            method: 'POST',
            body: JSON.stringify({name: name, email: email, phone: phone, postalcode: postalcode}),
            headers: {
                'Content-type' : 'application/json',
            },
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.error){

            } else {
                displayContacts();
                const errorElement = document.getElementById('error')
                if(errorElement) errorElement.innerHTML = '';

                if(nameElement instanceof HTMLInputElement){
                    nameElement.value = '';
                }

                if(emailElement instanceof HTMLInputElement){
                    emailElement.value = '';
                }

                if(phoneElement instanceof HTMLInputElement){
                    phoneElement.value = '';
                }

                if(postalcodeElement instanceof HTMLInputElement){
                    postalcodeElement.value = '';
                }
            }
        })
        .catch((error) => console.log(error));
    }
    
};

const displayContacts = () => {
    const contactList = document.getElementById('contact-list');
    if(contactList) contactList.innerHTML = '';

    const table = document.createElement('table');
    if(table) table.className = 'table';

    fetch('/data')
    .then((response ) => response.json())
    .then((data) => {
        data.forEach((contact: any) => {
            const row = document.createElement('tr');

            const nameElement = document.createElement('td');
            nameElement.innerText = contact.name;
            row.appendChild(nameElement);

            const emailElement = document.createElement('td')
            emailElement.innerText = contact.email;
            row.appendChild(emailElement);

            const phoneElement = document.createElement('td');
            phoneElement.innerText = contact.phone;
            row.appendChild(phoneElement);

            const postalcodeElement = document.createElement('td');
            emailElement.innerText = contact.postalcode;
            row.appendChild(postalcodeElement);

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = 'i class="fa fa-trash" aria-hidden="true"></i>';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', () => {
                deleteContact(contact.name)
            });

            const deleteCell = document.createElement('td');
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);

            const updateButton = document.createElement('button');
            updateButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>'
            updateButton.className = 'update-button';
            updateButton.addEventListener('click', () => {
                const modal = document.createElement('dialog');
                
                const form = document.createElement('form');

                const nameInput = document.createElement('input');
                nameInput.id = 'nameInput';
                nameInput.type = 'text';
                nameInput.placeholder = 'Name';

                const emailInput = document.createElement('input');
                emailInput.id = 'emailInput';
                emailInput.type = 'text';
                emailInput.placeholder = 'Email';

                const phoneInput = document.createElement('input');
                phoneInput.id = 'phoneInput';
                phoneInput.type = 'text';
                phoneInput.placeholder = 'Phone';

                const postalcodeInput = document.createElement('input');
                postalcodeInput.id = 'postalcodeInput';
                postalcodeInput.type = 'number';
                postalcodeInput.placeholder = 'Postal code';

                form.appendChild(nameInput);
                form.appendChild(emailInput);
                form.appendChild(phoneInput);
                form.appendChild(postalcodeInput);

                const submitButton = document.createElement('button');
                submitButton.type = 'submit';
                submitButton.textContent = 'Submit';
                form.appendChild(submitButton);

                form.addEventListener('submit', (event) => {
                    event.preventDefault();
                    updateContact(
                        nameElement.innerText, 
                        nameInput.value, 
                        emailElement.innerText, 
                        emailInput.value, 
                        phoneElement.innerText, 
                        phoneInput.value, 
                        postalcodeElement.innerText, 
                        postalcodeInput.value
                    );
                });
                
                modal.appendChild(form);
                document.body.appendChild(modal);
                modal.showModal();
            })

            table.appendChild(row);
            contactList?.appendChild(table);

        })
    })
}

const updateContact = (oldName: string, newName: string, oldEmail: string, newEmail: string, oldPhone: string, newPhone: string, oldPostalCode: string, newPostalCode: string) => {
    fetch('/data/update', {
        method: 'POST',
        body: JSON.stringify({
            oldName: oldName,
            newName: newName,
            oldEmail: oldEmail,
            newEmail: newEmail,
            oldPhone: oldPhone,
            newPhone: newPhone,
            oldPostalCode: oldPostalCode,
            newPostalCode: newPostalCode,
        }),
        headers: {
            'Content-type' : 'application/json'
        }
    })
    .then((response) => response.json())
    .then((data => {
        console.log(data);
        displayContacts();
    }))
    .catch((error) => console.log(error));
};

const deleteContact = (name: string) => {
    fetch('/data/delete', {
        method: 'DELETE',
        body: JSON.stringify({name: name}),
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        displayContacts();
    })
    .catch((error) => console.log(error))
}

const searchContacts = () => {
    let searchTermValue = '';
    const searchTerm = document.getElementById('searchTerm')
    if(searchTerm instanceof HTMLInputElement){
        searchTermValue = searchTerm.value.toLowerCase();
    }

    const table = document.querySelector('.contact-table');
    const rows = document.getElementsByTagName('tr');

    let resultsFound = false;

    for(let rowIndex = 0; rowIndex < rows.length; rowIndex++){
        const cells = rows[rowIndex].getElementsByTagName('td');
        let matchFound = false;

        for(let cellIndex = 0; cellIndex < cells.length; cellIndex++){
            const cellText = cells[cellIndex].textContent ||  cells[cellIndex].innerText;
            if(cellText.toLowerCase().indexOf(searchTermValue) > -1){
                matchFound = true;
                break;
            }
        }

        if(matchFound){
            rows[rowIndex].style.display = '';
            resultsFound = true;
        } else {
            rows[rowIndex].style.display = 'none';
        }
    }

    const noResultsMessage = document.getElementById('no-results-message');
    if(!resultsFound){
        if(!noResultsMessage){
            const message = document.createElement('div');
            message.id = 'no-results-message';
            message.innerHTML = 'No results found';
            document.getElementById('contact-list')?.appendChild(message);
        } else {
            noResultsMessage.textContent = 'No results found';
        }
    } else {
        if(noResultsMessage){
            noResultsMessage.parentNode?.removeChild(noResultsMessage);
        }
    }
}
 const searchInputElement = document.getElementById('searchTerm');
 searchInputElement?.addEventListener('keyup', searchContacts);
