const name = document.getElementById("search");
const myForm = document.getElementById("searchForm");

// function validate(e) {
myForm.addEventListener("submit", function(e){
    if(name.value.length<=0){
        e.preventDefault();
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'You Must Enter a value!';
        name.focus();
    }
    else {
        errorDiv.hidden = true;
    }
  })
  