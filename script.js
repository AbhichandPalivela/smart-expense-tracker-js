let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const list = document.getElementById("list");
const totalElement = document.getElementById("total");
const searchInput = document.getElementById("search");
const themeToggle = document.getElementById("themeToggle");

let expenseChart;

function addTransaction() {

    const desc = document.getElementById("desc").value;
    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    if(desc === "" || amount <= 0){
        alert("Please enter valid details");
        return;
    }

    const transaction = {
        desc,
        amount,
        category
    };

    transactions.push(transaction);

    saveData();

    displayTransactions(transactions);

    updateChart();

    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
}

function displayTransactions(data) {

    list.innerHTML = "";

    let total = 0;

    data.forEach((transaction, index) => {

        total += transaction.amount;

        const li = document.createElement("li");

        li.innerHTML = `
            <div class="transaction-info">
                <strong>${transaction.desc}</strong>
                <span class="category">${transaction.category}</span>
                <span>₹${transaction.amount}</span>
            </div>

            <button class="delete-btn" onclick="deleteTransaction(${index})">
                Delete
            </button>
        `;

        list.appendChild(li);
    });

    totalElement.textContent = total;
}

function deleteTransaction(index) {

    transactions.splice(index, 1);

    saveData();

    displayTransactions(transactions);

    updateChart();
}

function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase();

    const filtered = transactions.filter(transaction =>
        transaction.desc.toLowerCase().includes(value)
    );

    displayTransactions(filtered);
});

function updateChart() {

    const categoryTotals = {};

    transactions.forEach(transaction => {

        if(categoryTotals[transaction.category]){
            categoryTotals[transaction.category] += transaction.amount;
        }
        else {
            categoryTotals[transaction.category] = transaction.amount;
        }
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if(expenseChart){
        expenseChart.destroy();
    }

    const ctx = document.getElementById("expenseChart");

    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data
            }]
        }
    });
}

let darkMode = true;

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    darkMode = !darkMode;

    themeToggle.textContent = darkMode ? "🌙" : "☀️";
});

displayTransactions(transactions);
updateChart();