const createContact = (event) => {
    event.preventDefault();
    const name = document.getElementById("contactName").value;
  
    if(name.trim() === ''){
      const errorElement = document.getElementById("error");
      errorElement.innerHTML = "Please enter a contact name";
      return;
    }

    const existingContacts = document.querySelectorAll('#contact-list li span')

  for(let i = 0; i < existingContacts.length; i++){
    if(existingContacts[i].textContent.toLowerCase() === name.toLowerCase()){
      const errorElement = document.getElementById('error')
      errorElement.innerHTML = 'Contact name already exists'
      return; 
    }
  }

    fetch('/data/create', {
      method: "POST",
      body: JSON.stringify({ name: name }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.error) {
      }
       else {
        displayContacts();
        const errorElement = document.getElementById("error")
        errorElement.innerHTML = '';
      }
    })
    .catch(error => console.error(error));
  };
  const contactForm = document.getElementById("contactForm")
  contactForm.addEventListener("submit", createContact)
  
  const displayContacts = () => {
    const contactList = document.getElementById("contact-list");
    contactList.innerHTML = ""; 
    fetch('/data')
      .then(response => response.json())
      .then(data => {
          data.forEach(contact => {
    const listItem = document.createElement("li");
  
    const container = document.createElement("div");
    container.className = "contact-container";
  
    const nameElement = document.createElement("span");
    nameElement.innerText = contact.name;
    container.appendChild(nameElement);
  
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>'
    deleteButton.className = 'delete-button'
    deleteButton.addEventListener("click", () => {
      deleteContact(contact.name);
    });
    container.appendChild(deleteButton);
  
    const updateButton = document.createElement("button");
    updateButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>'
    updateButton.className = 'update-button'
    updateButton.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder='Press enter to confirm'
      input.className='input-update'
      input.value = contact.name;
      input.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
          const new_name = event.target.value;
          const existingContacts = document.querySelectorAll('#contact-list li span')

          for(let i = 0; i < existingContacts.length; i++){
            if(existingContacts[i].textContent.toLowerCase() === new_name.toLowerCase()){
              const errorElement = document.getElementById('errorUpdate')
              errorElement.innerHTML = 'Contact name already exists'
              return; 
            }
          }

          if(new_name.trim() === ''){
            const updateErrorElement = document.getElementById('errorUpdate')
            updateErrorElement.innerHTML = 'Cannot be empty'}
           else {
          updateContact(contact.name, new_name);
          const updateErrorElement = document.getElementById('errorUpdate')
          updateErrorElement.innerHTML = ''
        }}
      });
      const searchInput = document.getElementById("searchTerm")
      searchInput.addEventListener("keyup", searchContacts)
      container.replaceChild(input, nameElement);
      input.focus();
    });
    container.appendChild(updateButton);
    listItem.appendChild(container);
    contactList.appendChild(listItem);
  });
  
      })
      .catch(error => console.error(error));
  };
  
  window.addEventListener('load', () => {
    displayContacts();
  });
  
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
  
  const updateContact = (oldName, newName) => {
    fetch('/data/update', {
      method: "POST",
      body: JSON.stringify({ oldName: oldName, newName: newName }),
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
  
  const searchContacts = () => {
  const searchTerm = document.getElementById("searchTerm").value.toLowerCase();
  const contacts = document.querySelectorAll('#contact-list li');
  let resultsFound = false;

  for(let i = 0; i < contacts.length; i++){
    const contactName = contacts[i].querySelector("span").textContent.toLowerCase();
    if(contactName.indexOf(searchTerm) === -1){
      contacts[i].style.display = 'none';
    } else {
      contacts[i].style.display = 'inline-block';
      resultsFound = true;
    }   
  }

  const noResultMessage = document.getElementById('no-results-message');
  if(!resultsFound){
    if(!noResultMessage){
      const message = document.createElement('div');
      message.id = 'no-results-message';
      message.innerHTML = 'No results found';
      message.style = 'font-size: 20px;'
      document.getElementById('contact-list').appendChild(message);
    } else {
      noResultMessage.textContent = 'No results found';
    }
  } else {
    if(noResultMessage){
      noResultMessage.parentNode.removeChild(noResultMessage);
    }
  }
};