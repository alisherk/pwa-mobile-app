//offline data persistence 
// enable offline data
db.enablePersistence()
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      // probably multible tabs open at once
      console.log('persistance failed');
    } else if (err.code == 'unimplemented') {
      // lack of browser support for the feature
      console.log('persistance not available');
    }
  });


//real time listeners
db.collection('recipes').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      //add to dom
      renderRecipe(change.doc.data(), change.doc.id);
    }
    if (change.type === 'removed') {
      //remove from dom
       removeRecipe(change.doc.id);
    }
  });
});

//add new recipe 
const form = document.querySelector('form'); 
form.addEventListener('submit', evt => {
  evt.preventDefault(); 

  const recipe = {
    title: form.title.value, 
    ingredients: form.ingredients.value,
    instructions: form.instructions.value
  }; 

  db.collection('recipes').add(recipe)
    .catch(err => console.log(err)); 

    form.title.value = ''; 
    form.ingredients.value ='';
    form.instructions.value = '';
});

//delete a recipe 
const recipeContainer = document.querySelector('.recipes'); 
recipeContainer.addEventListener('click', evt => {
   if(evt.target.tagName === 'I'){
     const id = evt.target.getAttribute('data-id'); 
     db.collection('recipes').doc(id).delete(); 
   }
});
