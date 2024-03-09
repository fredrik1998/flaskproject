const createContact = async (event) => {
  event.preventDefault();
  const name = document.getElementById("contactName").value;
  const email = document.getElementById("contactEmail").value;
  const phone = document.getElementById("contactPhone").value;
  const postalcode = document.getElementById("contactPostalcode").value;

  const setErrors = {
    name: "",
    email: "",
    phone: "",
    postalcode: "",
  };

  if (name.trim() === "") {
    setErrors.name = "Name is required";
  }

  if (email.trim() === "") {
    setErrors.email = "Email is required";
  }

  if (phone.trim() === "") {
    setErrors.phone = "Phone is required";
  }

  if (postalcode.trim() === "") {
    setErrors.postalcode = "Postal Code is required";
  }

  const existingContacts = document.querySelectorAll('#contact-list tr td');

  for(let i = 0; i < existingContacts.length; i++){
    if(existingContacts[i].textContent.toLowerCase() === name.toLowerCase()){
      const errorElement = document.getElementById('error');
      errorElement.innerHTML = 'Contact name already exists';
      return;
    }
  }

  document.getElementById("error").innerText = setErrors.name;
  document.getElementById("errorEmail").innerText = setErrors.email;
  document.getElementById("errorPhone").innerText = setErrors.phone;
  document.getElementById("errorPostalcode").innerText = setErrors.postalcode;

  const hasError = Object.keys(setErrors).some((key) => setErrors[key] !== "");

  if (!hasError) {
    try{
      const response = await fetch("/data/create", {
        method: "POST",
        body: JSON.stringify({ name: name, email: email, phone: phone, postalcode: postalcode }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json();
      console.log(data);
          if (data.error) {
          } else {
            displayContacts();
            const errorElement = document.getElementById("error");
            errorElement.innerHTML = "";
  
            document.getElementById("contactName").value = "";
            document.getElementById("contactEmail").value = "";
            document.getElementById("contactPhone").value = "";
            document.getElementById("contactPostalcode").value = "";
          }
        } catch (error){
          console.log('Error', error)
        }
    } 
  };

const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", createContact);

  const displayContacts = async () => {
    const contactList = document.getElementById('contact-list');
    contactList.innerHTML = '';
    const table = document.createElement('table');
    table.className = 'contact-table';
    try{
      const response = await fetch('/data')
      const data = await response.json();
       data.forEach((contact) => {
         const row = document.createElement('tr');
 
         const nameElement = document.createElement('td');
         nameElement.innerText = contact.name
         row.appendChild(nameElement);
 
         const emailElement = document.createElement('td');
         emailElement.innerText = contact.email;
         row.appendChild(emailElement);
 
         const phoneElement = document.createElement('td');
         phoneElement.innerText = contact.phone;
         row.appendChild(phoneElement);
 
         const postalcodeElement = document.createElement('td');
         postalcodeElement.innerText = contact.postalcode;
         row.appendChild(postalcodeElement);
 
         const deleteButton = document.createElement('button');
         deleteButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>'
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
         nameInput.className = 'input'
 
         const emailInput = document.createElement('input');
         emailInput.id = 'emailInput';
         emailInput.type = 'text';
         emailInput.placeholder = 'Email';
         emailInput.className = 'input'
 
         const phoneInput = document.createElement('input');
         phoneInput.id = 'phoneInput';
         phoneInput.type = 'text';
         phoneInput.placeholder = 'Phone';
         phoneInput.className = 'input'
 
         const postalcodeInput = document.createElement('input');
         postalcodeInput.id = 'postalcodeInput';
         postalcodeInput.type = 'text';
         postalcodeInput.placeholder = 'Postal code';
         postalcodeInput.className = 'input'
 
         form.appendChild(nameInput);
         form.appendChild(emailInput);
         form.appendChild(phoneInput);
         form.appendChild(postalcodeInput);
 
         const submitButton = document.createElement('button');
         submitButton.type = 'submit';
         submitButton.textContent = 'Submit';
         form.appendChild(submitButton);
 
       modal.addEventListener('click', (event) => {
           if (event.target === modal) {
               modal.close();
           }
       });

       form.addEventListener('submit', (event) => {
        event.preventDefault();
        const existingContacts = document.querySelectorAll('#contact-list tr');
        
        for(let i = 0; i < existingContacts.length; i++){
          const nameCell = existingContacts[i].querySelector('td');
          
          if(nameCell.textContent.toLowerCase() === nameInput.value.toLowerCase()){
            const errorElement = document.createElement('div');
            errorElement.style = 'color: red'
            errorElement.innerHTML = 'Name already exists';
            modal.appendChild(errorElement);
            return;
          }
        }
        
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
    
        modal.close();
      });
      
     modal.appendChild(form);
     document.body.appendChild(modal);
     modal.showModal();
 });
 
 
 const updateCell = document.createElement('td');
 updateCell.appendChild(updateButton);
 row.appendChild(updateCell);
 
         table.appendChild(row);
       })
       contactList.append(table)
     } catch(error){
      console.log('Error', error);
     }
   };
 
   window.addEventListener('load', () => {
     displayContacts();
   })  
  
  const deleteContact = name => {
    fetch('/data/delete', {
      method: "POST",
      body: JSON.stringify({ name: name }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      displayContacts();
    })
    .catch(error => console.error(error));
  };
  
  const updateContact = async (oldName, newName, oldEmail, newEmail, oldPhone, newPhone, oldPostalCode, newPostalCode) => {
    try {
      const response = await fetch('/data/update', {
        method: "POST",
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
          "Content-Type": "application/json"
        }
      })
      const data = await response.json();
      console.log(data);
        displayContacts();

    } catch(error){
      console.log(error)
    }
  }
    
  const searchContacts = () => {
    const searchTerm = document.getElementById("searchTerm").value.toLowerCase();
    const table = document.querySelector(".contact-table");
    const rows = table.getElementsByTagName("tr");
  
    let resultsFound = false;
  
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const cells = rows[rowIndex].getElementsByTagName("td");
      let matchFound = false;
  
      for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
        const cellText = cells[cellIndex].textContent || cells[cellIndex].innerText;
  
        if (cellText.toLowerCase().indexOf(searchTerm) > -1) {
          matchFound = true;
          break;
        }
      }

      if (matchFound) {
        rows[rowIndex].style.display = "";
        resultsFound = true;
      } else {
        rows[rowIndex].style.display = "none";
      }
    }
  
    const noResultMessage = document.getElementById("no-results-message");
    if (!resultsFound) {
      if (!noResultMessage) {
        const message = document.createElement("div");
        message.id = "no-results-message";
        message.innerHTML = "No results found";
        message.style = "font-size: 20px;";
        document.getElementById("contact-list").appendChild(message);
      } else {
        noResultMessage.textContent = "No results found";
      }
    } else {
      if (noResultMessage) {
        noResultMessage.parentNode.removeChild(noResultMessage);
      }
    }
  };
  
  const searchInput = document.getElementById("searchTerm");
  searchInput.addEventListener("keyup", searchContacts);
  

