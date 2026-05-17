let total = 0;

function addTransaction() {

  const desc = document.getElementById("desc").value;
  const amount = Number(document.getElementById("amount").value);

  if(desc === "" || amount === 0){
    alert("Enter valid details");
    return;
  }

  const li = document.createElement("li");
  li.textContent = `${desc} : ₹${amount}`;

  document.getElementById("list").appendChild(li);

  total += amount;

  document.getElementById("total").textContent = total;

  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
}